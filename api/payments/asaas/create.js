// POST /api/payments/asaas/create
// Cria cliente e cobrança no Asaas para um pedido existente no Supabase.
// Nunca expõe ASAAS_API_KEY nem SUPABASE_SECRET_KEY ao frontend.

import { createClient } from "@supabase/supabase-js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars não configuradas.");
  return createClient(url, key);
}

function getAsaasHeaders() {
  const apiKey = process.env.ASAAS_API_KEY;
  if (!apiKey) throw new Error("ASAAS_API_KEY não configurada.");
  return {
    "Content-Type": "application/json",
    accept: "application/json",
    access_token: apiKey,
  };
}

function getAsaasBaseUrl() {
  return process.env.ASAAS_BASE_URL || "https://sandbox.asaas.com/api/v3";
}

function getBillingType() {
  // UNDEFINED permite que o pagador escolha entre Pix e cartão
  return process.env.ASAAS_BILLING_TYPE || "UNDEFINED";
}

// Formata data de vencimento como YYYY-MM-DD (hoje ou amanhã se após 18h)
function getDueDate() {
  const now = new Date();
  // Se for tarde (após 18h BRT), usa amanhã para garantir processamento
  if (now.getUTCHours() >= 21) {
    now.setUTCDate(now.getUTCDate() + 1);
  }
  return now.toISOString().split("T")[0];
}

// Monta descrição legível do pedido
function buildDescription(order) {
  const itemLines = Array.isArray(order.items)
    ? order.items
        .map(
          (item) =>
            `${item.name}, cor ${item.color}, tam ${item.size}, qtd ${item.quantity}`
        )
        .join(" | ")
    : "Itens não disponíveis";

  return (
    `Pedido ${order.order_number} - Bolsonier Store\n` +
    `Itens: ${itemLines}\n` +
    `Cliente: ${order.customer_name}\n` +
    `WhatsApp: ${order.customer_whatsapp || "não informado"}`
  );
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido." });
  }

  const { order_number } = req.body || {};

  if (!order_number || typeof order_number !== "string") {
    return res.status(400).json({ success: false, error: "order_number é obrigatório." });
  }

  const supabase = getSupabase();

  // ── 1. Buscar pedido no Supabase ───────────────────────────────────────────
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_email, customer_whatsapp, customer_document, shipping_address, items, total, payment_status, asaas_payment_id, asaas_invoice_url, asaas_customer_id"
    )
    .eq("order_number", order_number)
    .single();

  if (fetchError || !order) {
    return res.status(404).json({ success: false, error: "Pedido não encontrado." });
  }

  // ── 2. Verificar se já está pago ──────────────────────────────────────────
  if (order.payment_status === "paid") {
    return res.status(200).json({
      success: true,
      order_number: order.order_number,
      message: "Este pedido já está pago.",
      payment_status: "paid",
    });
  }

  // ── 3. Reutilizar cobrança existente se já tiver link ─────────────────────
  if (order.asaas_payment_id && order.asaas_invoice_url) {
    return res.status(200).json({
      success: true,
      order_number: order.order_number,
      asaas_payment_id: order.asaas_payment_id,
      payment_url: order.asaas_invoice_url,
      payment_status: order.payment_status,
    });
  }

  // ── 4. Validar total ──────────────────────────────────────────────────────
  const total = Number(order.total);
  if (!total || total <= 0) {
    return res.status(400).json({ success: false, error: "Total do pedido inválido." });
  }

  const asaasBase = getAsaasBaseUrl();
  const asaasHeaders = getAsaasHeaders();

  // ── 5. Criar/recuperar cliente no Asaas ──────────────────────────────────
  let asaasCustomerId = order.asaas_customer_id || null;

  if (!asaasCustomerId) {
    const customerPayload = {
      name: order.customer_name,
      externalReference: order.order_number, // referência única por pedido
      notificationDisabled: false,
    };

    if (order.customer_email) customerPayload.email = order.customer_email;
    if (order.customer_whatsapp) customerPayload.mobilePhone = order.customer_whatsapp.replace(/\D/g, "");
    if (order.customer_document) customerPayload.cpfCnpj = order.customer_document.replace(/\D/g, "");

    // Endereço (opcional, melhora a experiência de pagamento)
    const addr = order.shipping_address;
    if (addr) {
      if (addr.cep) customerPayload.postalCode = addr.cep.replace(/\D/g, "");
      if (addr.rua) customerPayload.address = addr.rua;
      if (addr.numero) customerPayload.addressNumber = addr.numero;
      if (addr.complemento) customerPayload.complement = addr.complemento;
      if (addr.bairro) customerPayload.province = addr.bairro;
    }

    const customerRes = await fetch(`${asaasBase}/customers`, {
      method: "POST",
      headers: asaasHeaders,
      body: JSON.stringify(customerPayload),
    });

    const customerData = await customerRes.json();

    if (!customerRes.ok || !customerData.id) {
      console.error("[Asaas] Erro ao criar cliente:", JSON.stringify(customerData));
      // Se o Asaas exigir CPF e não foi fornecido, retornar erro claro
      const errMsg =
        customerData?.errors?.[0]?.description ||
        customerData?.message ||
        "Erro ao criar cliente no Asaas.";
      if (errMsg.toLowerCase().includes("cpf") || errMsg.toLowerCase().includes("cnpj") || errMsg.toLowerCase().includes("document")) {
        return res.status(422).json({
          success: false,
          error: "Para gerar o pagamento, informe seu CPF no campo correspondente.",
          asaas_error: errMsg,
        });
      }
      return res.status(502).json({ success: false, error: errMsg });
    }

    asaasCustomerId = customerData.id;
  }

  // ── 6. Criar cobrança no Asaas ────────────────────────────────────────────
  const paymentPayload = {
    customer: asaasCustomerId,
    billingType: getBillingType(),
    value: total,
    dueDate: getDueDate(),
    description: buildDescription(order),
    externalReference: order.order_number,
  };

  const paymentRes = await fetch(`${asaasBase}/payments`, {
    method: "POST",
    headers: asaasHeaders,
    body: JSON.stringify(paymentPayload),
  });

  const paymentData = await paymentRes.json();

  if (!paymentRes.ok || !paymentData.id) {
    console.error("[Asaas] Erro ao criar cobrança:", JSON.stringify(paymentData));
    const errMsg =
      paymentData?.errors?.[0]?.description ||
      paymentData?.message ||
      "Erro ao criar cobrança no Asaas.";
    return res.status(502).json({ success: false, error: errMsg });
  }

  // invoiceUrl é o link da fatura segura do Asaas onde o cliente escolhe Pix ou cartão
  const invoiceUrl = paymentData.invoiceUrl || paymentData.bankSlipUrl || null;

  // ── 7. Atualizar pedido no Supabase ───────────────────────────────────────
  const updatePayload = {
    asaas_customer_id: asaasCustomerId,
    asaas_payment_id: paymentData.id,
    asaas_invoice_url: invoiceUrl,
    payment_provider: "asaas",
    payment_status: "pending",
    order_status: "awaiting_payment",
    raw_payment_payload: paymentData,
    updated_at: new Date().toISOString(),
  };

  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_number", order_number);

  if (updateError) {
    console.error("[Supabase] Erro ao atualizar pedido:", updateError.message);
    // Não falhar a resposta — o pagamento foi criado, só o update falhou
    // Retornar sucesso com aviso para não bloquear o cliente
  }

  return res.status(200).json({
    success: true,
    order_number: order.order_number,
    asaas_payment_id: paymentData.id,
    payment_url: invoiceUrl,
    payment_status: "pending",
  });
}
