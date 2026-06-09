import { Link } from "wouter";
import { ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function About() {
  const whatsappHelp = buildWhatsAppHelpMessage();
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #CCFF00 0, #CCFF00 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <h1
            className="font-black uppercase mb-4 leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              textShadow: "4px 4px 0px #FF006E",
            }}
          >
            Sobre
          </h1>
          <p className="text-gray-300 text-xl max-w-xl">
            Streetwear autoral. Atitude urbana. Feito no Brasil.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="font-black uppercase mb-6"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                Bolsonier Store
              </h2>
              <p className="text-lg text-gray-700 mb-4 font-semibold">
                Streetwear com atitude urbana
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Bolsonier Store é uma marca autoral de streetwear que respira a energia das ruas
                brasileiras. Com foco em design contemporâneo, tipografia ousada e conceito visual
                marcante, cada peça é uma declaração de estilo e presença.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Cada peça carrega elementos de pichação contemporânea, tipografia ousada e design
                que não passa despercebido. Porque quem usa Bolsonier não quer passar despercebido.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Trabalhamos com produção sob demanda para garantir qualidade, exclusividade e
                responsabilidade. Cada peça é feita especialmente para você, sem desperdício.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-shock to-lime-acid p-8 text-white border-2 border-black">
              <h3 className="text-2xl font-bold mb-4 uppercase">Detalhes</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="font-bold">Produção:</span>
                  <span>Sob demanda, feita no Brasil</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Prazo:</span>
                  <span>Até 25 dias úteis</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Edição:</span>
                  <span>Limitada</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Material:</span>
                  <span>Malha de qualidade, produto sob demanda</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Pagamento:</span>
                  <span>Via PIX</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Atendimento:</span>
                  <span>WhatsApp +55 47 99610-3720</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto text-center">
          <h2
            className="font-black uppercase mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#CCFF00",
            }}
          >
            Pronto para comprar?
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/loja">
              <a
                className="inline-flex items-center gap-2 bg-pink-shock text-white px-8 py-4 font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 uppercase border-2 border-pink-shock hover:border-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
              >
                Ver loja
                <ArrowRight size={20} />
              </a>
            </Link>
            <a
              href={whatsappHelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-transparent text-white px-8 py-4 font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 uppercase border-2 border-white"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
            >
              <MessageCircle size={20} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
