import { useEffect, useState, useCallback } from "react";
import { useParams } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WHATSAPP_BASE_URL } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  MessageCircle,
  Package,
  Clock,
  CreditCard,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

// ─── Mapeamentos de status ────────────────────────────────────────────────────

const PAYMENT_STATUS_LABELS: Record<string, string> = {
  pending: "Aguardando pagamento",
  paid: "Pagamento confirmado",
  failed: "Falha no pagamento",
  overdue: "Pagamento vencido",
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

function paymentBadgeClass(status: string) {
  switch (status) {
    case "paid":     return "bg-lime-acid text-black border-lime-acid";
    case "failed":
    case "overdue":  return "bg-red-500 text-white border-red-500";
    case "refunded": return "bg-gray-500 text-white border-gray-500";
    default:         return "bg-yellow-400 text-black border-yellow-400";
  }
}

function orderBadgeClass(status: string) {
  switch (status) {
    case "paid":          return "bg-lime-acid text-black border-lime-acid";
    case "in_production": return "bg-pink-shock text-white border-pink-shock";
    case "shipped":       return "bg-blue-500 text-white border-blue-500";
    case "delivered":     return "bg-lime-acid text-black border-lime-acid";
    case "cancelled":     return "bg-red-500 text-white border-red-500";
    default:              return "bg-yellow-400 text-black border-yellow-400";
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
  asaas_invoice_url?: string | null;
  asaas_payment_id?: string | null;
  created_at: string;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function OrderConfirmation() {
  const params = useParams<{ order_number: string }>();
  const order_number = params.order_number;

  // Detectar query params de retorno
  const searchParams = new URLSearchParams(window.location.search);
  const paymentParam = searchParams.get("payment");       // "success" | "cancelled" | null
  const paymentError = searchParams.get("payment_error"); // "1" quando o Checkout não foi gerado

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);

  const fetchOrder = useCallback(() => {
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

  useEffect(() => {
    fetchOrder();
  }, [fetchOrder]);

  // Chamado apenas em caso de falha — botão de retry
  async function handleRetryPayment() {
    if (!order_number) return;
    setRetrying(true);
    setRetryError(null);
    try {
      const res = await fetch("/api/payments/asaas/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRetryError(data.error || "Não foi possível gerar o pagamento seguro. Tente novamente.");
      } else {
        // Recarregar pedido para pegar o novo link
        fetchOrder();
        if (data.payment_url) {
          window.open(data.payment_url, "_blank", "noopener,noreferrer");
        }
      }
    } catch {
      setRetryError("Erro de conexão. Tente novamente.");
    } finally {
      setRetrying(false);
    }
  }

  function buildWhatsAppMessage() {
    const text = `Olá, fiz um pedido na Bolsonier Store.\nPedido: ${order_number}\nPreciso de ajuda.`;
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
          <div className="flex flex-col items-center gap-4">
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

  // ─── Derivações de estado ──────────────────────────────────────────────────
  const paymentLabel = PAYMENT_STATUS_LABELS[order.payment_status] ?? order.payment_status;
  const orderLabel = ORDER_STATUS_LABELS[order.order_status] ?? order.order_status;
  const isPaid = order.payment_status === "paid";
  const isFailed = order.payment_status === "failed" || order.payment_status === "overdue";
  const hasPaymentUrl = Boolean(order.asaas_invoice_url);

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* Hero */}
      <div className="pt-24 pb-10 px-4 bg-black">
        <div className="max-w-2xl mx-auto text-center space-y-3">
          {isPaid ? (
            <CheckCircle2 size={56} className="mx-auto text-lime-acid" />
          ) : (
            <CreditCard size={56} className="mx-auto text-pink-shock" />
          )}
          <h1
            className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            {isPaid ? "Pagamento confirmado!" : "Pedido criado!"}
          </h1>
          <p className="text-gray-300 text-sm">
            {isPaid
              ? "Pagamento reconhecido. Seu pedido será encaminhado aos ateliês da Bolsonier Store."
              : "Seu pedido foi registrado. Finalize o pagamento para iniciar a produção."}
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

          {/* Banner: payment_error=1 (fallback do /checkout quando Asaas falhou) */}
          {paymentError === "1" && (
            <div className="flex items-start gap-2 bg-orange-900/40 border-2 border-orange-500 p-4 text-orange-300 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="font-semibold">
                O pagamento seguro não foi gerado automaticamente. Clique em “Tentar gerar pagamento novamente” abaixo.
              </span>
            </div>
          )}

          {/* Banner: payment=cancelled */}
          {paymentParam === "cancelled" && (
            <div className="flex items-start gap-2 bg-yellow-900/40 border-2 border-yellow-500 p-4 text-yellow-300 text-sm">
              <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
              <span className="font-semibold">
                Pagamento não concluído. Você pode tentar novamente clicando em “Pagar Agora” abaixo.
              </span>
            </div>
          )}

          {/* Banner: payment=success (antes do webhook confirmar) */}
          {paymentParam === "success" && !isPaid && (
            <div className="flex items-start gap-2 bg-lime-900/40 border-2 border-lime-500 p-4 text-lime-300 text-sm">
              <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
              <span className="font-semibold">
                Pagamento enviado para confirmação. Aguarde a atualização do status.
              </span>
            </div>
          )}

          {/* Status */}
          <div className="bg-black border-2 border-gray-700 p-5">
            <h2
              className="text-base font-black uppercase tracking-wider text-white mb-4 border-b border-gray-700 pb-3"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Status
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

          {/* ── Bloco de pagamento ── */}
          {!isPaid && (
            <div className="bg-black border-2 border-gray-700 p-5 space-y-4">
              <h2
                className="text-base font-black uppercase tracking-wider text-white border-b border-gray-700 pb-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Finalizar Pagamento
              </h2>

              {/* Caso normal: tem link de pagamento */}
              {hasPaymentUrl && !isFailed && (
                <>
                  <p className="text-sm text-gray-300">
                    Seu pagamento está pronto. Você poderá escolher Pix ou cartão na tela segura do Asaas.
                  </p>
                  <a
                    href={order.asaas_invoice_url!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase text-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors border-2 border-pink-shock hover:border-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    <ExternalLink size={22} />
                    Pagar Agora
                  </a>
                  <p className="text-xs text-gray-500 text-center">
                    Pagamento seguro processado pelo Asaas.
                  </p>
                </>
              )}

              {/* Caso de falha: botão de retry */}
              {(isFailed || (!hasPaymentUrl && !isFailed)) && (
                <>
                  {isFailed ? (
                    <p className="text-sm text-red-400">
                      Houve um problema com o pagamento anterior. Tente gerar um novo pagamento seguro.
                    </p>
                  ) : (
                    <p className="text-sm text-gray-400">
                      O pagamento seguro não foi gerado automaticamente. Clique abaixo para tentar novamente.
                    </p>
                  )}

                  {retryError && (
                    <div className="flex items-start gap-2 bg-red-900/40 border border-red-600 p-3 text-red-400 text-xs">
                      <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                      <span>{retryError}</span>
                    </div>
                  )}

                  <button
                    onClick={handleRetryPayment}
                    disabled={retrying}
                    className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase text-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors border-2 border-pink-shock hover:border-white disabled:opacity-60 disabled:cursor-not-allowed"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    {retrying ? (
                      <>
                        <Loader2 size={22} className="animate-spin" />
                        Gerando pagamento seguro...
                      </>
                    ) : (
                      <>
                        <RefreshCw size={22} />
                        Tentar gerar pagamento novamente
                      </>
                    )}
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Pago: mensagem de confirmação ── */}
          {isPaid && (
            <div className="bg-lime-acid border-2 border-lime-acid p-4 text-black text-center">
              <p className="font-black text-sm uppercase tracking-wider">
                Pagamento reconhecido
              </p>
              <p className="text-xs font-medium mt-1">
                Seu pedido será encaminhado aos ateliês da Bolsonier Store.
              </p>
              {/* TODO: "O Veredito da Bastilha" — easter egg pós-pagamento */}
            </div>
          )}

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

          {/* Botão WhatsApp — suporte ao pedido */}
          <a
            href={buildWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-transparent text-gray-400 py-3 font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 hover:text-green-500 transition-colors border-2 border-gray-700 hover:border-green-600"
          >
            <MessageCircle size={16} />
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
