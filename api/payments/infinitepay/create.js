// POST /api/payments/infinitepay/create
// Cria um link de pagamento InfinityPay para um pedido existente no Supabase.
// Documentação: https://www.infinitepay.io/checkout-documentacao
// Endpoint: POST https://api.checkout.infinitepay.io/links
// Nunca expõe INFINITEPAY_HANDLE nem SUPABASE_SECRET_KEY ao frontend.

import { createClient } from "@supabase/supabase-js";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars não configuradas.");
  return createClient(url, key);
}

function getInfinityPayHandle() {
  const handle = process.env.INFINITEPAY_HANDLE;
  if (!handle) throw new Error("INFINITEPAY_HANDLE não configurado.");
  // Remove o símbolo $ caso o usuário o tenha incluído
  return handle.replace(/^\$/, "").trim();
}

function getPublicSiteUrl() {
  return (process.env.PUBLIC_SITE_URL || "").replace(/\/$/, "");
}

// ─── Criação do link InfinityPay ──────────────────────────────────────────────

async function createInfinityPayLink(order) {
  const handle = getInfinityPayHandle();
  const siteUrl = getPublicSiteUrl();

  // Valor em centavos (InfinityPay exige inteiro em centavos)
  const totalCents = Math.round(Number(order.total) * 100);

  // Descrição do item — máximo recomendado: 60 chars
  const itemDescription = "Bolsonier Store — Camiseta O Pix É Nosso";

  // Payload conforme documentação InfinityPay
  const payload = {
    handle,
    order_nsu: order.order_number,
    items: [
      {
        quantity: 1,
        price: totalCents,
        description: itemDescription,
      },
    ],
  };

  // redirect_url: para onde o cliente vai após clicar em "Continuar" no checkout
  if (siteUrl) {
    payload.redirect_url = `${siteUrl}/pedido/${order.order_number}?payment=success`;
  }

  // webhook_url: InfinityPay envia POST quando pagamento é confirmado
  if (siteUrl) {
    payload.webhook_url = `${siteUrl}/api/webhooks/infinitepay`;
  }

  // Dados do cliente (pré-preenchimento no checkout)
  const customer = {};
  if (order.customer_name) customer.name = order.customer_name;
  if (order.customer_email) customer.email = order.customer_email;
  if (order.customer_whatsapp) {
    // Formato esperado: +5547999999999
    const digits = order.customer_whatsapp.replace(/\D/g, "");
    customer.phone_number = digits.startsWith("55") ? `+${digits}` : `+55${digits}`;
  }
  if (Object.keys(customer).length > 0) payload.customer = customer;

  // Endereço de entrega (opcional)
  const addr = order.shipping_address;
  if (addr) {
    const address = {};
    if (addr.cep) address.cep = addr.cep.replace(/\D/g, "");
    if (addr.rua) address.street = addr.rua;
    if (addr.bairro) address.neighborhood = addr.bairro;
    if (addr.numero) address.number = addr.numero;
    if (addr.complemento) address.complement = addr.complemento;
    if (Object.keys(address).length > 0) payload.address = address;
  }

  console.log(`[InfinityPay] Criando link para pedido ${order.order_number} — R$ ${order.total}`);

  const res = await fetch("https://api.checkout.infinitepay.io/links", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();

  if (!res.ok) {
    const errDetail =
      (Array.isArray(data?.errors)
        ? data.errors.map((e) => `[${e.code || "ERR"}] ${e.message || e.description || JSON.stringify(e)}`).join(" | ")
        : null) ||
      data?.message ||
      data?.error ||
      JSON.stringify(data);
    console.error(`[InfinityPay] Falha ao criar link para ${order.order_number}: ${errDetail}`);
    console.error("[InfinityPay] Payload enviado:", JSON.stringify(payload));
    throw new Error(`InfinityPay: ${errDetail}`);
  }

  // A API retorna a URL do checkout no campo "url"
  // Exemplo de resposta: { "url": "https://checkout.infinitepay.io/...", "order_nsu": "BS-00001", ... }
  const paymentUrl = data.url || data.payment_url || data.link || null;

  if (!paymentUrl) {
    console.error("[InfinityPay] Resposta sem URL de pagamento:", JSON.stringify(data));
    throw new Error("InfinityPay não retornou URL de pagamento.");
  }

  console.log(`[InfinityPay] Link criado para ${order.order_number}: ${paymentUrl}`);

  return {
    paymentUrl,
    orderNsu: data.order_nsu || order.order_number,
    raw: data,
  };
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido." });
  }

  // Parsing robusto do body — suporta objeto, string e stream (mobile/Safari)
  let reqBody = req.body;
  if (typeof reqBody === "string") {
    try { reqBody = JSON.parse(reqBody); } catch { return res.status(400).json({ success: false, error: "Body inválido." }); }
  } else if (!reqBody || (typeof reqBody === "object" && Object.keys(reqBody).length === 0)) {
    try {
      const raw = await new Promise((resolve, reject) => {
        let data = "";
        req.on("data", (chunk) => { data += chunk.toString(); });
        req.on("end", () => resolve(data));
        req.on("error", reject);
      });
      reqBody = raw ? JSON.parse(raw) : {};
    } catch { return res.status(400).json({ success: false, error: "Body inválido." }); }
  }
  const { order_number } = reqBody || {};

  if (!order_number || typeof order_number !== "string") {
    return res.status(400).json({ success: false, error: "order_number é obrigatório." });
  }

  const supabase = getSupabase();

  // ── 1. Buscar pedido no Supabase ───────────────────────────────────────────
  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select(
      "id, order_number, customer_name, customer_email, customer_whatsapp, customer_document, shipping_address, items, total, payment_status, infinitepay_payment_url"
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
  if (order.infinitepay_payment_url) {
    return res.status(200).json({
      success: true,
      order_number: order.order_number,
      payment_url: order.infinitepay_payment_url,
      payment_status: order.payment_status,
      source: "cached",
    });
  }

  // ── 4. Validar total ──────────────────────────────────────────────────────
  const total = Number(order.total);
  if (!total || total <= 0) {
    return res.status(400).json({ success: false, error: "Total do pedido inválido." });
  }

  // ── 5. Criar link na InfinityPay ──────────────────────────────────────────
  let result;
  try {
    result = await createInfinityPayLink(order);
  } catch (err) {
    console.error("[InfinityPay] Erro ao criar link:", err.message);
    return res.status(502).json({ success: false, error: err.message || "Erro ao criar pagamento na InfinityPay." });
  }

  // ── 6. Atualizar pedido no Supabase ───────────────────────────────────────
  // Update em dois níveis: tenta salvar todos os campos InfinityPay;
  // se falhar (colunas ainda não migradas), faz update apenas dos campos base.
  const baseUpdate = {
    payment_provider: "infinitepay",
    payment_status: "pending",
    order_status: "awaiting_payment",
    updated_at: new Date().toISOString(),
  };

  try {
    const { error: updateFullError } = await supabase
      .from("orders")
      .update({
        ...baseUpdate,
        infinitepay_order_nsu: result.orderNsu,
        infinitepay_payment_url: result.paymentUrl,
      })
      .eq("order_number", order_number);

    if (updateFullError) {
      // Colunas InfinityPay podem não existir ainda no Supabase
      console.warn(`[Supabase] Update completo falhou para ${order_number} (colunas InfinityPay ausentes?): ${updateFullError.message}`);
      const { error: updateBaseError } = await supabase
        .from("orders")
        .update(baseUpdate)
        .eq("order_number", order_number);
      if (updateBaseError) {
        console.error(`[Supabase] Update base também falhou para ${order_number}: ${updateBaseError.message}`);
      }
    }
  } catch (updateErr) {
    // Nunca bloquear o cliente por falha de update
    console.error(`[Supabase] Exceção no update do pedido ${order_number}:`, updateErr?.message);
  }

  return res.status(200).json({
    success: true,
    order_number: order.order_number,
    payment_url: result.paymentUrl,
    payment_status: "pending",
    source: "infinitepay",
  });
}
