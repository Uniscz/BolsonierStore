// POST /api/webhooks/asaas
// Recebe eventos do Asaas e atualiza o pedido no Supabase.
// Validação via header asaas-access-token (conforme documentação oficial do Asaas).
// Idempotente: eventos duplicados não quebram o status do pedido.
// Suporta eventos de cobrança avulsa (PAYMENT_*) e de Checkout (CHECKOUT_*).

import { createClient } from "@supabase/supabase-js";

// ─── Helper Supabase ──────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars não configuradas.");
  return createClient(url, key);
}

// ─── Helper: extrair dados do payload de forma segura ────────────────────────
// O Asaas pode enviar o payload em diferentes formatos dependendo do tipo de evento.
// Tentamos extrair os campos relevantes de todas as estruturas possíveis.

function extractPayloadData(body) {
  // Tenta obter o objeto principal do evento (checkout, payment ou object)
  const checkout = body?.checkout ?? null;
  const payment = body?.payment ?? null;
  const obj = body?.object ?? null;

  // event sempre fica na raiz
  const event = body?.event ?? null;

  // checkoutId: pode estar em checkout.id, body.id (quando object=checkout), ou body.checkoutId
  const checkoutId =
    checkout?.id ??
    (obj === "checkout" ? body?.id : null) ??
    body?.checkoutId ??
    null;

  // paymentId: pode estar em payment.id ou body.id (quando object=payment)
  const paymentId =
    payment?.id ??
    (obj === "payment" ? body?.id : null) ??
    body?.paymentId ??
    null;

  // externalReference: pode estar em checkout, payment ou na raiz
  const externalReference =
    checkout?.externalReference ??
    payment?.externalReference ??
    body?.externalReference ??
    null;

  return { event, checkoutId, paymentId, externalReference };
}

// ─── Handler principal ────────────────────────────────────────────────────────

export default async function handler(req, res) {
  // Apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ received: false, error: "Método não permitido." });
  }

  // ── 1. Validar token do webhook ───────────────────────────────────────────
  // O Asaas envia o token configurado no header asaas-access-token
  const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;
  if (webhookToken) {
    const receivedToken = req.headers["asaas-access-token"];
    if (!receivedToken || receivedToken !== webhookToken) {
      console.warn("[Webhook Asaas] Token inválido ou ausente.");
      return res.status(401).json({ received: false, error: "Token inválido." });
    }
  } else {
    // Sem token configurado: logar aviso mas não bloquear (facilita testes iniciais)
    console.warn("[Webhook Asaas] ASAAS_WEBHOOK_TOKEN não configurado — validação desabilitada.");
  }

  // ── 2. Parsear payload ────────────────────────────────────────────────────
  const body = req.body;
  const { event, checkoutId, paymentId, externalReference } = extractPayloadData(body);

  if (!event) {
    // Evento sem tipo: retornar 200 para não pausar a fila do Asaas
    console.log("[Webhook Asaas] Evento sem tipo recebido.");
    return res.status(200).json({ received: true });
  }

  console.log(`[Webhook Asaas] Evento recebido: ${event}`);

  // ── 3. Processar apenas eventos relevantes ────────────────────────────────
  const PAYMENT_EVENTS = [
    "PAYMENT_RECEIVED",
    "PAYMENT_CONFIRMED",
    "PAYMENT_OVERDUE",
    "PAYMENT_REFUNDED",
    "PAYMENT_DELETED",
  ];

  const CHECKOUT_EVENTS = [
    "CHECKOUT_CREATED",
    "CHECKOUT_PAID",
    "CHECKOUT_CANCELED",
    "CHECKOUT_EXPIRED",
  ];

  const isPaymentEvent = PAYMENT_EVENTS.includes(event);
  const isCheckoutEvent = CHECKOUT_EVENTS.includes(event);

  if (!isPaymentEvent && !isCheckoutEvent) {
    // Evento não relevante: retornar 200 para não pausar a fila
    console.log(`[Webhook Asaas] Evento ignorado: ${event}`);
    return res.status(200).json({ received: true });
  }

  // ── 4. Roteamento: Checkout vs Pagamento avulso ───────────────────────────
  if (isCheckoutEvent) {
    return handleCheckoutEvent({ event, checkoutId, externalReference, body, res });
  }

  // Fluxo de pagamento avulso (legado)
  return handlePaymentEvent({ event, body, res });
}

// ─── Tratamento de eventos de Checkout ───────────────────────────────────────

async function handleCheckoutEvent({ event, checkoutId, externalReference, body, res }) {
  // CHECKOUT_CREATED: apenas logar, sem ação necessária
  if (event === "CHECKOUT_CREATED") {
    console.log(`[Webhook Asaas] Checkout criado. checkout id: ${checkoutId ?? "N/A"}`);
    return res.status(200).json({ received: true });
  }

  // Para CHECKOUT_PAID, CHECKOUT_CANCELED e CHECKOUT_EXPIRED precisamos localizar o pedido
  console.log(`[Webhook Asaas] checkout id: ${checkoutId ?? "N/A"}`);
  console.log(`[Webhook Asaas] externalReference: ${externalReference ?? "N/A"}`);

  const supabase = getSupabase();
  let order = null;

  // Tentativa 1: localizar pelo externalReference (order_number)
  if (externalReference) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, payment_status")
      .eq("order_number", externalReference)
      .single();

    if (!error && data) {
      order = data;
    }
  }

  // Tentativa 2: localizar pelo asaas_checkout_id
  if (!order && checkoutId) {
    const { data, error } = await supabase
      .from("orders")
      .select("id, order_number, payment_status")
      .eq("asaas_checkout_id", checkoutId)
      .single();

    if (!error && data) {
      order = data;
    }
  }

  if (!order) {
    console.warn(`[Webhook Asaas] Pedido não encontrado para evento ${event}`);
    // Retornar 200 para não travar a fila do Asaas
    return res.status(200).json({ received: true });
  }

  console.log(`[Webhook Asaas] order_number encontrado: ${order.order_number}`);

  let updatePayload = {
    raw_payment_payload: body,
    updated_at: new Date().toISOString(),
  };

  switch (event) {
    case "CHECKOUT_PAID":
      // Idempotência: se já está pago, não alterar
      if (order.payment_status === "paid") {
        console.log(`[Webhook Asaas] Pedido ${order.order_number} já está pago. Ignorando.`);
        return res.status(200).json({ received: true });
      }
      updatePayload.payment_status = "paid";
      updatePayload.order_status = "paid";
      break;

    case "CHECKOUT_CANCELED":
      // Marcar como falhou apenas se ainda não foi pago
      if (order.payment_status === "paid") {
        console.log(`[Webhook Asaas] Pedido ${order.order_number} já pago, ignorando CHECKOUT_CANCELED.`);
        return res.status(200).json({ received: true });
      }
      updatePayload.payment_status = "failed";
      updatePayload.order_status = "payment_failed";
      break;

    case "CHECKOUT_EXPIRED":
      // Marcar como expirado apenas se ainda não foi pago
      if (order.payment_status === "paid") {
        console.log(`[Webhook Asaas] Pedido ${order.order_number} já pago, ignorando CHECKOUT_EXPIRED.`);
        return res.status(200).json({ received: true });
      }
      updatePayload.payment_status = "expired";
      updatePayload.order_status = "expired";
      break;

    default:
      return res.status(200).json({ received: true });
  }

  // Atualizar pedido no Supabase
  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_number", order.order_number);

  if (updateError) {
    console.error(
      `[Webhook Asaas] Erro ao atualizar pedido ${order.order_number}:`,
      updateError.message
    );
    // Retornar 500 para que o Asaas reenvie o evento
    return res.status(500).json({ received: false, error: "Erro ao atualizar pedido." });
  }

  if (event === "CHECKOUT_PAID") {
    console.log(`[Webhook Asaas] Pedido atualizado para paid: ${order.order_number}`);
  } else {
    console.log(`[Webhook Asaas] Pedido ${order.order_number} atualizado. Evento: ${event}`);
  }

  return res.status(200).json({ received: true });
}

// ─── Tratamento de eventos de Pagamento avulso (legado) ──────────────────────

async function handlePaymentEvent({ event, body, res }) {
  const payment = body?.payment;

  if (!payment) {
    console.warn("[Webhook Asaas] Payload sem objeto payment para evento:", event);
    return res.status(200).json({ received: true });
  }

  // externalReference deve ser o order_number
  const orderNumber = payment.externalReference;
  if (!orderNumber) {
    console.warn("[Webhook Asaas] Pagamento sem externalReference. payment id:", payment.id);
    return res.status(200).json({ received: true });
  }

  // Buscar pedido no Supabase
  const supabase = getSupabase();

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, order_number, payment_status")
    .eq("order_number", orderNumber)
    .single();

  if (fetchError || !order) {
    console.warn(`[Webhook Asaas] Pedido não encontrado: ${orderNumber}`);
    // Retornar 200 para não pausar a fila — pode ser um pedido de outro sistema
    return res.status(200).json({ received: true });
  }

  // Montar atualização conforme evento
  let updatePayload = {
    raw_payment_payload: body,
    updated_at: new Date().toISOString(),
  };

  switch (event) {
    case "PAYMENT_RECEIVED":
    case "PAYMENT_CONFIRMED":
      // Idempotência: se já está pago, não alterar
      if (order.payment_status === "paid") {
        console.log(`[Webhook Asaas] Pedido ${orderNumber} já está pago. Ignorando.`);
        return res.status(200).json({ received: true });
      }
      updatePayload.payment_status = "paid";
      updatePayload.order_status = "paid";
      break;

    case "PAYMENT_REFUNDED":
      updatePayload.payment_status = "refunded";
      // Não alterar order_status automaticamente — pode precisar de ação manual
      break;

    case "PAYMENT_OVERDUE":
      // Marcar como overdue apenas se ainda não foi pago
      if (order.payment_status !== "paid") {
        updatePayload.payment_status = "overdue";
      } else {
        console.log(`[Webhook Asaas] Pedido ${orderNumber} já pago, ignorando OVERDUE.`);
        return res.status(200).json({ received: true });
      }
      break;

    case "PAYMENT_DELETED":
      // Marcar como falhou apenas se ainda não foi pago
      if (order.payment_status !== "paid") {
        updatePayload.payment_status = "failed";
      } else {
        return res.status(200).json({ received: true });
      }
      break;

    default:
      return res.status(200).json({ received: true });
  }

  // Atualizar pedido no Supabase
  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_number", orderNumber);

  if (updateError) {
    console.error(`[Webhook Asaas] Erro ao atualizar pedido ${orderNumber}:`, updateError.message);
    // Retornar 500 para que o Asaas reenvie o evento
    return res.status(500).json({ received: false, error: "Erro ao atualizar pedido." });
  }

  console.log(`[Webhook Asaas] Pedido ${orderNumber} atualizado com sucesso. Evento: ${event}`);
  return res.status(200).json({ received: true });
}
