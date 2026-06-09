import { useEffect, useState } from "react";
import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WHATSAPP_BASE_URL } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import { CheckCircle2, Loader2, AlertCircle, MessageCircle, Package } from "lucide-react";

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

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-green-100 text-green-800 border-green-300",
  failed: "bg-red-100 text-red-800 border-red-300",
  refunded: "bg-gray-100 text-gray-800 border-gray-300",
};

const ORDER_STATUS_COLORS: Record<string, string> = {
  created: "bg-blue-100 text-blue-800 border-blue-300",
  awaiting_payment: "bg-yellow-100 text-yellow-800 border-yellow-300",
  paid: "bg-green-100 text-green-800 border-green-300",
  in_production: "bg-purple-100 text-purple-800 border-purple-300",
  shipped: "bg-indigo-100 text-indigo-800 border-indigo-300",
  delivered: "bg-green-100 text-green-800 border-green-300",
  cancelled: "bg-red-100 text-red-800 border-red-300",
};

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
    const text = `Olá, fiz um pedido na Bolsonier Store.\nPedido: ${order_number}\nQuero finalizar o pagamento.`;
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
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24">
          <div className="flex flex-col items-center gap-4 text-gray-500">
            <Loader2 size={40} className="animate-spin" />
            <p className="font-semibold">Carregando pedido...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // ─── Erro ──────────────────────────────────────────────────────────────────
  if (error || !order) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 px-4">
          <div className="text-center space-y-4 max-w-md">
            <AlertCircle size={48} className="mx-auto text-red-500" />
            <p className="font-black text-xl uppercase tracking-wider">Pedido não encontrado</p>
            <p className="text-gray-500 text-sm">{error}</p>
            <a
              href="/loja"
              className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider uppercase text-sm hover:bg-pink-shock transition-colors border-2 border-black"
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
  const paymentColor = PAYMENT_STATUS_COLORS[order.payment_status] ?? "bg-gray-100 text-gray-800 border-gray-300";
  const orderColor = ORDER_STATUS_COLORS[order.order_status] ?? "bg-gray-100 text-gray-800 border-gray-300";

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-8">

          {/* Banner de sucesso */}
          <div className="bg-black text-white p-6 border-4 border-black text-center space-y-2">
            <CheckCircle2 size={48} className="mx-auto text-lime-acid" />
            <h1
              className="text-3xl font-black uppercase tracking-wider"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Pedido criado com sucesso!
            </h1>
            <p className="text-gray-300 text-sm">
              Status: <span className="text-lime-acid font-bold">Aguardando pagamento</span>
            </p>
            <p className="text-gray-300 text-sm">
              Em breve o pagamento via Pix será gerado.
            </p>
            <p className="text-gray-300 text-sm">
              Para agilizar, fale no WhatsApp.
            </p>
          </div>

          {/* Número do pedido */}
          <div className="border-4 border-black p-4 bg-gray-50 text-center">
            <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Número do Pedido</p>
            <p
              className="text-4xl font-black tracking-widest text-pink-shock"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              {order.order_number}
            </p>
          </div>

          {/* Status */}
          <div className="border-4 border-black p-4 space-y-3">
            <h2
              className="text-lg font-black uppercase tracking-wider border-b-2 border-black pb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Status do Pedido
            </h2>
            <div className="flex flex-wrap gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Pagamento</p>
                <span className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${paymentColor}`}>
                  {paymentLabel}
                </span>
              </div>
              <div>
                <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-1">Pedido</p>
                <span className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${orderColor}`}>
                  {orderLabel}
                </span>
              </div>
            </div>
          </div>

          {/* Itens do pedido */}
          <div className="border-4 border-black p-4 space-y-3">
            <h2
              className="text-lg font-black uppercase tracking-wider border-b-2 border-black pb-2 flex items-center gap-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <Package size={20} />
              Itens do Pedido
            </h2>
            <div className="space-y-3">
              {Array.isArray(order.items) && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start border-b border-gray-200 pb-3 last:border-0">
                  <div>
                    <p className="font-black text-sm uppercase tracking-wider">{item.name}</p>
                    <p className="text-xs text-gray-500">
                      Cor: {item.color} · Tam: {item.size} · Qtd: {item.quantity}
                    </p>
                  </div>
                  <span className="font-black text-sm text-pink-shock whitespace-nowrap ml-4">
                    {formatPrice(item.subtotal ?? item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center border-t-2 border-black pt-3">
              <span className="font-black uppercase tracking-wider text-sm">Total</span>
              <span className="font-black text-xl text-pink-shock">{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Data */}
          <div className="text-center text-xs text-gray-500">
            Pedido realizado em {formatDate(order.created_at)}
          </div>

          {/* Botão WhatsApp */}
          <a
            href={buildWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-green-600 text-white py-4 font-black tracking-wider uppercase text-lg flex items-center justify-center gap-2 hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            <MessageCircle size={22} />
            Falar no WhatsApp para pagar
          </a>

          {/* Voltar à loja */}
          <div className="text-center">
            <a
              href="/loja"
              className="text-xs font-black uppercase tracking-wider text-gray-500 hover:text-black transition-colors underline underline-offset-2"
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
