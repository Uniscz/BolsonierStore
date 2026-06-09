// api/orders.js — Vercel Serverless Function
// POST /api/orders — Cria um novo pedido no Supabase
// GET  /api/orders — Não utilizado nesta rota (ver orders/[order_number].js)

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Variáveis de ambiente SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórias.");
  }
  return createClient(url, key);
}

/**
 * Gera um order_number único no formato BOL-YYYYMMDD-NNN
 * Tenta até 5 vezes para evitar colisão.
 */
async function generateOrderNumber(supabase) {
  const today = new Date();
  const datePart =
    today.getFullYear().toString() +
    String(today.getMonth() + 1).padStart(2, "0") +
    String(today.getDate()).padStart(2, "0");

  for (let attempt = 0; attempt < 5; attempt++) {
    // Conta pedidos do dia para gerar sequencial
    const { count, error: countError } = await supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .like("order_number", `BOL-${datePart}-%`);

    if (countError) throw countError;

    const seq = String((count ?? 0) + 1 + attempt).padStart(3, "0");
    const candidate = `BOL-${datePart}-${seq}`;

    // Verifica se já existe
    const { data: existing } = await supabase
      .from("orders")
      .select("id")
      .eq("order_number", candidate)
      .maybeSingle();

    if (!existing) return candidate;
  }

  // Fallback com timestamp para garantir unicidade
  return `BOL-${datePart}-${Date.now().toString().slice(-6)}`;
}

export default async function handler(req, res) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Método não permitido." });
  }

  let body = req.body;

  // Suporte a body como string (alguns runtimes)
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ success: false, error: "Body inválido." });
    }
  }

  const {
    customer_name,
    customer_whatsapp,
    customer_email,
    customer_document,
    shipping_address,
    items,
    subtotal,
    shipping_value,
    total,
    notes,
  } = body || {};

  // Validação dos campos obrigatórios
  const missing = [];
  if (!customer_name) missing.push("customer_name");
  if (!customer_whatsapp) missing.push("customer_whatsapp");
  if (!items || !Array.isArray(items) || items.length === 0) missing.push("items");
  if (total === undefined || total === null) missing.push("total");

  if (missing.length > 0) {
    return res.status(422).json({
      success: false,
      error: `Campos obrigatórios ausentes: ${missing.join(", ")}`,
    });
  }

  try {
    const supabase = getSupabaseAdmin();
    const order_number = await generateOrderNumber(supabase);

    const now = new Date().toISOString();

    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number,
        customer_name,
        customer_whatsapp,
        customer_email: customer_email || null,
        customer_document: customer_document || null,
        items,                          // jsonb
        shipping_address: shipping_address || null, // jsonb
        subtotal: subtotal ?? 0,
        shipping_value: shipping_value ?? 0,
        total,
        payment_provider: "asaas",      // preparado para futura integração
        payment_status: "pending",
        order_status: "created",
        notes: notes || null,
        created_at: now,
        updated_at: now,
      })
      .select("id, order_number")
      .single();

    if (error) {
      console.error("[api/orders] Supabase insert error:", error);
      return res.status(500).json({ success: false, error: "Erro ao salvar pedido." });
    }

    return res.status(201).json({
      success: true,
      order_number: data.order_number,
      order_id: data.id,
    });
  } catch (err) {
    console.error("[api/orders] Unexpected error:", err);
    return res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
}
