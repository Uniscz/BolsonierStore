import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

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
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
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
      <div
        style={{
          background: "#A6FF00",
          overflow: "hidden",
          padding: "0.75rem 0",
          borderTop: "none",
          borderBottom: "none",
        }}
      >
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#000" }}>
              O PIX É NOSSO &nbsp;·&nbsp; BOLSONIER STORE &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; FEITO NO BRASIL &nbsp;·&nbsp; EST. 24 &nbsp;·&nbsp; SAO PAULO &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp; NO PERMISSION NEEDED &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── LOOKS DA COLEÇÃO — grid editorial 3 fotos ── */}
      <section style={{ background: "#000", padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-shell">
          {/* Cabeçalho da seção */}
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

          {/* Grid editorial — 3 fotos lado a lado, altura fixa */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2px",
              height: "clamp(400px, 65vh, 700px)",
            }}
          >
            {[
              { src: "/model-black.png", label: "Preto", tag: "Oversized T-Shirt" },
              { src: "/model-green.png", label: "Verde", tag: "Oversized T-Shirt" },
              { src: "/model-white.png", label: "Branco", tag: "Oversized T-Shirt" },
            ].map((item, i) => (
              <div
                key={i}
                className="group cursor-pointer"
                style={{ position: "relative", overflow: "hidden", background: "#111" }}
              >
                <img
                  src={item.src}
                  alt={item.label}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                    transition: "transform 0.7s ease",
                  }}
                  className="group-hover:scale-105"
                />
                {/* Overlay no hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end"
                  style={{
                    background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 60%)",
                    padding: "1.5rem",
                  }}
                >
                  <div
                    style={{
                      fontSize: "0.6rem",
                      letterSpacing: "0.25em",
                      color: "#FF0066",
                      marginBottom: "0.25rem",
                      textTransform: "uppercase",
                    }}
                  >
                    {item.tag}
                  </div>
                  <div
                    style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: "1.25rem",
                      color: "#fff",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {item.label}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile: botão ver tudo */}
          <div className="mt-6 md:hidden">
            <Link href="/loja">
              <a className="btn-green w-full justify-center">Ver Tudo</a>
            </Link>
          </div>
        </div>
      </section>

      {/* ── SEÇÃO ESTÁTUA — arte com batom ── */}
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
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(2rem, 5vw, 6rem)",
              alignItems: "center",
            }}
            className="grid-cols-1 md:grid-cols-2"
          >
            {/* Arte da estátua */}
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="/art-statue-main.png"
                alt="Vandalismo Refinado"
                style={{
                  width: "100%",
                  maxWidth: "420px",
                  height: "auto",
                  display: "block",
                  /* multiply remove o fundo branco/xadrez da PNG */
                  mixBlendMode: "multiply",
                  filter: "contrast(1.1) brightness(0.9)",
                }}
              />
            </div>
            {/* Texto */}
            <div>
              <div className="kicker-green" style={{ marginBottom: "1.5rem" }}>
                Vandalismo Refinado
              </div>
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
      <div
        style={{
          background: "#FF0066",
          overflow: "hidden",
          padding: "0.75rem 0",
        }}
      >
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#fff" }}>
              BOLSONIER STORE &nbsp;·&nbsp; BOUTIQUE STREETWEAR &nbsp;·&nbsp; O PIX É NOSSO &nbsp;·&nbsp; EST. 24 &nbsp;·&nbsp; SAO PAULO / BRASIL &nbsp;·&nbsp; LUXURY COUNTERFEIT &nbsp;·&nbsp; INDEPENDENT BRAND &nbsp;·&nbsp; LIMITED MENTALITY &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* ── COLEÇÃO ATUAL — grid mosaico ── */}
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
              EST. 24
            </div>
          </div>

          {/* Linha 1: 3 fotos grandes */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: "2px",
              marginBottom: "2px",
              height: "clamp(280px, 45vh, 500px)",
            }}
          >
            {["/model-black.png", "/model-green.png", "/model-white.png"].map((src, i) => (
              <div key={i} style={{ position: "relative", overflow: "hidden", background: "#111" }}>
                <img
                  src={src}
                  alt={`Look ${i + 1}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Linha 2: 4 fotos menores */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(4, 1fr)",
              gap: "2px",
              height: "clamp(180px, 28vh, 320px)",
            }}
          >
            {["/model-yellow.png", "/model-pink.png", "/model-blue.png", "/model-navy.png"].map((src, i) => (
              <div key={i} style={{ position: "relative", overflow: "hidden", background: "#111" }}>
                <img
                  src={src}
                  alt={`Look ${i + 4}`}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "top center",
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SEÇÃO GRAFFITI — O PIX É NOSSO signature ── */}
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
            {/* Arte graffiti */}
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
            {/* Texto */}
            <div>
              <div className="kicker-green" style={{ marginBottom: "1.5rem" }}>
                Coleção Signature
              </div>
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
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "0.75rem",
                }}
              >
                A coleção que virou manifesto. Disponível em múltiplas cores e cortes.
                Para quem constrói, não para quem observa.
              </p>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.8,
                  marginBottom: "2.5rem",
                }}
              >
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

      {/* ── NOVAS PEÇAS CHEGANDO ── */}
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
          <p
            style={{
              fontSize: "0.9rem",
              color: "rgba(255,255,255,0.5)",
              maxWidth: "520px",
              margin: "0 auto 3rem",
              lineHeight: 1.8,
            }}
          >
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
