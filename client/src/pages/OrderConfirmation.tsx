import { useEffect, useState } from "react";
import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WHATSAPP_BASE_URL } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import { CheckCircle2, Loader2, AlertCircle, MessageCircle, Package, Clock } from "lucide-react";

// ─── Mapeamentos de status ────────────────────────────────────────────────────

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pago",
  failed: "Falhou",
  refunded: "Estornado",
};

const ORDER_STATUS_LABELS: Record<string, string> = {
  created: "Pedido criado",
  awaiting_payment: "Aguardando pagamento",
  paid: "Pago",
  in_production: "Em produção",
  shipped: "Enviado",
  delivered: "Entregue",
  cancelled: "Cancelado",
};

// Cores de badge para cada status
function paymentBadgeClass(status: string) {
  switch (status) {
    case "paid":     return "bg-lime-acid text-black border-lime-acid";
    case "failed":   return "bg-red-500 text-white border-red-500";
    case "refunded": return "bg-gray-500 text-white border-gray-500";
    default:         return "bg-yellow-400 text-black border-yellow-400"; // pending
  }
}

function orderBadgeClass(status: string) {
  switch (status) {
    case "paid":            return "bg-lime-acid text-black border-lime-acid";
    case "in_production":   return "bg-pink-shock text-white border-pink-shock";
    case "shipped":         return "bg-blue-500 text-white border-blue-500";
    case "delivered":       return "bg-lime-acid text-black border-lime-acid";
    case "cancelled":       return "bg-red-500 text-white border-red-500";
    default:                return "bg-yellow-400 text-black border-yellow-400"; // created / awaiting
  }
}

// ─── Tipos ────────────────────────────────────────────────────────────────────

interface OrderItem {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface Order {
  order_number: string;
  customer_name: string;
  items: OrderItem[];
  total: number;
  payment_status: string;
  order_status: string;
  created_at: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function OrderConfirmation() {
  const params = useParams<{ order_number: string }>();
  const order_number = params.order_number;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!order_number) return;
    setLoading(true);
    fetch(`/api/orders/${order_number}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.order) {
          setOrder(data.order);
        } else {
          setError(data.error || "Pedido não encontrado.");
        }
      })
      .catch(() => setError("Erro ao buscar pedido. Tente novamente."))
      .finally(() => setLoading(false));
  }, [order_number]);

  function buildWhatsAppMessage() {
    const text = `Olá, fiz um pedido na Bolsonier Store.\nPedido: ${order_number}\nPreciso de ajuda para finalizar.`;
    return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
  }

  function formatDate(iso: string) {
    try {
      return new Date(iso).toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return iso;
    }
  }

  // ─── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-4 text-gray-400">
            <Loader2 size={40} className="animate-spin text-pink-shock" />
            <p className="font-semibold text-white">Carregando pedido...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Erro ──────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <p className="font-black text-xl uppercase tracking-wider text-white">
              Pedido não encontrado
            </p>
            <p className="text-gray-400 text-sm">{error}</p>
            <a
              href="/loja"
              className="inline-block bg-pink-shock text-white px-8 py-3 font-black tracking-wider uppercase text-sm hover:bg-white hover:text-black transition-colors border-2 border-pink-shock"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Voltar à loja
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Sucesso ───────────────────────────────────────────────────────────────
  const paymentLabel = PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status;
  const orderLabel = ORDER_STATUS_LABELS[order.order_status] ?? order.order_status;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Hero de sucesso */}
      <div className="pt-24 pb-10 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          <CheckCircle2 size={56} className="mx-auto text-lime-acid" />
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Pedido criado com sucesso!
          </h1>
          <p className="text-gray-300 text-sm">
            Em breve o pagamento via Pix será gerado.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-gray-950 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-4">

          {/* Número do pedido */}
          <div className="bg-black border-2 border-pink-shock p-6 text-center">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">
              Número do Pedido
            </p>
            <p
              className="text-5xl font-black tracking-widest text-pink-shock"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {order.order_number}
            </p>
          </div>

          {/* Status */}
          <div className="bg-black border-2 border-gray-700 p-5">
            <h2
              className="text-base font-black uppercase tracking-wider text-white mb-4 border-b border-gray-700 pb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Status do Pedido
            </h2>
            <div className="flex flex-wrap gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                  Pagamento
                </p>
                <span
                  className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${paymentBadgeClass(order.payment_status)}`}
                >
                  {paymentLabel}
                </span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                  Pedido
                </p>
                <span
                  className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${orderBadgeClass(order.order_status)}`}
                >
                  {orderLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Itens do pedido */}
          <div className="bg-black border-2 border-gray-700 p-5">
            <h2
              className="text-base font-black uppercase tracking-wider text-white mb-4 border-b border-gray-700 pb-3 flex items-center gap-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <Package size={18} className="text-pink-shock" />
              Itens do Pedido
            </h2>
            <div className="space-y-4">
              {Array.isArray(order.items) && order.items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex justify-between items-start border-b border-gray-800 pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-black text-sm uppercase tracking-wider text-white">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Cor: {item.color} · Tam: {item.size} · Qtd: {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-sm text-pink-shock whitespace-nowrap ml-4">
                    {formatPrice(item.subtotal ?? item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t-2 border-gray-700 pt-4 mt-4">
              <span className="font-black uppercase tracking-wider text-sm text-white">Total</span>
              <span className="font-black text-2xl text-pink-shock">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Data */}
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <Clock size={14} />
            <span>Pedido realizado em {formatDate(order.created_at)}</span>
          </div>

          {/* Aviso de pagamento */}
          <div className="bg-yellow-400 border-2 border-yellow-400 p-4 text-black text-center">
            <p className="font-black text-sm uppercase tracking-wider">
              Aguardando pagamento
            </p>
            <p className="text-xs font-medium mt-1">
              Em breve você receberá a chave Pix para finalizar o pagamento.
            </p>
          </div>

          {/* Botão WhatsApp — suporte ao pedido */}
          <a
            href={buildWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-4 font-black tracking-wider uppercase text-base flex items-center justify-center gap-2 hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <MessageCircle size={20} />
            Falar no WhatsApp sobre este pedido
          </a>

          {/* Continuar comprando */}
          <div className="text-center pb-4">
            <a
              href="/loja"
              className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-white transition-colors underline underline-offset-4"
            >
              Continuar comprando
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
