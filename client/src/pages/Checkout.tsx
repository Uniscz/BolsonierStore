import { useState, FormEvent } from "react";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";
import { Loader2, ShoppingBag, AlertCircle } from "lucide-react";

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

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormData>(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redireciona se o carrinho estiver vazio
  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center pt-24 pb-16 px-4">
          <div className="text-center space-y-4">
            <ShoppingBag size={64} className="mx-auto text-gray-300" />
            <p className="font-black text-xl uppercase tracking-wider">Seu carrinho está vazio.</p>
            <a
              href="/produto/camiseta-pix"
              className="inline-block bg-black text-white px-8 py-3 font-black tracking-wider uppercase text-sm hover:bg-pink-shock transition-colors border-2 border-black"
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
  const shipping_value = 0; // frete a combinar

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    // Validação básica
    if (!form.customer_name.trim()) { setError("Nome completo é obrigatório."); return; }
    if (!form.customer_whatsapp.trim()) { setError("WhatsApp é obrigatório."); return; }
    if (!form.cep.trim() || !form.rua.trim() || !form.numero.trim() || !form.bairro.trim() || !form.cidade.trim() || !form.estado) {
      setError("Preencha o endereço completo (CEP, Rua, Número, Bairro, Cidade e Estado)."); return;
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
    try {
      const response = await fetch("/api/orders", {
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

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Erro ao criar pedido.");
      }

      clearCart();
      navigate(`/pedido/${data.order_number}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erro desconhecido.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Título */}
          <h1
            className="text-4xl font-black uppercase tracking-wider mb-8 border-b-4 border-black pb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif" }}
          >
            Finalizar Pedido
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Formulário — 3 colunas */}
            <div className="lg:col-span-3">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Dados pessoais */}
                <section>
                  <h2
                    className="text-xl font-black uppercase tracking-wider mb-4 border-l-4 border-pink-shock pl-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Dados Pessoais
                  </h2>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Nome completo <span className="text-pink-shock">*</span>
                      </label>
                      <input
                        type="text"
                        name="customer_name"
                        value={form.customer_name}
                        onChange={handleChange}
                        placeholder="Seu nome completo"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        WhatsApp <span className="text-pink-shock">*</span>
                      </label>
                      <input
                        type="tel"
                        name="customer_whatsapp"
                        value={form.customer_whatsapp}
                        onChange={handleChange}
                        placeholder="(47) 99999-9999"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        E-mail
                      </label>
                      <input
                        type="email"
                        name="customer_email"
                        value={form.customer_email}
                        onChange={handleChange}
                        placeholder="seu@email.com"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        CPF <span className="text-gray-400 font-normal normal-case">(opcional)</span>
                      </label>
                      <input
                        type="text"
                        name="customer_document"
                        value={form.customer_document}
                        onChange={handleChange}
                        placeholder="000.000.000-00"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                      />
                    </div>
                  </div>
                </section>

                {/* Endereço */}
                <section>
                  <h2
                    className="text-xl font-black uppercase tracking-wider mb-4 border-l-4 border-pink-shock pl-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Endereço de Entrega
                  </h2>
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          CEP <span className="text-pink-shock">*</span>
                        </label>
                        <input
                          type="text"
                          name="cep"
                          value={form.cep}
                          onChange={handleChange}
                          placeholder="00000-000"
                          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Número <span className="text-pink-shock">*</span>
                        </label>
                        <input
                          type="text"
                          name="numero"
                          value={form.numero}
                          onChange={handleChange}
                          placeholder="123"
                          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Rua <span className="text-pink-shock">*</span>
                      </label>
                      <input
                        type="text"
                        name="rua"
                        value={form.rua}
                        onChange={handleChange}
                        placeholder="Nome da rua"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Complemento
                      </label>
                      <input
                        type="text"
                        name="complemento"
                        value={form.complemento}
                        onChange={handleChange}
                        placeholder="Apto, bloco, etc."
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black uppercase tracking-wider mb-1">
                        Bairro <span className="text-pink-shock">*</span>
                      </label>
                      <input
                        type="text"
                        name="bairro"
                        value={form.bairro}
                        onChange={handleChange}
                        placeholder="Bairro"
                        className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Cidade <span className="text-pink-shock">*</span>
                        </label>
                        <input
                          type="text"
                          name="cidade"
                          value={form.cidade}
                          onChange={handleChange}
                          placeholder="Cidade"
                          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase tracking-wider mb-1">
                          Estado <span className="text-pink-shock">*</span>
                        </label>
                        <select
                          name="estado"
                          value={form.estado}
                          onChange={handleChange}
                          className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock bg-white"
                          required
                        >
                          <option value="">UF</option>
                          {ESTADOS.map((uf) => (
                            <option key={uf} value={uf}>{uf}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Observações */}
                <section>
                  <h2
                    className="text-xl font-black uppercase tracking-wider mb-4 border-l-4 border-pink-shock pl-3"
                    style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                  >
                    Observações
                  </h2>
                  <textarea
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    placeholder="Alguma observação sobre o pedido? (opcional)"
                    rows={3}
                    className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:border-pink-shock resize-none"
                  />
                </section>

                {/* Erro */}
                {error && (
                  <div className="flex items-start gap-2 bg-red-50 border-2 border-red-500 p-3 text-red-700 text-sm">
                    <AlertCircle size={16} className="flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Botão */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase text-lg flex items-center justify-center gap-2 hover:bg-black transition-colors border-2 border-pink-shock hover:border-black disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      Criando pedido...
                    </>
                  ) : (
                    "Criar Pedido"
                  )}
                </button>
              </form>
            </div>

            {/* Resumo do carrinho — 2 colunas */}
            <div className="lg:col-span-2">
              <div className="border-4 border-black p-4 sticky top-28">
                <h2
                  className="text-xl font-black uppercase tracking-wider mb-4 border-b-2 border-black pb-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Resumo do Pedido
                </h2>
                <div className="space-y-3 mb-4">
                  {items.map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-3 last:border-0">
                      <p className="font-black text-xs uppercase tracking-wider">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Cor: {item.color} · Tam: {item.size} · Qtd: {item.quantity}
                      </p>
                      <p className="text-sm font-black text-pink-shock mt-1">
                        {formatPrice(item.subtotal)}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="space-y-2 border-t-2 border-black pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Subtotal</span>
                    <span className="font-black">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-semibold">Frete</span>
                    <span className="text-gray-500 text-xs">A combinar</span>
                  </div>
                  <div className="flex justify-between items-center border-t-2 border-black pt-2 mt-2">
                    <span className="font-black uppercase tracking-wider text-sm">Total</span>
                    <span className="font-black text-xl text-pink-shock">{formatPrice(total)}</span>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3 leading-relaxed">
                  O frete será calculado e informado via WhatsApp antes da confirmação do pagamento.
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
