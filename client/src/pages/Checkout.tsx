import { useEffect, useState, useCallback, FormEvent } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { Loader2, ShoppingBag, AlertCircle, ShoppingCart } from "lucide-react";

interface FormData {
  customer_name: string;
  customer_whatsapp: string;
  customer_email: string;
  customer_document: string;
  cep: string;
  rua: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  notes: string;
}

const INITIAL_FORM: FormData = {
  customer_name: "",
  customer_whatsapp: "",
  customer_email: "",
  customer_document: "",
  cep: "",
  rua: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  estado: "",
  notes: "",
};

const ESTADOS = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO",
];

// ─── Sub-componentes de campo ─────────────────────────────────────────────────

function FieldLabel({ children, required }: { children: React.ReactNode; required?: boolean }) {
  return (
    <label className="block text-xs font-black uppercase tracking-wider mb-1 text-gray-800">
      {children}
      {required && <span className="text-pink-shock ml-1">*</span>}
    </label>
  );
}

function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full border-2 border-gray-800 bg-white text-gray-900 px-3 py-2.5 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-pink-shock transition-colors"
    />
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      className="text-xl font-black uppercase tracking-wider mb-4 text-gray-900 border-l-4 border-pink-shock pl-3"
      style={{ fontFamily: "'Bebas Neue', sans-serif" }}
    >
      {children}
    </h2>
  );
}

// ─── Componente principal ─────────────────────────────────────────────────────

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState<"order" | "payment" | "redirect" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState<string | null>(null);

  // Carrinho vazio — só mostra se não estiver em processo de redirecionamento
  if (items.length === 0 && !redirecting) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
          <div className="text-center space-y-6">
            <ShoppingBag size={64} className="mx-auto text-gray-300" />
            <p className="font-black text-xl uppercase tracking-wider text-gray-900">
              Seu carrinho está vazio.
            </p>
            <a
              href="/produto/camiseta-pix"
              className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider uppercase text-sm hover:bg-pink-shock transition-colors border-2 border-black hover:border-pink-shock"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ver produto
            </a>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping_value = 0;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name === "cep") {
      setCepError(null);
      const digits = value.replace(/\D/g, "");
      if (digits.length === 8) fetchCep(digits);
    }
  }

  const fetchCep = useCallback(async (digits: string) => {
    setCepLoading(true);
    setCepError(null);
    try {
      const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
      const data = await res.json();
      if (data.erro) {
        setCepError("CEP não encontrado.");
        return;
      }
      setForm((prev) => ({
        ...prev,
        rua: data.logradouro || prev.rua,
        bairro: data.bairro || prev.bairro,
        cidade: data.localidade || prev.cidade,
        estado: data.uf || prev.estado,
        complemento: data.complemento || prev.complemento,
      }));
    } catch {
      setCepError("Erro ao buscar CEP. Preencha manualmente.");
    } finally {
      setCepLoading(false);
    }
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!form.customer_name.trim()) { setError("Nome completo é obrigatório."); return; }
    if (!form.customer_whatsapp.trim()) { setError("WhatsApp é obrigatório."); return; }
    if (!form.customer_document.trim()) {
      setError("CPF ou CNPJ é obrigatório para processar o pagamento.");
      return;
    }
    if (!form.cep.trim() || !form.rua.trim() || !form.numero.trim() || !form.bairro.trim() || !form.cidade.trim() || !form.estado) {
      setError("Preencha o endereço completo (CEP, Rua, Número, Bairro, Cidade e Estado).");
      return;
    }

    const shipping_address = {
      cep: form.cep.trim(),
      rua: form.rua.trim(),
      numero: form.numero.trim(),
      complemento: form.complemento.trim(),
      bairro: form.bairro.trim(),
      cidade: form.cidade.trim(),
      estado: form.estado,
    };

    const orderItems = items.map((item) => ({
      product_slug: item.productSlug,
      name: item.name,
      color: item.color,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
      subtotal: item.subtotal,
    }));

    setLoading(true);
    setLoadingStep("order");
    try {
      // Passo 1: Criar pedido no Supabase
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: form.customer_name.trim(),
          customer_whatsapp: form.customer_whatsapp.trim(),
          customer_email: form.customer_email.trim() || undefined,
          customer_document: form.customer_document.trim() || undefined,
          shipping_address,
          items: orderItems,
          subtotal,
          shipping_value,
          total,
          notes: form.notes.trim() || undefined,
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderResponse.ok || !orderData.success) {
        throw new Error(orderData.error || "Erro ao criar pedido.");
      }

      const orderNumber = orderData.order_number;

      // Passo 2: Gerar link de pagamento na InfinityPay
      setLoadingStep("payment");
      let paymentUrl: string | null = null;
      try {
        const paymentResponse = await fetch("/api/payments/infinitepay/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_number: orderNumber }),
        });
        const paymentData = await paymentResponse.json();
        if (paymentResponse.ok && paymentData.success && paymentData.payment_url) {
          paymentUrl = paymentData.payment_url;
        } else {
          console.warn("[Checkout] Falha ao gerar link de pagamento:", paymentData.error);
        }
      } catch (paymentErr) {
          console.warn("[Checkout] Erro ao chamar /api/payments/infinitepay/create:", paymentErr);
      }

      // Passo 3: Redirecionar — limpar carrinho só agora, antes de sair
      clearCart();
      setRedirecting(true);
      if (paymentUrl) {
        setLoadingStep("redirect");
        window.location.href = paymentUrl;
      } else {
        navigate(`/pedido/${orderNumber}?payment_error=1`);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(message);
    } finally {
      setLoading(false);
      setLoadingStep(null);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Faixa de título — fundo preto, compacta */}
      <div className="bg-black pt-20 pb-4 px-4">
        <div className="max-w-5xl mx-auto">
          <h1
            className="text-3xl md:text-4xl font-black uppercase tracking-wider text-white leading-none"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Finalizar Pedido
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Preencha seus dados para criar o pedido.
          </p>
        </div>
      </div>

      <main className="flex-1 bg-gray-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* ── Formulário (3 colunas) ── */}
            <div className="lg:col-span-3 space-y-6">

              {/* Card: Dados pessoais */}
              <div className="bg-white border-2 border-gray-900 p-6">
                <SectionTitle>Dados Pessoais</SectionTitle>
                <div className="space-y-4">
                  <div>
                    <FieldLabel required>Nome completo</FieldLabel>
                    <TextInput
                      type="text"
                      name="customer_name"
                      value={form.customer_name}
                      onChange={handleChange}
                      placeholder="Seu nome completo"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel required>WhatsApp</FieldLabel>
                    <TextInput
                      type="tel"
                      name="customer_whatsapp"
                      value={form.customer_whatsapp}
                      onChange={handleChange}
                      placeholder="(47) 99999-9999"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>E-mail</FieldLabel>
                    <TextInput
                      type="email"
                      name="customer_email"
                      value={form.customer_email}
                      onChange={handleChange}
                      placeholder="seu@email.com"
                    />
                  </div>
                  <div>
                    <FieldLabel required>CPF ou CNPJ</FieldLabel>
                    <TextInput
                      type="text"
                      name="customer_document"
                      value={form.customer_document}
                      onChange={handleChange}
                      placeholder="000.000.000-00 ou 00.000.000/0001-00"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Necessário para processar o pagamento com segurança.
                    </p>
                  </div>
                </div>
              </div>

              {/* Card: Endereço */}
              <div className="bg-white border-2 border-gray-900 p-6">
                <SectionTitle>Endereço de Entrega</SectionTitle>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FieldLabel required>CEP</FieldLabel>
                      <div className="relative">
                        <TextInput
                          type="text"
                          name="cep"
                          value={form.cep}
                          onChange={handleChange}
                          placeholder="00000-000"
                          maxLength={9}
                          required
                        />
                        {cepLoading && (
                          <div className="absolute right-2 top-1/2 -translate-y-1/2">
                            <Loader2 size={16} className="animate-spin text-pink-shock" />
                          </div>
                        )}
                      </div>
                      {cepError && (
                        <p className="text-xs text-red-500 mt-1">{cepError}</p>
                      )}
                      {!cepError && !cepLoading && form.cidade && (
                        <p className="text-xs text-green-600 mt-1">✓ Endereço preenchido automaticamente</p>
                      )}
                    </div>
                    <div>
                      <FieldLabel required>Número</FieldLabel>
                      <TextInput
                        type="text"
                        name="numero"
                        value={form.numero}
                        onChange={handleChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <FieldLabel required>Rua</FieldLabel>
                    <TextInput
                      type="text"
                      name="rua"
                      value={form.rua}
                      onChange={handleChange}
                      placeholder="Nome da rua"
                      required
                    />
                  </div>
                  <div>
                    <FieldLabel>Complemento</FieldLabel>
                    <TextInput
                      type="text"
                      name="complemento"
                      value={form.complemento}
                      onChange={handleChange}
                      placeholder="Apto, bloco, etc."
                    />
                  </div>
                  <div>
                    <FieldLabel required>Bairro</FieldLabel>
                    <TextInput
                      type="text"
                      name="bairro"
                      value={form.bairro}
                      onChange={handleChange}
                      placeholder="Bairro"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-2">
                      <FieldLabel required>Cidade</FieldLabel>
                      <TextInput
                        type="text"
                        name="cidade"
                        value={form.cidade}
                        onChange={handleChange}
                        placeholder="Cidade"
                        required
                      />
                    </div>
                    <div>
                      <FieldLabel required>Estado</FieldLabel>
                      <select
                        name="estado"
                        value={form.estado}
                        onChange={handleChange}
                        required
                        className="w-full border-2 border-gray-800 bg-white text-gray-900 px-3 py-2.5 text-sm font-medium focus:outline-none focus:border-pink-shock transition-colors"
                      >
                        <option value="">UF</option>
                        {ESTADOS.map((uf) => (
                          <option key={uf} value={uf}>{uf}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card: Observações */}
              <div className="bg-white border-2 border-gray-900 p-6">
                <SectionTitle>Observações</SectionTitle>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  placeholder="Alguma observação sobre o pedido? (opcional)"
                  rows={3}
                  className="w-full border-2 border-gray-800 bg-white text-gray-900 px-3 py-2.5 text-sm font-medium placeholder-gray-400 focus:outline-none focus:border-pink-shock transition-colors resize-none"
                />
              </div>

              {/* Erro */}
              {error && (
                <div className="flex items-start gap-2 bg-red-50 border-2 border-red-600 p-4 text-red-700 text-sm font-medium">
                  <AlertCircle size={18} className="flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Botão principal */}
              <button
                type="submit"
                form="checkout-form"
                disabled={loading}
                onClick={handleSubmit}
                className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase text-xl flex items-center justify-center gap-2 hover:bg-black transition-colors border-2 border-pink-shock hover:border-black disabled:opacity-60 disabled:cursor-not-allowed"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                {loading ? (
                  <>
                    <Loader2 size={22} className="animate-spin" />
                    {loadingStep === "redirect"
                      ? "Redirecionando para o pagamento..."
                      : loadingStep === "payment"
                      ? "Gerando pagamento seguro..."
                      : "Criando seu pedido..."}
                  </>
                ) : (
                  <>
                    <ShoppingCart size={22} />
                    Criar Pedido
                  </>
                )}
              </button>
            </div>

            {/* ── Resumo do carrinho (2 colunas) ── */}
            <div className="lg:col-span-2">
              <div className="bg-white border-2 border-gray-900 p-6 lg:sticky lg:top-28">
                <h2
                  className="text-xl font-black uppercase tracking-wider mb-4 text-gray-900 border-b-2 border-gray-900 pb-3"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Resumo do Pedido
                </h2>

                <div className="space-y-4 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                      <p className="font-black text-xs uppercase tracking-wider text-gray-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Cor: <span className="font-semibold text-gray-800">{item.color}</span>
                        {" · "}
                        Tam: <span className="font-semibold text-gray-800">{item.size}</span>
                        {" · "}
                        Qtd: <span className="font-semibold text-gray-800">{item.quantity}</span>
                      </p>
                      <p className="text-sm font-black text-pink-shock mt-1">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 border-t-2 border-gray-900 pt-4">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">Subtotal</span>
                    <span className="font-black text-gray-900">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold text-gray-700">Frete</span>
                    <span className="font-black text-sm" style={{ color: "#A6FF00" }}>GRÁTIS</span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-gray-900 pt-3 mt-2">
                    <span className="font-black uppercase tracking-wider text-sm text-gray-900">Total</span>
                    <span className="font-black text-2xl text-pink-shock">{formatPrice(total)}</span>
                  </div>
                </div>

                <p className="text-xs mt-4 leading-relaxed border-t border-gray-200 pt-3 font-semibold" style={{ color: "#A6FF00" }}>
                  Frete grátis disponível para este endereço.
                </p>
              </div>
            </div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
