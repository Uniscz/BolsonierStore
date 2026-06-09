import { useState } from "react";
import { MessageCircle, MapPin } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppContactMessage, buildWhatsAppHelpMessage, openWhatsApp } from "@/lib/whatsapp";

export default function Contact() {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [message, setMessage] = useState("");
  const whatsappHelp = buildWhatsAppHelpMessage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;
    const url = buildWhatsAppContactMessage(name, contact, message);
    openWhatsApp(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-black text-white py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h1
            className="font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              textShadow: "3px 3px 0px #FF006E",
            }}
          >
            Contato
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Atendimento via WhatsApp</p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact info */}
            <div>
              <h2
                className="font-black uppercase mb-8 text-3xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Fale com a gente
              </h2>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 border-2 border-black">
                  <MessageCircle size={24} className="text-pink-shock flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black uppercase tracking-wider text-sm mb-1">WhatsApp</p>
                    <a
                      href={whatsappHelp}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-bold text-pink-shock hover:text-black transition-colors"
                    >
                      +55 47 99610-3720
                    </a>
                    <p className="text-sm text-gray-500 mt-1">
                      Atendimento para pedidos, dúvidas e suporte
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-4 border-2 border-black">
                  <MapPin size={24} className="text-pink-shock flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-black uppercase tracking-wider text-sm mb-1">Localização</p>
                    <p className="text-lg font-bold">Brasil</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Produção e envio para todo o território nacional
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 p-6 bg-black text-white">
                <h3 className="font-black uppercase tracking-wider mb-3">
                  Atendimento direto
                </h3>
                <p className="text-sm text-gray-300 mb-4">
                  A forma mais rápida de falar com a gente é pelo WhatsApp. Respondemos pedidos,
                  dúvidas sobre tamanhos, frete e pagamento.
                </p>
                <a
                  href={whatsappHelp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <MessageCircle size={20} />
                  Abrir WhatsApp
                </a>
              </div>
            </div>

            {/* Contact form */}
            <div>
              <h2
                className="font-black uppercase mb-8 text-3xl"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                Enviar mensagem
              </h2>
              <p className="text-gray-600 mb-6 text-sm">
                Preencha o formulário abaixo e sua mensagem será enviada diretamente pelo WhatsApp.
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-black uppercase tracking-wider text-xs block mb-2">
                    Nome *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Seu nome"
                    className="w-full border-2 border-black px-4 py-3 font-semibold focus:outline-none focus:border-pink-shock transition-colors"
                  />
                </div>

                <div>
                  <label className="font-black uppercase tracking-wider text-xs block mb-2">
                    Email ou Instagram
                  </label>
                  <input
                    type="text"
                    value={contact}
                    onChange={(e) => setContact(e.target.value)}
                    placeholder="seu@email.com ou @seuinstagram"
                    className="w-full border-2 border-black px-4 py-3 font-semibold focus:outline-none focus:border-pink-shock transition-colors"
                  />
                </div>

                <div>
                  <label className="font-black uppercase tracking-wider text-xs block mb-2">
                    Mensagem *
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Sua mensagem..."
                    className="w-full border-2 border-black px-4 py-3 font-semibold focus:outline-none focus:border-pink-shock transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-green-600 text-white py-4 font-black uppercase tracking-wider hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700 flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
                >
                  <MessageCircle size={20} />
                  Enviar pelo WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
