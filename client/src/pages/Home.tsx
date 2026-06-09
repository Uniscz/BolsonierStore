import { Link } from "wouter";
import { ArrowRight, ShoppingBag, Zap, MessageCircle, Instagram } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialCarousel from "@/components/EditorialCarousel";
import { getFeaturedProducts } from "@/data/products";
import { buildWhatsAppHelpMessage, buildWhatsAppProductMessage } from "@/lib/whatsapp";

const editorialSlides = [
  { src: "/editorial-1.png", alt: "Look Editorial 1 — Bolsonier Store", label: "Coleção O Pix É Nosso" },
  { src: "/editorial-2.png", alt: "Look Editorial 2 — Bolsonier Store", label: "Streetwear Brasileiro" },
  { src: "/editorial-3.png", alt: "Look Editorial 3 — Bolsonier Store", label: "Feito no Brasil" },
  { src: "/editorial-4.png", alt: "Look Editorial 4 — Bolsonier Store", label: "Brazilian Roots · Global Attitude" },
  { src: "/editorial-5.png", alt: "Look Editorial 5 — Bolsonier Store", label: "EST. 24 · São Paulo" },
  { src: "/editorial-6.png", alt: "Look Editorial 6 — Bolsonier Store", label: "Luxury Counterfeit" },
  { src: "/editorial-7.png", alt: "Look Editorial 7 — Bolsonier Store", label: "Ironia Elegante" },
  { src: "/editorial-8.png", alt: "Look Editorial 8 — Bolsonier Store", label: "Vandalismo Refinado" },
  { src: "/editorial-9.png", alt: "Look Editorial 9 — Bolsonier Store", label: "O Pix É Nosso" },
];

const TICKER_ITEMS = [
  "BOLSONIER STORE",
  "O PIX É NOSSO",
  "BOUTIQUE STREETWEAR",
  "SÃO PAULO / BRASIL",
  "LUXURY COUNTERFEIT",
  "IRONIA ELEGANTE",
  "VANDALISMO REFINADO",
  "EST. 24",
];

function Ticker({ bg, color }: { bg: string; color: string }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className="overflow-hidden py-3" style={{ background: bg }}>
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: "ticker 28s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((item, i) => (
          <span
            key={i}
            className="font-black uppercase tracking-widest text-xs flex items-center gap-8"
            style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color, letterSpacing: "0.25em" }}
          >
            {item}
            <span style={{ color: bg === "#FF006E" ? "rgba(255,255,255,0.4)" : "#FF006E" }}>·</span>
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const mainProduct = featuredProducts[0];
  const whatsappHelp = buildWhatsAppHelpMessage();

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF" }}>
      <Header />

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#000000", minHeight: "clamp(520px, 85vh, 900px)", display: "flex", alignItems: "center" }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,0,110,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,110,0.5) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Accent bar left */}
        <div className="absolute left-0 top-0 bottom-0 w-1" style={{ background: "#FF006E" }} />
        {/* Accent bar right */}
        <div className="absolute right-0 top-0 bottom-0 w-1" style={{ background: "#CCFF00" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-20 w-full">
          <div className="max-w-3xl">
            {/* Kicker */}
            <p
              className="mb-4 uppercase tracking-widest"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: "#CCFF00", letterSpacing: "0.35em" }}
            >
              Pré-venda · Produção sob demanda · EST. 24
            </p>

            {/* Title */}
            <h1
              className="uppercase leading-none mb-2"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4rem, 14vw, 10rem)",
                color: "#FFFFFF",
                lineHeight: 0.88,
              }}
            >
              O PIX
            </h1>
            <h1
              className="uppercase leading-none mb-8"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(4rem, 14vw, 10rem)",
                color: "#FF006E",
                lineHeight: 0.88,
              }}
            >
              É NOSSO
            </h1>

            {/* Subtitle */}
            <p
              className="mb-10 max-w-lg leading-relaxed"
              style={{ fontFamily: "'Inter', sans-serif", fontSize: "clamp(0.95rem, 2vw, 1.1rem)", color: "rgba(255,255,255,0.7)" }}
            >
              Streetwear autoral brasileiro. Uma peça urbana, forte e divertida,
              feita para quem entende a piada antes de todo mundo.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4">
              <Link href="/produto/camiseta-pix">
                <a
                  className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider border-2 transition-all duration-200"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", background: "#FF006E", borderColor: "#FF006E", color: "#FFFFFF" }}
                >
                  Comprar Agora
                  <ArrowRight size={18} />
                </a>
              </Link>
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider border-2 transition-all duration-200"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem", background: "transparent", borderColor: "rgba(255,255,255,0.4)", color: "#FFFFFF" }}
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER 1 ── */}
      <Ticker bg="#FF006E" color="#FFFFFF" />

      {/* ── CARROSSEL EDITORIAL ── */}
      <section style={{ background: "#000000" }}>
        <div className="max-w-7xl mx-auto px-0 sm:px-0">
          <div className="text-center pt-12 pb-6 px-4">
            <p
              className="uppercase tracking-widest mb-2"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", color: "#CCFF00", letterSpacing: "0.3em" }}
            >
              Coleção em Destaque
            </p>
            <h2
              className="uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)", color: "#FFFFFF", lineHeight: 1 }}
            >
              O PIX É NOSSO
            </h2>
          </div>
          <EditorialCarousel slides={editorialSlides} autoPlayInterval={4500} />
        </div>
      </section>

      {/* ── TICKER 2 ── */}
      <Ticker bg="#CCFF00" color="#000000" />

      {/* ── PRODUTOS DESTAQUE ── */}
      {mainProduct && (
        <section className="py-20 px-4" style={{ background: "#F5F5F5" }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-4">
              <div>
                <p className="uppercase tracking-widest mb-2" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", color: "#FF006E", letterSpacing: "0.3em" }}>
                  Lançamento
                </p>
                <h2 className="uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 5vw, 3.5rem)", color: "#000", lineHeight: 1 }}>
                  {mainProduct.name}
                </h2>
              </div>
              <Link href="/loja">
                <a className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-sm transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#FF006E" }}>
                  Ver todos <ArrowRight size={16} />
                </a>
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
              {mainProduct.colors.map((color) => (
                <Link key={color.key} href="/produto/camiseta-pix">
                  <a className="group block bg-white border-2 border-black hover:border-pink-shock transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                    <div className="overflow-hidden bg-gray-50" style={{ aspectRatio: "1/1" }}>
                      <img
                        src={color.images.frente}
                        alt={`${mainProduct.name} - ${color.name}`}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="font-black text-xs uppercase tracking-wider mb-1 truncate" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>
                        {color.name}
                      </p>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-base" style={{ color: "#FF006E" }}>{mainProduct.priceDisplay}</span>
                        <span className="text-white text-xs font-black px-2 py-1 transition-colors" style={{ background: "#FF006E", fontFamily: "'Bebas Neue', sans-serif" }}>
                          Ver
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── COMO FUNCIONA ── */}
      <section className="py-20 px-4" style={{ background: "#000000" }}>
        <div className="max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <p className="uppercase tracking-widest mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", color: "#CCFF00", letterSpacing: "0.3em" }}>
              Como funciona
            </p>
            <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2rem, 6vw, 4rem)", color: "#CCFF00", lineHeight: 1 }}>
              Pagamento Exclusivo via PIX
            </h2>
            <p className="text-2xl font-bold mb-4 uppercase tracking-wider" style={{ color: "#FFFFFF" }}>O PIX É NOSSO</p>
            <p className="mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.65)", fontSize: "1rem" }}>
              Nosso modelo é simples e direto: você escolhe, paga via PIX, e nós produzimos
              especialmente para você. Sem intermediários. Sem taxas abusivas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: "01. Escolha", text: "Navegue pela loja e escolha a peça que mais combina com seu estilo." },
                { step: "02. Pague via PIX", text: "Finalize pelo WhatsApp e receba a chave PIX para pagamento." },
                { step: "03. Receba", text: "Após confirmação do pagamento, produzimos e enviamos sua peça." },
              ].map((item) => (
                <div key={item.step} className="p-6 border-2" style={{ borderColor: "#CCFF00" }}>
                  <h3 className="text-lg font-black mb-3 uppercase" style={{ fontFamily: "'Bebas Neue', sans-serif", color: "#CCFF00", fontSize: "1.1rem" }}>{item.step}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.65)" }}>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── INFO STRIP ── */}
      <section className="py-14 px-4" style={{ background: "#FF006E" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
            {[
              { icon: <ShoppingBag size={36} className="mx-auto mb-4 text-white" />, title: "Produção sob demanda", sub: "Feito especialmente para você" },
              { icon: <Zap size={36} className="mx-auto mb-4" style={{ color: "#CCFF00" }} />, title: "Até 25 dias úteis", sub: "Prazo de produção e envio" },
              { icon: <MessageCircle size={36} className="mx-auto mb-4 text-white" />, title: "Atendimento WhatsApp", sub: "+55 47 99610-3720" },
            ].map((item, i) => (
              <div key={i}>
                {item.icon}
                <h3 className="text-lg font-black tracking-wider mb-1 uppercase text-white" style={{ fontFamily: "'Bebas Neue', sans-serif" }}>{item.title}</h3>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.85)" }}>{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SOBRE ── */}
      <section className="py-20 px-4" style={{ background: "#FFFFFF" }}>
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="uppercase tracking-widest mb-3" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", color: "#FF006E", letterSpacing: "0.3em" }}>
                Sobre a Marca
              </p>
              <h2 className="uppercase mb-6" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 6vw, 4.5rem)", color: "#000", lineHeight: 0.9 }}>
                VANDALISMO<br />
                <span style={{ color: "#FF006E" }}>REFINADO</span>
              </h2>
              <p className="mb-4 leading-relaxed" style={{ color: "#444", fontSize: "1rem" }}>
                Bolsonier Store é uma marca autoral de streetwear que respira a energia das ruas
                brasileiras. Com foco em design contemporâneo, tipografia ousada e conceito visual
                marcante, cada peça é uma declaração de estilo e presença.
              </p>
              <p className="mb-8 leading-relaxed" style={{ color: "#444", fontSize: "1rem" }}>
                Luxury Counterfeit. Ironia Elegante. Feito no Brasil para o mundo.
              </p>
              <Link href="/sobre">
                <a className="inline-flex items-center gap-2 font-black uppercase tracking-wider text-sm border-b-2 pb-1 transition-colors" style={{ fontFamily: "'Bebas Neue', sans-serif", borderColor: "#FF006E", color: "#000" }}>
                  Nossa História <ArrowRight size={16} />
                </a>
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {["/editorial-3.png", "/editorial-4.png", "/editorial-7.png", "/editorial-8.png"].map((src, i) => (
                <div key={i} className="overflow-hidden border-2 border-black" style={{ aspectRatio: "3/4" }}>
                  <img src={src} alt={`Editorial ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4 text-center" style={{ background: "#000000" }}>
        <div className="max-w-3xl mx-auto">
          <p className="uppercase tracking-widest mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", letterSpacing: "0.3em" }}>
            BOLSONIER STORE · EST. 24 · SÃO PAULO / BRASIL
          </p>
          <h2 className="uppercase mb-4" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(2.5rem, 8vw, 6rem)", color: "#FFFFFF", lineHeight: 0.9 }}>
            INDEPENDENT<br />
            <span style={{ color: "#FF006E" }}>BRAND.</span>
          </h2>
          <p className="mb-10" style={{ color: "rgba(255,255,255,0.6)", fontSize: "1rem" }}>
            No permission needed. Faça parte de quem constrói, não de quem observa.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/loja">
              <a className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider border-2 transition-all duration-200" style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#FF006E", borderColor: "#FF006E", color: "#FFFFFF" }}>
                Ver Coleção <ArrowRight size={18} />
              </a>
            </Link>
            <a
              href="https://instagram.com/euinelegivel"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-4 font-black uppercase tracking-wider border-2 transition-all duration-200"
              style={{ fontFamily: "'Bebas Neue', sans-serif", background: "transparent", borderColor: "rgba(255,255,255,0.3)", color: "#FFFFFF" }}
            >
              <Instagram size={18} />
              Instagram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
