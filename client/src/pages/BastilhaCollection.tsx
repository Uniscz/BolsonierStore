import { Link } from "wouter";
import { MessageCircle, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function BastilhaCollection() {
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
              "repeating-linear-gradient(45deg, #FF006E 0, #FF006E 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <p
            className="text-pink-shock font-black tracking-widest uppercase text-sm mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.3em" }}
          >
            Coleção
          </p>
          <h1
            className="font-black uppercase mb-4 leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              textShadow: "4px 4px 0px #CCFF00",
            }}
          >
            A BASTILHA
          </h1>
        </div>
      </section>

      {/* Coming Soon */}
      <section className="py-24 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-2xl mx-auto text-center">
            <div
              className="inline-block border-4 border-black px-8 py-4 mb-8 bg-lime-acid"
            >
              <p
                className="font-black uppercase tracking-widest text-2xl text-black"
                style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}
              >
                Drop em preparação
              </p>
            </div>

            <h2
              className="font-black uppercase mb-6 text-4xl"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Em breve
            </h2>

            <p className="text-gray-600 text-lg leading-relaxed mb-8">
              Esta coleção ainda não está disponível para compra. Estamos preparando algo especial.
              Fique de olho nas novidades pelo WhatsApp ou Instagram.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
                style={{ fontFamily: "'Bebas Neue', sans-serif" }}
              >
                <MessageCircle size={20} />
                Avisar quando lançar
              </a>
              <Link href="/loja">
                <a
                  className="inline-flex items-center justify-center gap-2 bg-pink-shock text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-black transition-colors border-2 border-pink-shock hover:border-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Ver loja
                  <ArrowRight size={20} />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
