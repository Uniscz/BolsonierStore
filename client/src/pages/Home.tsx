import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import EditorialCarousel from "@/components/EditorialCarousel";
import { getFeaturedProducts } from "@/data/products";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const mainProduct = featuredProducts[0];

  return (
    <div style={{ background: "#000", color: "#fff", minHeight: "100vh" }}>
      <Header />

      {/* HERO */}
      <section
        className="relative overflow-hidden"
        style={{ background: "#000", minHeight: "clamp(600px, 90vh, 1000px)", display: "flex", alignItems: "center" }}
      >
        {/* Grid texture */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(rgba(255,0,102,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,0,102,0.04) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            opacity: 0.6,
          }}
        />
        {/* Vertical accent bars */}
        <div className="absolute left-0 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, #FF0066, transparent)" }} />
        <div className="absolute right-0 top-0 bottom-0 w-px" style={{ background: "linear-gradient(to bottom, transparent, #A6FF00, transparent)" }} />

        <div className="relative z-10 container-shell py-24 w-full">
          <div className="max-w-4xl">
            <div className="kicker mb-6 animate-fade-up">
              Boutique Streetwear · Producao sob demanda · EST. 24
            </div>
            <h1
              className="headline-hero animate-fade-up delay-100"
              style={{ color: "#fff" }}
            >
              BOL<span style={{ color: "#FF0066" }}>S</span>ONIER
            </h1>
            <div className="flex items-center gap-4 mb-8 animate-fade-up delay-200" style={{ borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: "1rem" }}>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
              <span style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(1.2rem, 3vw, 2.2rem)", letterSpacing: "0.5em", color: "rgba(255,255,255,0.85)" }}>
                S T O R E
              </span>
              <div className="h-px flex-1" style={{ background: "rgba(255,255,255,0.12)" }} />
            </div>
            <p className="body-lg max-w-xl mb-10 animate-fade-up delay-300">
              Luxury Counterfeit. Ironia Elegante. Vandalismo Refinado. Feito no Brasil para o mundo.
            </p>
            <div className="flex flex-wrap gap-4 animate-fade-up delay-400">
              <Link href="/loja">
                <a className="btn-primary">
                  Ver Colecao
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </Link>
              <Link href="/sobre">
                <a className="btn-secondary">Nossa Historia</a>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 right-8 flex flex-col items-center gap-2">
          <div className="h-12 w-px" style={{ background: "linear-gradient(to bottom, transparent, #FF0066)" }} />
          <span style={{ fontSize: "0.5rem", fontWeight: 700, letterSpacing: "0.25em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", writingMode: "vertical-rl" }}>SCROLL</span>
        </div>
      </section>

      {/* TICKER ACID GREEN */}
      <div className="ticker-wrap" style={{ background: "#A6FF00", padding: "0.6rem 0" }}>
        <div className="ticker-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="ticker-item" style={{ color: "#000", fontWeight: 800 }}>
              BOLSONIER STORE &nbsp;·&nbsp; O PIX E NOSSO &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; SAO PAULO / BRASIL &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp; INDEPENDENT BRAND &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* CAROUSEL */}
      <section style={{ background: "#000" }}>
        <div className="container-shell pt-16 pb-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="kicker mb-3">Colecao em Destaque</div>
              <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92, color: "#fff" }}>O PIX E NOSSO</h2>
            </div>
            <Link href="/loja">
              <a className="btn-secondary hidden md:inline-flex">Ver Todos</a>
            </Link>
          </div>
        </div>
        <EditorialCarousel />
        <div className="container-shell pt-6 pb-16">
          <Link href="/loja">
            <a className="btn-primary md:hidden w-full justify-center">Ver Todos os Looks</a>
          </Link>
        </div>
      </section>

      {/* BRAND STATEMENT */}
      <section className="section-space" style={{ background: "#0a0a0a" }}>
        <div className="container-shell">
          <div className="grid gap-16 md:grid-cols-2 items-center">
            <div>
              <div className="kicker mb-6">Sobre a Marca</div>
              <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92, color: "#fff", marginBottom: "1.5rem" }}>
                VANDALISMO<br /><span style={{ color: "#FF0066" }}>REFINADO</span>
              </h2>
              <p className="body-lg mb-6">A BOLSONIER STORE nasceu da tensao entre o luxo e a rua. Entre a elegancia e o caos. Entre o que e permitido e o que e necessario.</p>
              <p className="body-lg mb-10">Cada peca e um manifesto. Cada estampa e uma declaracao. Feito no Brasil, para quem nao pede licenca.</p>
              <div className="flex flex-wrap gap-4">
                <Link href="/sobre"><a className="btn-primary">Nossa Historia</a></Link>
                <Link href="/loja"><a className="btn-secondary">Ver Colecao</a></Link>
              </div>
            </div>
            <div className="relative">
              <div className="relative overflow-hidden" style={{ aspectRatio: "3/4" }}>
                <img src="/art-statue.png" alt="O Pix E Nosso — Arte" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div className="absolute -bottom-4 -left-4 p-5" style={{ background: "#FF0066" }}>
                <div style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.4rem", color: "#fff", letterSpacing: "0.05em" }}>
                  FAZ PARTE DE<br />QUEM CONSTROI
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TICKER HOT PINK */}
      <div className="ticker-wrap" style={{ background: "#FF0066", padding: "0.6rem 0" }}>
        <div className="ticker-track">
          {Array.from({ length: 8 }).map((_, i) => (
            <span key={i} className="ticker-item" style={{ color: "#fff" }}>
              BOLSONIER STORE &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; O PIX E NOSSO &nbsp;·&nbsp; EST. 24 &nbsp;·&nbsp; SAO PAULO / BRASIL &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* COMO FUNCIONA */}
      <section className="section-space" style={{ background: "#000" }}>
        <div className="container-shell">
          <div className="max-w-3xl">
            <div className="kicker-green mb-6">Como funciona</div>
            <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92, color: "#A6FF00", marginBottom: "1rem" }}>
              PAGAMENTO VIA PIX
            </h2>
            <p className="body-lg mb-10">
              Nosso modelo e simples e direto: voce escolhe, paga via PIX, e nos produzimos especialmente para voce. Sem intermediarios. Sem taxas abusivas.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
              {[
                { step: "01", title: "Escolha", text: "Navegue pela loja e escolha a peca que mais combina com seu estilo." },
                { step: "02", title: "Pague via PIX", text: "Finalize pelo WhatsApp e receba a chave PIX para pagamento." },
                { step: "03", title: "Receba", text: "Apos confirmacao do pagamento, produzimos e enviamos sua peca." },
              ].map((item) => (
                <div key={item.step} className="p-8" style={{ background: "#0a0a0a" }}>
                  <div className="kicker-green mb-3">{item.step}</div>
                  <h3 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "1.5rem", color: "#fff", marginBottom: "0.75rem" }}>{item.title}</h3>
                  <p className="body-md">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* GRID DE LOOKS */}
      <section className="section-space" style={{ background: "#0a0a0a" }}>
        <div className="container-shell">
          <div className="flex items-end justify-between mb-12">
            <div>
              <div className="kicker mb-3">Looks da Colecao</div>
              <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(2rem, 5vw, 4rem)", lineHeight: 1, color: "#fff" }}>
                O PIX E NOSSO,<br /><span style={{ color: "#FF0066" }}>MY FRIEND</span>
              </h2>
            </div>
            <Link href="/loja"><a className="btn-green hidden md:inline-flex">Ver Tudo</a></Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-px" style={{ background: "rgba(255,255,255,0.06)" }}>
            {[
              { src: "/editorial-8.png", label: "Masculino Black", tag: "Oversized T-Shirt" },
              { src: "/editorial-9.png", label: "Feminino Green", tag: "Oversized T-Shirt" },
              { src: "/editorial-7.png", label: "Editorial SP", tag: "Oversized T-Shirt" },
            ].map((item, i) => (
              <div key={i} className="relative overflow-hidden group cursor-pointer" style={{ background: "#0a0a0a", aspectRatio: "3/4" }}>
                <img
                  src={item.src}
                  alt={item.label}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", transition: "transform 0.7s", display: "block" }}
                  className="group-hover:scale-105"
                />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85), transparent)" }}>
                  <div className="kicker-muted mb-1">{item.tag}</div>
                  <div className="text-white font-semibold text-sm tracking-wide">{item.label}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <Link href="/loja"><a className="btn-green md:hidden w-full justify-center">Ver Tudo</a></Link>
          </div>
        </div>
      </section>

      {/* ART SECTION */}
      <section className="section-space" style={{ background: "#000" }}>
        <div className="container-shell">
          <div className="grid gap-12 md:grid-cols-2 items-center">
            <div className="relative flex justify-center">
              <div className="relative" style={{ maxWidth: "360px", width: "100%" }}>
                <img src="/art-opix.png" alt="O Pix E Nosso — Arte Grafica" style={{ width: "100%", height: "auto" }} />
              </div>
            </div>
            <div>
              <div className="kicker-green mb-6">Colecao Signature</div>
              <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92, color: "#fff", marginBottom: "1.5rem" }}>
                O PIX<br /><span style={{ color: "#A6FF00" }}>E NOSSO</span>
              </h2>
              <p className="body-lg mb-4">A colecao que virou manifesto. Disponivel em multiplas cores e cortes. Para quem constroi, nao para quem observa.</p>
              <p className="body-lg mb-10">Feito no Brasil. Para o mundo.</p>
              <Link href="/loja">
                <a className="btn-green">
                  Comprar Agora
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA HOT PINK */}
      <section className="section-space" style={{ background: "#FF0066" }}>
        <div className="container-shell text-center">
          <div className="kicker-muted mb-6" style={{ color: "rgba(255,255,255,0.7)" }}>BOLSONIER STORE · EST. 24 · SAO PAULO / BRASIL</div>
          <h2 style={{ fontFamily: "Bebas Neue, sans-serif", fontSize: "clamp(3rem, 8vw, 7rem)", lineHeight: 0.92, color: "#fff", marginBottom: "1.5rem" }}>
            INDEPENDENT BRAND.<br />LIMITED MENTALITY.
          </h2>
          <p className="body-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.8)" }}>
            No permission needed. Faca parte de quem constroi, nao de quem observa.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/loja"><a className="btn-primary" style={{ background: "#000", borderColor: "#000" }}>Ver Colecao</a></Link>
            <a href="https://www.instagram.com/euinelegivel/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ borderColor: "rgba(255,255,255,0.5)", color: "#fff" }}>
              Seguir no Instagram
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
