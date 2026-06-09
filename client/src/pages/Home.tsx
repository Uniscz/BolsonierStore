import { useRef } from "react";
import { Link } from "wouter";

const MODELS = [
  { src: "/lifestyle/pix-preto-modelo-rua.png",     label: "Preto · Rua" },
  { src: "/lifestyle/pix-verde-modelo-rua.png",     label: "Verde Bandeira · Rua" },
  { src: "/lifestyle/pix-amarelo-modelo-rua.png",   label: "Amarelo Canário · Rua" },
  { src: "/lifestyle/pix-branco-modelo-rua-1.png",  label: "Branco · Asfalto" },
  { src: "/lifestyle/pix-branco-modelo-rua-2.png",  label: "Branco · Concreto" },
];

const TICKER_ITEMS = [
  "BOLSONIER STORE", "O PIX É NOSSO", "LUXURY COUNTERFEIT",
  "FEITO NO BRASIL", "EST. 24", "BRASIL",
  "IRONIA ELEGANTE", "VANDALISMO REFINADO", "NO PERMISSION NEEDED",
];

function Ticker({ color }: { color: "green" | "pink" }) {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div className={`ticker ticker-${color}`}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={i} className="ticker-item">★ {item}</span>
        ))}
      </div>
    </div>
  );
}

function ModelCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "prev" | "next") => {
    const track = trackRef.current;
    if (!track) return;

    const amount = Math.min(track.clientWidth * 0.86, 760);
    track.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  return (
    <section className="carousel-section carousel-section-horizontal">
      <div className="carousel-label carousel-label-compact">
        <span className="carousel-label-text">★ COLEÇÃO "O PIX É NOSSO" · LOOKS EDITORIAIS ★</span>
      </div>

      <div className="lookbook-horizontal-shell">
        <button className="lookbook-horizontal-arrow lookbook-horizontal-arrow-left" onClick={() => scroll("prev")} aria-label="Looks anteriores">&#8592;</button>

        <div className="lookbook-horizontal-track" ref={trackRef}>
          {MODELS.map((m, i) => (
            <article className="lookbook-horizontal-card" key={m.src}>
              <img src={m.src} alt={m.label} className="lookbook-horizontal-img" />
              <div className="lookbook-horizontal-info">
                <span>{String(i + 1).padStart(2, "0")}</span>
                <strong>{m.label}</strong>
              </div>
            </article>
          ))}
        </div>

        <button className="lookbook-horizontal-arrow lookbook-horizontal-arrow-right" onClick={() => scroll("next")} aria-label="Próximos looks">&#8594;</button>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-bar hero-bar-left" />
        <div className="hero-bar hero-bar-right" />
        <div className="hero-content">
          <p className="hero-sub">★ EST. 24 · BRASIL ★</p>
          <h1 className="hero-title">
            BOL<span className="hero-s">S</span>ONIER
          </h1>
          <div className="hero-cta-row">
            <Link href="/loja" className="btn-acid">VER COLEÇÃO</Link>
            <span className="hero-tagline">LUXURY COUNTERFEIT · IRONIA ELEGANTE · FEITO NO BRASIL</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Looks editoriais da coleção O Pix É Nosso">
          <img src="/lifestyle/pix-verde-modelo-rua.png" alt="Modelo usando camiseta verde O Pix É Nosso" className="hero-look hero-look-main" />
          <img src="/lifestyle/pix-amarelo-modelo-rua.png" alt="Modelo usando camiseta amarela O Pix É Nosso" className="hero-look hero-look-back hero-look-yellow" />
          <img src="/lifestyle/pix-preto-modelo-rua.png" alt="Modelo usando camiseta preta O Pix É Nosso" className="hero-look hero-look-back hero-look-black" />
          <div className="hero-stamp">O PIX É NOSSO</div>
        </div>
      </section>

      {/* ── TICKER VERDE ── */}
      <Ticker color="green" />

      {/* ── CARROSSEL DE MODELOS ── */}
      <ModelCarousel />

      {/* ── TICKER PINK ── */}
      <Ticker color="pink" />

      {/* ── COMPOSIÇÃO EDITORIAL (imagem panorâmica dos 5 looks) ── */}
      <section className="composition-section">
        <img
          src="/model-composition.png"
          alt="Composição editorial — 5 looks da coleção O Pix É Nosso"
          className="composition-img"
        />
      </section>

      {/* ── ESTÁTUA COM BATOM ── */}
      <section className="statue-section">
        <div className="statue-art">
          <img
            src="/art-statue.png"
            alt="Estátua da Liberdade com batom — BOLSONIER STORE"
            className="statue-img"
          />
        </div>
        <div className="statue-text">
          <span className="statue-label">★ MANIFESTO ★</span>
          <h2 className="statue-title">
            FAZ PARTE<br />DE QUEM<br /><span style={{ color: "#FF0066" }}>CONSTRÓI</span>
          </h2>
          <p className="statue-sub">
            Não de quem observa. A BOLSONIER STORE nasceu no Brasil
            com a ironia de quem entende o jogo — e decide criar o seu próprio.
          </p>
          <Link href="/sobre" className="btn-outline">NOSSA HISTÓRIA</Link>
        </div>
      </section>

      {/* ── TICKER VERDE ── */}
      <Ticker color="green" />

      {/* ── MOSAICO DE MODELOS ── */}
      <section className="mosaic-section">
        <div className="mosaic-header">
          <span className="mosaic-label">★ LOOKS DA COLEÇÃO ★</span>
          <h2 className="mosaic-title">O PIX É NOSSO,<br /><span style={{ color: "#FF0066" }}>MY FRIEND</span></h2>
        </div>
        <div className="mosaic-grid">
          <div className="mosaic-large">
            <img src="/lifestyle/pix-preto-modelo-rua.png" alt="Look preto na rua" />
          </div>
          <div className="mosaic-small-col">
            <img src="/lifestyle/pix-verde-modelo-rua.png" alt="Look verde na rua" />
            <img src="/lifestyle/pix-amarelo-modelo-rua.png" alt="Look amarelo na rua" />
          </div>
          <div className="mosaic-small-col">
            <img src="/lifestyle/pix-branco-modelo-rua-1.png" alt="Look branco no asfalto" />
            <img src="/lifestyle/pix-branco-modelo-rua-2.png" alt="Look branco no concreto" />
          </div>
        </div>
      </section>

      {/* ── ASSINATURA / ARTE GRAFFITI ── */}
      <section className="signature-section">
        <div className="signature-art">
          <img
            src="/art-graffiti.png"
            alt="Arte graffiti O Pix É Nosso — BOLSONIER STORE"
            className="signature-img"
          />
        </div>
        <div className="signature-text">
          <span className="signature-label">★ COLEÇÃO ASSINATURA ★</span>
          <h2 className="signature-title">
            O PIX<br /><span style={{ color: "#FF0066" }}>É NOSSO,</span><br />MY FRIEND
          </h2>
          <p className="signature-sub">
            A peça que virou símbolo. Oversized, cropped, body — cada versão
            carrega a mesma mensagem: o dinheiro circula, mas a cultura é nossa.
          </p>
          <span className="signature-origin">FEITO NO BRASIL · EST. 24</span>
          <Link href="/loja" className="btn-acid">COMPRAR AGORA</Link>
        </div>
      </section>

      {/* ── TICKER PINK ── */}
      <Ticker color="pink" />

      {/* ── INSTAGRAM CTA ── */}
      <section className="instagram-section">
        <span className="instagram-label">★ SIGA A GENTE ★</span>
        <h2 className="instagram-title">
          NOVAS PEÇAS<br /><span style={{ color: "#A6FF00" }}>CHEGANDO</span>
        </h2>
        <p className="instagram-sub">
          Acompanhe os drops, bastidores e novidades antes de todo mundo.
          A próxima coleção está chegando.
        </p>
        <a
          href="https://instagram.com/euinelegivel"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-acid"
        >
          @EUINELEGIVEL
        </a>
      </section>

    </main>
  );
}
