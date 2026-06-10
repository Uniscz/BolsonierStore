// POST /api/payments/asaas/create
// Cria uma sessão de Asaas Checkout para um pedido existente no Supabase.
// Usa POST /v3/checkouts — interface mais limpa que a fatura padrão (invoiceUrl).
// Fallback automático para cobrança avulsa se o Checkout falhar.
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
  // Sandbox: https://sandbox.asaas.com/api/v3
  // Produção: https://api.asaas.com/v3
  return process.env.ASAAS_BASE_URL || "https://sandbox.asaas.com/api/v3";
}

function getAsaasCheckoutBaseUrl() {
  const base = getAsaasBaseUrl();
  // Determina o domínio público do Asaas para montar a URL do checkout
  if (base.includes("sandbox")) {
    return "https://sandbox.asaas.com";
  }
  return "https://www.asaas.com";
}

// Formata data de vencimento como YYYY-MM-DD
function getDueDate(daysAhead = 1) {
  const now = new Date();
  now.setUTCDate(now.getUTCDate() + daysAhead);
  return now.toISOString().split("T")[0];
}

// ─── Estratégia 1: Asaas Checkout (interface mais limpa) ─────────────────────

async function createAsaasCheckout(order, asaasBase, asaasHeaders) {
  const checkoutPublicBase = getAsaasCheckoutBaseUrl();

  // customerData: pré-preenche os dados do cliente na tela do Asaas
  const customerData = {
    name: order.customer_name,
  };
  if (order.customer_document) {
    customerData.cpfCnpj = order.customer_document.replace(/\D/g, "");
  }
  if (order.customer_email) {
    customerData.email = order.customer_email;
  }
  if (order.customer_whatsapp) {
    customerData.mobilePhone = order.customer_whatsapp.replace(/\D/g, "");
  }

  // Endereço (opcional, melhora a experiência de pagamento)
  const addr = order.shipping_address;
  if (addr) {
    if (addr.cep) customerData.postalCode = addr.cep.replace(/\D/g, "");
    if (addr.rua) customerData.address = addr.rua;
    if (addr.numero) customerData.addressNumber = addr.numero;
    if (addr.complemento) customerData.complement = addr.complemento;
    if (addr.bairro) customerData.province = addr.bairro;
  }

  // items[].name: máximo 30 caracteres (limite do Asaas Checkout)
  // O número do pedido vai em externalReference, não aqui.
  const itemDescription = "Bolsonier Store"; // 15 chars — dentro do limite

  // Log seguro antes de criar o checkout (sem dados sensíveis do cliente)
  const siteUrl = process.env.PUBLIC_SITE_URL || "";
  console.log(`[Asaas Checkout] callback enviado:`);
  console.log(`[Asaas Checkout]   successUrl: ${siteUrl}/pedido/${order.order_number}?payment=success`);
  console.log(`[Asaas Checkout]   cancelUrl:  ${siteUrl}/pedido/${order.order_number}?payment=cancelled`);
  console.log(`[Asaas Checkout]   expiredUrl: ${siteUrl}/pedido/${order.order_number}?payment=expired`);
  console.log(`[Asaas Checkout]   autoRedirect: true`);

  const checkoutPayload = {
    // billingTypes: permite Pix e cartão de crédito
    billingTypes: ["PIX", "CREDIT_CARD"],
    // chargeTypes: DETACHED = cobrança avulsa (não recorrente)
    chargeTypes: ["DETACHED"],
    // minutesToExpire: 1440 = 24h (máximo permitido)
    minutesToExpire: 1440,
    externalReference: order.order_number,
    customerData,
    items: [
      {
        name: itemDescription,
        quantity: 1,
        value: Number(order.total),
      },
    ],
    // callback: redireciona para a página do pedido após pagamento.
    // IMPORTANTE (documentação Asaas):
    // - autoRedirect: true é o padrão quando o campo é omitido. Enviá-lo explicitamente
    //   como true é equivalente a omiti-lo. O Asaas SEMPRE exibe a tela intermediária
    //   "Pagamento confirmado" antes de redirecionar — isso é comportamento fixo da
    //   plataforma e não pode ser suprimido via API. O autoRedirect controla apenas se
    //   o redirecionamento ocorre automaticamente (true = 5s countdown) ou via botão
    //   manual (false = botão "Acompanhar meu pedido").
    // - expiredUrl: campo suportado pelo Checkout (confirmado no payload do webhook
    //   CHECKOUT_EXPIRED). Redireciona o cliente se o checkout expirar.
    // - cancelUrl: obrigatório pelo Asaas Checkout.
    // - successUrl deve incluir o domínio completo cadastrado nas configurações
    //   comerciais do Asaas (Configurações da conta → Informações).
    callback: {
      successUrl: `${process.env.PUBLIC_SITE_URL || ""}/pedido/${order.order_number}?payment=success`,
      cancelUrl: `${process.env.PUBLIC_SITE_URL || ""}/pedido/${order.order_number}?payment=cancelled`,
      expiredUrl: `${process.env.PUBLIC_SITE_URL || ""}/pedido/${order.order_number}?payment=expired`,
      autoRedirect: true,
    },
  };

  const res = await fetch(`${asaasBase}/checkouts`, {
    method: "POST",
    headers: asaasHeaders,
    body: JSON.stringify(checkoutPayload),
  });

  const data = await res.json();

  if (!res.ok || !data.id) {
    // Log detalhado para facilitar depuração nos logs da Vercel
    const errDetail = data?.errors?.map((e) => `[${e.code}] ${e.description}`).join(" | ") ||
      data?.message ||
      JSON.stringify(data);
    console.error(`[Asaas Checkout] Falha ao criar checkout para ${order.order_number}: ${errDetail}`);
    console.error("[Asaas Checkout] Payload enviado:", JSON.stringify(checkoutPayload));
    return null;
  }

  // Monta a URL pública do checkout
  // Prioridade: campo "link" retornado pelo Asaas (formato correto)
  // Fallback: path /checkoutSession/show/${data.id} (nunca usar ?id=...)
  const checkoutUrl = data.link || `${checkoutPublicBase}/checkoutSession/show/${data.id}`;
  console.log(`[Asaas Checkout] URL usada: ${checkoutUrl} (fonte: ${data.link ? 'data.link' : 'fallback path'})`);

  return {
    checkoutId: data.id,
    checkoutUrl,
    raw: data,
  };
}

// ─── Estratégia 2: Cobrança avulsa (fallback) ────────────────────────────────

async function createAsaasPayment(order, asaasBase, asaasHeaders) {
  // Criar/recuperar cliente
  let asaasCustomerId = order.asaas_customer_id || null;

  if (!asaasCustomerId) {
    const customerPayload = {
      name: order.customer_name,
      externalReference: order.order_number,
      notificationDisabled: false,
    };
    if (order.customer_email) customerPayload.email = order.customer_email;
    if (order.customer_whatsapp) {
      customerPayload.mobilePhone = order.customer_whatsapp.replace(/\D/g, "");
    }
    if (order.customer_document) {
      customerPayload.cpfCnpj = order.customer_document.replace(/\D/g, "");
    }
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
      const errMsg =
        customerData?.errors?.[0]?.description ||
        customerData?.message ||
        "Erro ao criar cliente no Asaas.";
      throw new Error(errMsg);
    }
    asaasCustomerId = customerData.id;
  }

  // Criar cobrança avulsa — descrição reduzida
  const paymentPayload = {
    customer: asaasCustomerId,
    billingType: process.env.ASAAS_BILLING_TYPE || "UNDEFINED",
    value: Number(order.total),
    dueDate: getDueDate(1),
    description: `Pedido ${order.order_number} - Bolsonier Store`,
    externalReference: order.order_number,
  };

  const paymentRes = await fetch(`${asaasBase}/payments`, {
    method: "POST",
    headers: asaasHeaders,
    body: JSON.stringify(paymentPayload),
  });
  const paymentData = await paymentRes.json();

  if (!paymentRes.ok || !paymentData.id) {
    const errMsg =
      paymentData?.errors?.[0]?.description ||
      paymentData?.message ||
      "Erro ao criar cobrança no Asaas.";
    throw new Error(errMsg);
  }

  return {
    asaasCustomerId,
    asaasPaymentId: paymentData.id,
    invoiceUrl: paymentData.invoiceUrl || paymentData.bankSlipUrl || null,
    raw: paymentData,
  };
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req, res) {
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
      "id, order_number, customer_name, customer_email, customer_whatsapp, customer_document, shipping_address, items, total, payment_status, asaas_payment_id, asaas_invoice_url, asaas_customer_id, asaas_checkout_id"
    )
    .eq("order_number", order_number)
    .single();

  if (fetchError || !order) {
    return res.status(404).json({ success: false, error: "Pedido não encontrado." });
  }

  // ── 2. Pedido já pago ─────────────────────────────────────────────────────
  if (order.payment_status === "paid") {
    return res.status(200).json({
      success: true,
      order_number: order.order_number,
      message: "Este pedido já está pago.",
      payment_status: "paid",
    });
  }

  // ── 3. Reutilizar link existente (idempotência) ───────────────────────────
  if (order.asaas_invoice_url) {
    return res.status(200).json({
      success: true,
      order_number: order.order_number,
      payment_url: order.asaas_invoice_url,
      payment_status: order.payment_status,
      source: "cached",
    });
  }

  // ── 4. Validar total ──────────────────────────────────────────────────────
  const total = Number(order.total);
  if (!total || total <= 0) {
    return res.status(400).json({ success: false, error: "Total do pedido inválido." });
  }

  const asaasBase = getAsaasBaseUrl();
  const asaasHeaders = getAsaasHeaders();

  // ── 5. Tentar Asaas Checkout primeiro ─────────────────────────────────────
  let paymentUrl = null;
  let updatePayload = {
    payment_provider: "asaas",
    payment_status: "pending",
    order_status: "awaiting_payment",
    updated_at: new Date().toISOString(),
  };

  try {
    const checkout = await createAsaasCheckout(order, asaasBase, asaasHeaders);

    if (checkout) {
      // Sucesso com Asaas Checkout
      paymentUrl = checkout.checkoutUrl;
      updatePayload.asaas_invoice_url = paymentUrl;
      updatePayload.asaas_checkout_id = checkout.checkoutId;
      updatePayload.raw_payment_payload = checkout.raw;
      console.log(`[Asaas] Checkout criado para ${order_number}: ${paymentUrl}`);
    } else {
      // Checkout falhou — fallback para cobrança avulsa
      console.log(`[Asaas] Fallback para cobrança avulsa para ${order_number}`);
      const payment = await createAsaasPayment(order, asaasBase, asaasHeaders);
      paymentUrl = payment.invoiceUrl;
      updatePayload.asaas_customer_id = payment.asaasCustomerId;
      updatePayload.asaas_payment_id = payment.asaasPaymentId;
      updatePayload.asaas_invoice_url = paymentUrl;
      updatePayload.raw_payment_payload = payment.raw;
    }
  } catch (err) {
    console.error("[Asaas] Erro ao criar pagamento:", err.message);
    const msg = err.message || "Erro ao criar pagamento no Asaas.";
    // Erros de CPF/CNPJ: retornar mensagem clara
    if (
      msg.toLowerCase().includes("cpf") ||
      msg.toLowerCase().includes("cnpj") ||
      msg.toLowerCase().includes("document")
    ) {
      return res.status(422).json({
        success: false,
        error: "Para gerar o pagamento, informe seu CPF ou CNPJ no campo correspondente.",
        asaas_error: msg,
      });
    }
    return res.status(502).json({ success: false, error: msg });
  }

  // ── 6. Atualizar pedido no Supabase ───────────────────────────────────────
  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_number", order_number);

  if (updateError) {
    console.error(`[Supabase] Erro ao atualizar pedido ${order_number}:`, updateError.message);
    // Não bloquear o cliente — pagamento foi criado
  }

  return res.status(200).json({
    success: true,
    order_number: order.order_number,
    payment_url: paymentUrl,
    payment_status: "pending",
    source: updatePayload.asaas_checkout_id ? "checkout" : "payment",
  });
}
