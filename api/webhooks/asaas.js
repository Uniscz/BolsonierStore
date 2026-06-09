// POST /api/webhooks/asaas
// Recebe eventos do Asaas e atualiza o pedido no Supabase.
// Validação via header asaas-access-token (conforme documentação oficial do Asaas).
// Idempotente: eventos duplicados não quebram o status do pedido.

import { createClient } from "@supabase/supabase-js";

// ─── Helper Supabase ──────────────────────────────────────────────────────────

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars não configuradas.");
  return createClient(url, key);
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
  const event = body?.event;
  const payment = body?.payment;

  if (!event) {
    // Evento sem tipo: retornar 200 para não pausar a fila do Asaas
    console.log("[Webhook Asaas] Evento sem tipo recebido:", JSON.stringify(body));
    return res.status(200).json({ received: true });
  }

  console.log(`[Webhook Asaas] Evento recebido: ${event}`);

  // ── 3. Processar apenas eventos relevantes ────────────────────────────────
  const RELEVANT_EVENTS = [
    "PAYMENT_RECEIVED",
    "PAYMENT_CONFIRMED",
    "PAYMENT_OVERDUE",
    "PAYMENT_REFUNDED",
    "PAYMENT_DELETED",
  ];

  if (!RELEVANT_EVENTS.includes(event)) {
    // Evento não relevante: retornar 200 para não pausar a fila
    console.log(`[Webhook Asaas] Evento ignorado: ${event}`);
    return res.status(200).json({ received: true });
  }

  if (!payment) {
    console.warn("[Webhook Asaas] Payload sem objeto payment:", JSON.stringify(body));
    return res.status(200).json({ received: true });
  }

  // externalReference deve ser o order_number
  const orderNumber = payment.externalReference;
  if (!orderNumber) {
    console.warn("[Webhook Asaas] Pagamento sem externalReference:", payment.id);
    return res.status(200).json({ received: true });
  }

  // ── 4. Buscar pedido no Supabase ──────────────────────────────────────────
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

  // ── 5. Montar atualização conforme evento ─────────────────────────────────
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

  // ── 6. Atualizar pedido no Supabase ───────────────────────────────────────
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
