import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";

const MODELS = [
  { src: "/model-black-street.png",     label: "Preto · Street" },
  { src: "/model-white-graffiti.png",   label: "Branco · Graffiti" },
  { src: "/model-yellow-street.png",    label: "Amarelo · Street" },
  { src: "/model-yellow-body.png",      label: "Amarelo · Body" },
  { src: "/model-yellow-crop.png",      label: "Amarelo · Crop" },
  { src: "/model-white-body.png",       label: "Branco · Body" },
  { src: "/model-white-oversized.png",  label: "Branco · Oversized" },
  { src: "/model-gray-oversized.png",   label: "Cinza · Oversized" },
  { src: "/model-composition.png",      label: "Composição · 5 Cores" },
];

const TICKER_ITEMS = [
  "BOLSONIER STORE", "O PIX É NOSSO", "LUXURY COUNTERFEIT",
  "FEITO NO BRASIL", "EST. 24", "SÃO PAULO",
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
  const [active, setActive] = useState(0);

  const prev = useCallback(() => setActive(i => (i - 1 + MODELS.length) % MODELS.length), []);
  const next = useCallback(() => setActive(i => (i + 1) % MODELS.length), []);

  useEffect(() => {
    const t = setInterval(next, 4000);
    return () => clearInterval(t);
  }, [next]);

  return (
    <section className="carousel-section">
      <div className="carousel-label">
        <span className="carousel-label-text">★ COLEÇÃO "O PIX É NOSSO" · LOOKS EDITORIAIS ★</span>
      </div>
      <div className="carousel-wrapper">
        <div className="carousel-main">
          <img
            key={active}
            src={MODELS[active].src}
            alt={MODELS[active].label}
            className="carousel-main-img"
          />
          <button className="carousel-arrow carousel-arrow-left" onClick={prev} aria-label="Anterior">&#8592;</button>
          <button className="carousel-arrow carousel-arrow-right" onClick={next} aria-label="Próximo">&#8594;</button>
          <span className="carousel-counter">{active + 1} / {MODELS.length}</span>
        </div>
        <div className="carousel-thumbs">
          {MODELS.map((m, i) => (
            <button
              key={i}
              className={`carousel-thumb${active === i ? " active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={m.label}
            >
              <img src={m.src} alt={m.label} />
            </button>
          ))}
        </div>
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
          <p className="hero-sub">★ EST. 24 · SÃO PAULO · BRASIL ★</p>
          <h1 className="hero-title">
            BOL<span className="hero-s">S</span>ONIER
          </h1>
          <div className="hero-cta-row">
            <Link href="/loja" className="btn-acid">VER COLEÇÃO</Link>
            <span className="hero-tagline">LUXURY COUNTERFEIT · IRONIA ELEGANTE · FEITO NO BRASIL</span>
          </div>
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
            Não de quem observa. A BOLSONIER STORE nasceu nas ruas de São Paulo
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
            <img src="/model-black-street.png" alt="Look preto street" />
          </div>
          <div className="mosaic-small-col">
            <img src="/model-white-graffiti.png" alt="Look branco graffiti" />
            <img src="/model-yellow-street.png" alt="Look amarelo street" />
          </div>
          <div className="mosaic-small-col">
            <img src="/model-white-body.png" alt="Look branco body" />
            <img src="/model-yellow-body.png" alt="Look amarelo body" />
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
          <span className="signature-origin">FEITO NO BRASIL · EST. 24 · SÃO PAULO</span>
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
          href="https://instagram.com/bolsonierstore"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-acid"
        >
          @BOLSONIERSTORE
        </a>
      </section>

    </main>
  );
}
