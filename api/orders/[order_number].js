// api/orders/[order_number].js — Vercel Serverless Function
// GET /api/orders/:order_number — Retorna dados públicos de um pedido

import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SECRET_KEY;
  if (!url || !key) {
    throw new Error("Variáveis de ambiente SUPABASE_URL e SUPABASE_SECRET_KEY são obrigatórias.");
  }
  return createClient(url, key);
}

export default async function handler(req, res) {
  // CORS básico
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ success: false, error: "Método não permitido." });
  }

  const { order_number } = req.query;

  if (!order_number) {
    return res.status(400).json({ success: false, error: "order_number é obrigatório." });
  }

  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("orders")
      .select(
        "order_number, customer_name, items, total, payment_status, order_status, created_at"
      )
      .eq("order_number", order_number)
      .maybeSingle();

    if (error) {
      console.error("[api/orders/[order_number]] Supabase error:", error);
      return res.status(500).json({ success: false, error: "Erro ao buscar pedido." });
    }

    if (!data) {
      return res.status(404).json({ success: false, error: "Pedido não encontrado." });
    }

    return res.status(200).json({ success: true, order: data });
  } catch (err) {
    console.error("[api/orders/[order_number]] Unexpected error:", err);
    return res.status(500).json({ success: false, error: "Erro interno do servidor." });
  }
}
