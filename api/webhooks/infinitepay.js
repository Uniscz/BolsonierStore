// POST /api/webhooks/infinitepay
// Recebe notificações de pagamento da InfinityPay e atualiza o Supabase.
//
// Formato do payload recebido (conforme documentação InfinityPay):
// {
//   "invoice_slug": "abc123",
//   "amount": 11990,
//   "paid_amount": 11990,
//   "installments": 1,
//   "capture_method": "pix" | "credit_card",
//   "transaction_nsu": "UUID",
//   "order_nsu": "BS-00001",
//   "receipt_url": "https://...",
//   "items": [...]
// }
//
// A InfinityPay espera resposta 200 OK em menos de 1 segundo.
// Se responder 400, ela tentará reenviar.

import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) throw new Error("Supabase env vars não configuradas.");
  return createClient(url, key);
}

export default async function handler(req, res) {
  // Responder apenas POST
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido." });
  }

  const body = req.body || {};

  // Log completo para depuração nos logs da Vercel
  console.log("[InfinityPay Webhook] Payload recebido:", JSON.stringify(body));

  const {
    order_nsu,        // identificador do pedido no nosso sistema
    transaction_nsu,  // ID único da transação na InfinityPay
    capture_method,   // "pix" | "credit_card"
    paid_amount,
    amount,
    invoice_slug,
    receipt_url,
  } = body;

  // ── Validação básica ──────────────────────────────────────────────────────
  if (!order_nsu) {
    console.warn("[InfinityPay Webhook] order_nsu ausente no payload.");
    // Responder 200 para evitar reenvios desnecessários de payloads inválidos
    return res.status(200).json({ success: false, message: "order_nsu ausente." });
  }

  // ── Validação de assinatura (se INFINITEPAY_WEBHOOK_SECRET estiver configurado) ──
  // A InfinityPay pode enviar um header de assinatura no futuro.
  // Por ora, verificamos apenas se o secret está configurado e logamos.
  const webhookSecret = process.env.INFINITEPAY_WEBHOOK_SECRET;
  if (webhookSecret) {
    const receivedSignature =
      req.headers["x-infinitepay-signature"] ||
      req.headers["x-webhook-signature"] ||
      req.headers["authorization"] ||
      null;
    if (!receivedSignature || receivedSignature !== webhookSecret) {
      console.warn(
        `[InfinityPay Webhook] Assinatura inválida para pedido ${order_nsu}. Header recebido: ${receivedSignature}`
      );
      return res.status(400).json({ success: false, message: "Assinatura inválida." });
    }
  }

  // ── Buscar pedido no Supabase ─────────────────────────────────────────────
  let supabase;
  try {
    supabase = getSupabase();
  } catch (err) {
    console.error("[InfinityPay Webhook] Erro ao inicializar Supabase:", err.message);
    return res.status(500).json({ success: false, error: "Erro interno." });
  }

  const { data: order, error: fetchError } = await supabase
    .from("orders")
    .select("id, order_number, payment_status")
    .eq("order_number", order_nsu)
    .single();

  if (fetchError || !order) {
    console.warn(`[InfinityPay Webhook] Pedido não encontrado: ${order_nsu}`);
    // Responder 200 para não causar reenvios de pedidos que não existem
    return res.status(200).json({ success: false, message: "Pedido não encontrado." });
  }

  // ── Idempotência: pedido já pago ──────────────────────────────────────────
  if (order.payment_status === "paid") {
    console.log(`[InfinityPay Webhook] Pedido ${order_nsu} já está pago. Ignorando.`);
    return res.status(200).json({ success: true, message: "Pedido já pago." });
  }

  // ── Atualizar pedido como pago ────────────────────────────────────────────
  const updatePayload = {
    payment_status: "paid",
    order_status: "paid",
    infinitepay_transaction_nsu: transaction_nsu || null,
    raw_payment_payload: body,
    updated_at: new Date().toISOString(),
  };

  // Guardar receipt_url se disponível (pode ser útil para exibir ao cliente)
  if (receipt_url) {
    updatePayload.infinitepay_receipt_url = receipt_url;
  }

  const { error: updateError } = await supabase
    .from("orders")
    .update(updatePayload)
    .eq("order_number", order_nsu);

  if (updateError) {
    console.error(
      `[InfinityPay Webhook] Erro ao atualizar pedido ${order_nsu}:`,
      updateError.message
    );
    // Responder 400 para que a InfinityPay tente reenviar
    return res.status(400).json({ success: false, error: "Erro ao atualizar pedido." });
  }

  console.log(
    `[InfinityPay Webhook] Pedido ${order_nsu} marcado como PAGO.` +
    ` Método: ${capture_method || "desconhecido"}.` +
    ` Valor pago: R$ ${((paid_amount || amount || 0) / 100).toFixed(2)}.` +
    ` Transaction NSU: ${transaction_nsu || "N/A"}.`
  );

  // Responder 200 rapidamente (InfinityPay exige < 1s)
  return res.status(200).json({ success: true, message: "Pagamento registrado." });
}
