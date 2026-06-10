import { useEffect, useState, useCallback, useRef } from "react";
import BastilhaPaidExperience from "@/components/BastilhaPaidExperience";
import { useParams, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { WHATSAPP_BASE_URL } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import {
  Loader2,
  AlertCircle,
  MessageCircle,
  Clock,
  CreditCard,
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Package,
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
  payment_provider?: string | null;
  // InfinityPay
  infinitepay_payment_url?: string | null;
  // Asaas (legado)
  asaas_invoice_url?: string | null;
  asaas_payment_id?: string | null;
  created_at: string;
}

// ─── Constantes de polling ────────────────────────────────────────────────────

const POLL_INTERVAL_MS = 2000;
const POLL_TIMEOUT_MS  = 5 * 60 * 1000;

// ─── Hook de animação de entrada ─────────────────────────────────────────────
// Retorna true após `delay` ms — usado para fade-in escalonado dos blocos
function useDelayedVisible(delay: number, enabled = true): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!enabled) return;
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay, enabled]);
  return visible;
}

// ─── Componente ───────────────────────────────────────────────────────────────

export default function OrderConfirmation() {
  const params = useParams<{ order_number: string }>();
  const order_number = params.order_number;
  const [, navigate] = useLocation();

  const searchParams = new URLSearchParams(window.location.search);
  const paymentParam = searchParams.get("payment");
  const paymentError = searchParams.get("payment_error");

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string | null>(null);
  const [showEasterEgg, setShowEasterEgg] = useState(true);

  // ── Estado de polling ──────────────────────────────────────────────────────
  const [polling, setPolling] = useState(false);
  const [pollingTimedOut, setPollingTimedOut] = useState(false);
  const pollingRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingStartTs = useRef<number>(0);
  const redirectedRef  = useRef(false);

  // ── Animações de entrada (tela paga) ──────────────────────────────────────
  // Só ativam quando isPaid = true e o easter egg foi fechado
  const [readyToAnimate, setReadyToAnimate] = useState(false);
  const v0 = useDelayedVisible(0,   readyToAnimate);
  const v1 = useDelayedVisible(120, readyToAnimate);
  const v2 = useDelayedVisible(280, readyToAnimate);
  const v3 = useDelayedVisible(460, readyToAnimate);
  const v4 = useDelayedVisible(640, readyToAnimate);
  const v5 = useDelayedVisible(820, readyToAnimate);
  const v6 = useDelayedVisible(1020, readyToAnimate);

  // ── fetchOrder ─────────────────────────────────────────────────────────────
  const fetchOrder = useCallback(async (silent = false): Promise<Order | null> => {
    if (!order_number) return null;
    if (!silent) setLoading(true);
    try {
      const res = await fetch(`/api/orders/${order_number}`);
      const data = await res.json();
      if (data.success && data.order) {
        setOrder(data.order);
        return data.order as Order;
      } else {
        setError(data.error || "Pedido não encontrado.");
      }
    } catch {
      setError("Erro ao buscar pedido. Tente novamente.");
    } finally {
      if (!silent) setLoading(false);
    }
    return null;
  }, [order_number]);

  // ── stopPolling ────────────────────────────────────────────────────────────
  const stopPolling = useCallback(() => {
    if (pollingRef.current) {
      clearInterval(pollingRef.current);
      pollingRef.current = null;
    }
    setPolling(false);
  }, []);

  // ── handlePaidDetected ─────────────────────────────────────────────────────
  const handlePaidDetected = useCallback(() => {
    stopPolling();
    if (!redirectedRef.current && paymentParam !== "success") {
      redirectedRef.current = true;
      navigate(`/pedido/${order_number}?payment=success`);
    }
  }, [stopPolling, order_number, paymentParam, navigate]);

  // ── startPolling ───────────────────────────────────────────────────────────
  const startPolling = useCallback(() => {
    if (pollingRef.current) return;
    setPolling(true);
    setPollingTimedOut(false);
    pollingStartTs.current = Date.now();

    pollingRef.current = setInterval(async () => {
      if (Date.now() - pollingStartTs.current >= POLL_TIMEOUT_MS) {
        stopPolling();
        setPollingTimedOut(true);
        return;
      }
      const updated = await fetchOrder(true);
      const paid =
        updated?.payment_status === "paid" || updated?.order_status === "paid";
      if (paid) handlePaidDetected();
    }, POLL_INTERVAL_MS);
  }, [fetchOrder, stopPolling, handlePaidDetected]);

  // ── Limpar interval ao desmontar ───────────────────────────────────────────
  useEffect(() => {
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  // ── Carga inicial + decisão de polling ────────────────────────────────────
  useEffect(() => {
    fetchOrder().then((o) => {
      if (!o) return;
      const paid = o.payment_status === "paid" || o.order_status === "paid";
      if (paid) return;
      const isPending =
        o.payment_status === "pending" ||
        o.order_status === "awaiting_payment" ||
        o.order_status === "created";
      if (paymentParam === "success" || isPending) startPolling();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Verificar status ao voltar ao foco ────────────────────────────────────
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState !== "visible") return;
      fetchOrder(true).then((updated) => {
        if (!updated) return;
        const paid =
          updated.payment_status === "paid" || updated.order_status === "paid";
        if (paid) handlePaidDetected();
      });
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchOrder, handlePaidDetected]);

  // ── Retry de pagamento ─────────────────────────────────────────────────────
  function getRetryEndpoint(provider?: string | null) {
    if (provider === "asaas") return "/api/payments/asaas/create";
    return "/api/payments/infinitepay/create";
  }

  async function handleRetryPayment() {
    if (!order_number || !order) return;
    setRetrying(true);
    setRetryError(null);
    const endpoint = getRetryEndpoint(order.payment_provider);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_number }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRetryError(data.error || "Não foi possível gerar o pagamento seguro. Tente novamente.");
      } else {
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
  const orderLabel   = ORDER_STATUS_LABELS[order.order_status]     ?? order.order_status;
  const isPaid       = order.payment_status === "paid" || order.order_status === "paid";
  const isFailed     = order.payment_status === "failed" || order.payment_status === "overdue";
  const paymentUrl   = order.infinitepay_payment_url || order.asaas_invoice_url || null;
  const hasPaymentUrl = Boolean(paymentUrl);

  // ─── Easter egg Bastilha ───────────────────────────────────────────────────
  if (isPaid && showEasterEgg) {
    return (
      <BastilhaPaidExperience
        order_number={order.order_number}
        onClose={() => {
          setShowEasterEgg(false);
          setReadyToAnimate(true);
        }}
      />
    );
  }

  // ─── Utilitário de animação ────────────────────────────────────────────────
  const fadeIn = (visible: boolean, extraDelay = 0) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(18px)",
    transition: `opacity 0.7s ease ${extraDelay}ms, transform 0.7s ease ${extraDelay}ms`,
  });

  // ─── Render: tela NÃO paga ────────────────────────────────────────────────
  if (!isPaid) {
    return (
      <div className="min-h-screen bg-black flex flex-col">
        <Header />

        {/* Hero pendente */}
        <div className="pt-24 pb-10 px-4 bg-black">
          <div className="max-w-2xl mx-auto text-center space-y-3">
            <CreditCard size={52} className="mx-auto text-pink-shock" />
            <h1
              className="text-4xl md:text-5xl font-black uppercase tracking-wider text-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Pedido criado!
            </h1>
            <p className="text-gray-400 text-sm">
              Finalize o pagamento para iniciar a produção.
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

            {/* Banners de estado */}
            {paymentError === "1" && (
              <div className="flex items-start gap-2 bg-orange-900/40 border-2 border-orange-500 p-4 text-orange-300 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  O pagamento seguro não foi gerado automaticamente. Clique em "Tentar gerar pagamento novamente" abaixo.
                </span>
              </div>
            )}
            {paymentParam === "cancelled" && (
              <div className="flex items-start gap-2 bg-yellow-900/40 border-2 border-yellow-500 p-4 text-yellow-300 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Pagamento não concluído. Você pode tentar novamente clicando em "Pagar Agora" abaixo.
                </span>
              </div>
            )}
            {polling && (
              <div className="flex items-start gap-2 bg-lime-900/40 border-2 border-lime-500 p-4 text-lime-300 text-sm">
                <Loader2 size={18} className="flex-shrink-0 mt-0.5 animate-spin" />
                <div className="space-y-1">
                  <span className="font-semibold block">Aguardando confirmação do pagamento...</span>
                  <span className="text-lime-400/80 text-xs block">
                    Estamos verificando automaticamente. Esta tela será atualizada assim que o pagamento for confirmado.
                  </span>
                </div>
              </div>
            )}
            {!polling && paymentParam === "success" && !pollingTimedOut && (
              <div className="flex items-start gap-2 bg-lime-900/40 border-2 border-lime-500 p-4 text-lime-300 text-sm">
                <CheckCircle2 size={18} className="flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Pagamento enviado. Atualize a página se o status não mudar em breve.
                </span>
              </div>
            )}
            {pollingTimedOut && (
              <div className="flex items-start gap-2 bg-yellow-900/40 border-2 border-yellow-500 p-4 text-yellow-300 text-sm">
                <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                <span className="font-semibold">
                  Pagamento ainda não confirmado. Você pode atualizar esta página em alguns instantes.
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
                  <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Pagamento</p>
                  <span className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${paymentBadgeClass(order.payment_status)}`}>
                    {paymentLabel}
                  </span>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">Pedido</p>
                  <span className={`inline-block px-3 py-1 border-2 text-xs font-black uppercase tracking-wider ${orderBadgeClass(order.order_status)}`}>
                    {orderLabel}
                  </span>
                </div>
              </div>
            </div>

            {/* Bloco de pagamento */}
            <div className="bg-black border-2 border-gray-700 p-5 space-y-4">
              <h2
                className="text-base font-black uppercase tracking-wider text-white border-b border-gray-700 pb-3"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Finalizar Pagamento
              </h2>
              {hasPaymentUrl && !isFailed && (
                <>
                  <p className="text-sm text-gray-300">
                    Seu pagamento está pronto. Escolha Pix ou cartão na tela segura.
                  </p>
                  <a
                    href={paymentUrl!}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase text-xl flex items-center justify-center gap-2 hover:bg-white hover:text-black transition-colors border-2 border-pink-shock hover:border-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    <ExternalLink size={22} />
                    Pagar Agora
                  </a>
                  <p className="text-xs text-gray-500 text-center">Pagamento seguro · Pix ou cartão</p>
                </>
              )}
              {(isFailed || (!hasPaymentUrl && !isFailed)) && (
                <>
                  <p className="text-sm text-red-400">
                    {isFailed
                      ? "Houve um problema com o pagamento anterior. Tente gerar um novo pagamento seguro."
                      : "O pagamento seguro não foi gerado automaticamente. Clique abaixo para tentar novamente."}
                  </p>
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
                      <><Loader2 size={22} className="animate-spin" />Gerando pagamento seguro...</>
                    ) : (
                      <><RefreshCw size={22} />Tentar gerar pagamento novamente</>
                    )}
                  </button>
                </>
              )}
            </div>

            {/* Itens */}
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
                  <div key={idx} className="flex justify-between items-start border-b border-gray-800 pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-black text-sm uppercase tracking-wider text-white">{item.name}</p>
                      <p className="text-xs text-gray-400 mt-1">Cor: {item.color} · Tam: {item.size} · Qtd: {item.quantity}</p>
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

            <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
              <Clock size={14} />
              <span>Pedido realizado em {formatDate(order.created_at)}</span>
            </div>

            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-transparent text-gray-400 py-3 font-bold tracking-wider uppercase text-xs flex items-center justify-center gap-2 hover:text-green-500 transition-colors border-2 border-gray-700 hover:border-green-600"
            >
              <MessageCircle size={16} />
              Falar no WhatsApp sobre este pedido
            </a>

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

  // ─── Render: tela PAGA (redesenhada) ──────────────────────────────────────
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Header />

      {/* ── ZONA EMOCIONAL ── fundo preto, tipografia editorial ── */}
      <section className="bg-black pt-28 pb-16 px-4">
        <div className="max-w-xl mx-auto text-center">

          {/* Linha decorativa topo — fade-in 0 */}
          <div
            style={{
              ...fadeIn(v0),
              width: "1px",
              height: "3.5rem",
              background: "linear-gradient(to bottom, transparent, rgba(255,0,110,0.5))",
              margin: "0 auto 2.5rem",
            }}
          />

          {/* Label "Passagem confirmada" */}
          <p
            style={{
              ...fadeIn(v0),
              fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
              fontSize: "clamp(0.65rem, 1.5vw, 0.8rem)",
              fontWeight: 300,
              letterSpacing: "0.35em",
              color: "rgba(245,240,232,0.45)",
              textTransform: "uppercase",
              marginBottom: "1rem",
            }}
          >
            Passagem confirmada
          </p>

          {/* Número do pedido — protagonista */}
          <h1
            style={{
              ...fadeIn(v1),
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 12vw, 7rem)",
              letterSpacing: "0.12em",
              color: "#fff",
              lineHeight: 1,
              marginBottom: "0.5rem",
            }}
          >
            {order.order_number}
          </h1>

          {/* Separador com ponto rosa */}
          <div
            style={{
              ...fadeIn(v2),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1rem",
              margin: "1.75rem auto",
            }}
          >
            <div style={{ width: "clamp(2rem, 8vw, 5rem)", height: "1px", background: "rgba(255,255,255,0.12)" }} />
            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#FF006E" }} />
            <div style={{ width: "clamp(2rem, 8vw, 5rem)", height: "1px", background: "rgba(255,255,255,0.12)" }} />
          </div>

          {/* Frase editorial */}
          <p
            style={{
              ...fadeIn(v2),
              fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
              fontSize: "clamp(1rem, 3vw, 1.5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.04em",
              color: "rgba(245,240,232,0.75)",
              lineHeight: 1.6,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Sua peça entra em produção. Feita sob demanda, só para você.
          </p>

          {/* Badge de status — lime acid */}
          <div
            style={{
              ...fadeIn(v3),
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              marginTop: "2rem",
              padding: "0.5rem 1.25rem",
              background: "rgba(204,255,0,0.08)",
              border: "1px solid rgba(204,255,0,0.35)",
            }}
          >
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#CCFF00" }} />
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.7rem",
                letterSpacing: "0.28em",
                color: "#CCFF00",
                textTransform: "uppercase",
              }}
            >
              Pagamento confirmado
            </span>
          </div>

        </div>
      </section>

      {/* ── ZONA FUNCIONAL ── fundo levemente diferente, informações práticas ── */}
      <main className="flex-1 px-4 py-10" style={{ background: "#0a0a0a" }}>
        <div className="max-w-xl mx-auto space-y-px">

          {/* Itens do pedido */}
          <div
            style={fadeIn(v4)}
            className="bg-black p-6 border-b border-white/5"
          >
            <p
              className="text-xs font-black uppercase tracking-widest mb-5"
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: "rgba(255,255,255,0.3)" }}
            >
              Itens
            </p>
            <div className="space-y-5">
              {Array.isArray(order.items) && order.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div className="flex-1 pr-4">
                    <p
                      className="font-black text-sm uppercase tracking-wider text-white"
                      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs mt-1" style={{ color: "rgba(255,255,255,0.35)", letterSpacing: "0.05em" }}>
                      {item.color} · {item.size} · {item.quantity}×
                    </p>
                  </div>
                  <span
                    className="font-black text-sm whitespace-nowrap"
                    style={{ color: "#FF006E", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.05em" }}
                  >
                    {formatPrice(item.subtotal ?? item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="flex justify-between items-center mt-6 pt-5"
              style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              <span
                className="text-xs font-black uppercase tracking-widest"
                style={{ fontFamily: "'Bebas Neue', sans-serif", color: "rgba(255,255,255,0.35)" }}
              >
                Total
              </span>
              <span
                className="font-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.4rem, 4vw, 1.9rem)", color: "#FF006E", letterSpacing: "0.05em" }}
              >
                {formatPrice(order.total)}
              </span>
            </div>
          </div>

          {/* Status do pedido */}
          <div
            style={fadeIn(v5)}
            className="bg-black p-6 border-b border-white/5"
          >
            <p
              className="text-xs font-black uppercase tracking-widest mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", color: "rgba(255,255,255,0.3)" }}
            >
              Status
            </p>
            <div className="flex flex-wrap gap-3">
              <span className={`inline-block px-3 py-1 border text-xs font-black uppercase tracking-wider ${paymentBadgeClass(order.payment_status)}`}>
                {paymentLabel}
              </span>
              <span className={`inline-block px-3 py-1 border text-xs font-black uppercase tracking-wider ${orderBadgeClass(order.order_status)}`}>
                {orderLabel}
              </span>
            </div>
          </div>

          {/* Data */}
          <div
            style={fadeIn(v5)}
            className="bg-black px-6 py-4 border-b border-white/5 flex items-center gap-2"
          >
            <Clock size={13} style={{ color: "rgba(255,255,255,0.2)" }} />
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.25)", letterSpacing: "0.05em" }}>
              Pedido em {formatDate(order.created_at)}
            </span>
          </div>

          {/* Ações */}
          <div style={{ ...fadeIn(v6), paddingTop: "2rem" }} className="space-y-3">

            {/* WhatsApp — destaque secundário */}
            <a
              href={buildWhatsAppMessage()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-4 font-black tracking-wider uppercase text-sm transition-colors"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.8rem",
                letterSpacing: "0.2em",
                color: "rgba(255,255,255,0.5)",
                border: "1px solid rgba(255,255,255,0.1)",
                background: "transparent",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "#4ade80";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(74,222,128,0.35)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.5)";
                (e.currentTarget as HTMLAnchorElement).style.borderColor = "rgba(255,255,255,0.1)";
              }}
            >
              <MessageCircle size={15} />
              Falar no WhatsApp sobre este pedido
            </a>

            {/* Continuar comprando — link discreto */}
            <div className="text-center pt-2 pb-6">
              <a
                href="/loja"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "0.65rem",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.18)",
                  textDecoration: "none",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.18)")}
              >
                Continuar comprando
              </a>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
