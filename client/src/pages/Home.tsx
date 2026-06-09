import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Dados das camisetas — 5 cores, cada uma com 3 ângulos
const shirts = [
  {
    id: "preto",
    label: "Preto",
    color: "#1a1a1a",
    images: ["/mockup-preto-1.png", "/mockup-preto-2.png", "/mockup-preto-3.png"],
    tag: "Oversized T-Shirt",
  },
  {
    id: "branco",
    label: "Branco",
    color: "#f5f5f5",
    images: ["/mockup-branco-1.png", "/mockup-branco-2.png", "/mockup-branco-3.png"],
    tag: "Oversized T-Shirt",
  },
  {
    id: "azul",
    label: "Azul Royal",
    color: "#1a3a8f",
    images: ["/mockup-azul-1.png", "/mockup-azul-2.png", "/mockup-azul-3.png"],
    tag: "Oversized T-Shirt",
  },
  {
    id: "amarelo",
    label: "Amarelo Canário",
    color: "#f5d800",
    images: ["/mockup-amarelo-1.png", "/mockup-amarelo-2.png", "/mockup-amarelo-3.png"],
    tag: "Oversized T-Shirt",
  },
  {
    id: "verde",
    label: "Verde Bandeira",
    color: "#006b3c",
    images: ["/mockup-verde-1.png", "/mockup-verde-2.png", "/mockup-verde-3.png"],
    tag: "Oversized T-Shirt",
  },
];

// Componente de card de produto com troca de ângulo ao hover
function ShirtCard({ shirt, large = false }: { shirt: typeof shirts[0]; large?: boolean }) {
  const [angle, setAngle] = useState(0);

  return (
    <div
      className="group cursor-pointer"
      style={{
        position: "relative",
        overflow: "hidden",
        background: "#0d0d0d",
        border: "1px solid rgba(255,255,255,0.04)",
      }}
      onMouseEnter={() => setAngle(1)}
      onMouseLeave={() => setAngle(0)}
    >
      {/* Imagem principal */}
      <div style={{ position: "relative", aspectRatio: large ? "3/4" : "1/1", overflow: "hidden" }}>
        {shirt.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${shirt.label} — ângulo ${i + 1}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              padding: "1rem",
              transition: "opacity 0.4s ease, transform 0.6s ease",
              opacity: angle === i ? 1 : 0,
              transform: angle === i ? "scale(1)" : "scale(1.03)",
            }}
          />
        ))}
      </div>

      {/* Info overlay */}
      <div
        style={{
          padding: "1rem 1.25rem",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              color: "#FF0066",
              marginBottom: "0.2rem",
              textTransform: "uppercase",
            }}
          >
            {shirt.tag}
          </div>
          <div
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1rem",
              color: "#fff",
              letterSpacing: "0.05em",
            }}
          >
            {shirt.label}
          </div>
        </div>
        {/* Swatch de cor */}
        <div
          style={{
            width: "16px",
            height: "16px",
            borderRadius: "50%",
            background: shirt.color,
            border: "1px solid rgba(255,255,255,0.2)",
            flexShrink: 0,
          }}
        />
      </div>

      {/* Dots de ângulo */}
      <div
        style={{
          position: "absolute",
          top: "0.75rem",
          right: "0.75rem",
          display: "flex",
          gap: "4px",
        }}
      >
        {shirt.images.map((_, i) => (
          <button
            key={i}
            onMouseEnter={() => setAngle(i)}
            onClick={(e) => { e.stopPropagation(); setAngle(i); }}
            style={{
              width: i === angle ? "16px" : "6px",
              height: "6px",
              background: i === angle ? "#FF0066" : "rgba(255,255,255,0.3)",
              border: "none",
              cursor: "pointer",
              transition: "all 0.3s",
              padding: 0,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Header />

      {/* ── HERO ── */}
      <section
        style={{
          background: "#000",
          paddingTop: "clamp(4rem, 10vw, 8rem)",
          paddingBottom: "clamp(4rem, 10vw, 8rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div style={{ maxWidth: "900px" }}>
            <div className="kicker-pink" style={{ marginBottom: "1.5rem" }}>
              Boutique Streetwear · EST. 24 · São Paulo / Brasil
            </div>
            <h1
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(5rem, 18vw, 16rem)",
                lineHeight: 0.88,
                color: "#fff",
                letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}
            >
              BOL<span style={{ color: "#FF0066" }}>S</span>ONIER
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: "2rem", flexWrap: "wrap" }}>
              <Link href="/loja">
                <a className="btn-primary">Ver Coleção</a>
              </Link>
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "0.7rem",
                  letterSpacing: "0.3em",
                  color: "rgba(255,255,255,0.3)",
                }}
              >
                LUXURY COUNTERFEIT · IRONIA ELEGANTE · VANDALISMO REFINADO
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER ACID GREEN ── */}
      <div style={{ background: "#A6FF00", overflow: "hidden", padding: "0.75rem 0" }}>
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#000" }}>
              O PIX É NOSSO &nbsp;·&nbsp; BOLSONIER STORE &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; FEITO NO BRASIL &nbsp;·&nbsp; EST. 24 &nbsp;·&nbsp; SAO PAULO &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp; NO PERMISSION NEEDED &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── LOOKS DA COLEÇÃO — grid editorial 3 camisetas principais ── */}
      <section style={{ background: "#000", padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-shell">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div className="kicker-pink" style={{ marginBottom: "0.75rem" }}>Looks da Coleção</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 6vw, 5rem)",
                  lineHeight: 0.92,
                  color: "#fff",
                }}
              >
                O PIX É NOSSO,{" "}
                <span style={{ color: "#FF0066" }}>MY FRIEND</span>
              </h2>
            </div>
            <Link href="/loja">
              <a className="btn-green hidden md:inline-flex">Ver Tudo</a>
            </Link>
          </div>

          {/* Grid 3 colunas — preto, branco, azul */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2px",
            }}
          >
            {shirts.slice(0, 3).map((shirt) => (
              <ShirtCard key={shirt.id} shirt={shirt} large />
            ))}
          </div>

          <div className="mt-6 md:hidden">
            <Link href="/loja">
              <a className="btn-green w-full justify-center">Ver Tudo</a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO ESTÁTUA ── */}
      <section
        style={{
          background: "#000",
          padding: "clamp(3rem, 6vw, 5rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div
            style={{
              display: "grid",
              gap: "clamp(2rem, 5vw, 6rem)",
              alignItems: "center",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <img
                src="/art-statue-main.png"
                alt="Vandalismo Refinado"
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  display: "block",
                  mixBlendMode: "multiply",
                  filter: "contrast(1.1) brightness(0.9)",
                }}
              />
            </div>
            <div>
              <div className="kicker-green" style={{ marginBottom: "1.5rem" }}>Vandalismo Refinado</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
                  lineHeight: 0.92,
                  color: "#fff",
                  marginBottom: "1.5rem",
                }}
              >
                FAZ PARTE DE<br />
                <span style={{ color: "#FF0066" }}>QUEM CONSTRÓI</span><br />
                NÃO DE QUEM<br />
                OBSERVA.
              </h2>
              <p
                style={{
                  fontSize: "0.85rem",
                  letterSpacing: "0.1em",
                  color: "rgba(255,255,255,0.45)",
                  lineHeight: 1.8,
                  marginBottom: "2rem",
                  textTransform: "uppercase",
                }}
              >
                Luxury Counterfeit · Ironia Elegante<br />
                Vandalismo Refinado · Feito no Brasil
              </p>
              <Link href="/loja">
                <a className="btn-primary">Ver Coleção</a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── TICKER HOT PINK ── */}
      <div style={{ background: "#FF0066", overflow: "hidden", padding: "0.75rem 0" }}>
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#fff" }}>
              BOLSONIER STORE &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; O PIX É NOSSO &nbsp;·&nbsp; EST. 24 &nbsp;·&nbsp; SAO PAULO / BRASIL &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp; INDEPENDENT BRAND &nbsp;·&nbsp; LIMITED MENTALITY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── COLEÇÃO COMPLETA — grid 5 camisetas ── */}
      <section style={{ background: "#000", padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-shell">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div className="kicker-pink" style={{ marginBottom: "0.5rem" }}>Coleção Atual</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 0.92,
                  color: "#fff",
                }}
              >
                O PIX É NOSSO
              </h2>
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "#FF0066",
                border: "1px solid #FF0066",
                padding: "0.3rem 0.75rem",
              }}
            >
              5 CORES · EST. 24
            </div>
          </div>

          {/* Grid 5 camisetas com seletor de ângulo */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(5, 1fr)",
              gap: "2px",
            }}
            className="grid-cols-2 sm:grid-cols-3 md:grid-cols-5"
          >
            {shirts.map((shirt) => (
              <ShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link href="/loja">
              <a className="btn-primary">Comprar Agora</a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO GRAFFITI ── */}
      <section
        style={{
          background: "#000",
          padding: "clamp(3rem, 6vw, 5rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div
            style={{ display: "grid", gap: "clamp(2rem, 5vw, 6rem)", alignItems: "center" }}
            className="grid-cols-1 md:grid-cols-2"
          >
            <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.06)",
                  padding: "2rem",
                  maxWidth: "360px",
                  width: "100%",
                }}
              >
                <img
                  src="/art-graffiti.png"
                  alt="O Pix É Nosso — Arte Gráfica"
                  style={{ width: "100%", height: "auto", display: "block" }}
                />
              </div>
            </div>
            <div>
              <div className="kicker-green" style={{ marginBottom: "1.5rem" }}>Coleção Signature</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(3.5rem, 9vw, 8rem)",
                  lineHeight: 0.88,
                  color: "#fff",
                  marginBottom: "1.5rem",
                }}
              >
                O PIX<br />
                <span style={{ color: "#A6FF00" }}>É NOSSO</span>
              </h2>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "0.75rem" }}>
                A coleção que virou manifesto. Disponível em 5 cores e cortes oversized.
                Para quem constrói, não para quem observa.
              </p>
              <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.8, marginBottom: "2.5rem" }}>
                Feito no Brasil. Para o mundo.
              </p>
              <Link href="/loja">
                <a className="btn-green">
                  Comprar Agora
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </a>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── NOVAS PEÇAS ── */}
      <section
        style={{
          background: "#000",
          padding: "clamp(5rem, 10vw, 9rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          textAlign: "center",
        }}
      >
        <div className="container-shell">
          <div className="kicker-green" style={{ marginBottom: "1.5rem" }}>Em Breve</div>
          <h2
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 8vw, 7rem)",
              lineHeight: 0.92,
              color: "#fff",
              marginBottom: "1.5rem",
            }}
          >
            NOVAS PEÇAS<br />
            <span style={{ color: "#A6FF00" }}>CHEGANDO</span>
          </h2>
          <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.5)", maxWidth: "520px", margin: "0 auto 3rem", lineHeight: 1.8 }}>
            Fique por dentro das novidades. Siga a BOLSONIER STORE no Instagram para ser o primeiro a saber.
          </p>
          <a
            href="https://www.instagram.com/euinelegivel/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-green"
          >
            Seguir no Instagram
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
