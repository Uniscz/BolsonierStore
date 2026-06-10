import { useState, useRef, useEffect, type CSSProperties } from "react";

// Detecta mobile (tela estreita ou touch) para usar o vídeo 9:16
const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024));

// Frases rotativas — uma diferente a cada pedido
const FRASES_POS_COMPRA = [
  "Você não comprou uma peça.\nVocê entrou para o registro.",
  "Produção sob demanda.\nSua peça não existia antes de você.",
  "Feito no Brasil.\nUsado por quem não pede licença.",
  "Streetwear autoral.\nNão tem no shopping. Nunca vai ter.",
  "A Bolsonier Store não vende estoque.\nVende intenção.",
  "Cada peça é uma edição.\nVocê tem a sua.",
];

function getFraseAleatoria(order_number: string): string {
  // Determinístico por pedido — mesmo número sempre mesma frase
  let hash = 0;
  for (let i = 0; i < order_number.length; i++) {
    hash = (hash * 31 + order_number.charCodeAt(i)) & 0xffffffff;
  }
  return FRASES_POS_COMPRA[Math.abs(hash) % FRASES_POS_COMPRA.length];
}

interface BastilhaPaidExperienceProps {
  order_number: string;
  onClose: () => void;
}

type Phase = "video" | "final";

export default function BastilhaPaidExperience({
  order_number,
  onClose,
}: BastilhaPaidExperienceProps) {
  const [phase, setPhase] = useState<Phase>("video");
  const [textVisible, setTextVisible] = useState(false);

  // Fase final — animações escalonadas
  const [showLine1, setShowLine1]   = useState(false); // linha decorativa topo
  const [showFrase, setShowFrase]   = useState(false); // frase rotativa
  const [showDivider, setShowDivider] = useState(false); // separador
  const [showNumber, setShowNumber] = useState(false); // número do pedido
  const [showButton, setShowButton] = useState(false); // botão CTA

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = isMobile()
    ? "/videos/bastilha-portoes-mobile.mp4"
    : "/videos/bastilha-portoes.mp4";

  const frase = getFraseAleatoria(order_number);
  const [fraseL1, fraseL2] = frase.split("\n");

  // Fade-in do texto sobre o vídeo após 1.2s
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Quando o vídeo termina → transição para tela final com animações escalonadas
  function handleVideoEnded() {
    setPhase("final");
    setTimeout(() => setShowLine1(true),   300);
    setTimeout(() => setShowFrase(true),   700);
    setTimeout(() => setShowDivider(true), 1600);
    setTimeout(() => setShowNumber(true),  2000);
    setTimeout(() => setShowButton(true),  2800);
  }

  // Tentar dar play (necessário em alguns browsers)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          videoRef.current.play().catch(() => {});
        }
      });
    }
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      {/* ── FASE 1: Vídeo ── */}
      {phase === "video" && (
        <>
          <video
            ref={videoRef}
            src={videoSrc}
            autoPlay
            playsInline
            onEnded={handleVideoEnded}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />

          {/* Overlay escuro sutil */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.08) 100%)",
              pointerEvents: "none",
            }}
          />

          {/* Texto sobre o vídeo */}
          <div
            style={{
              position: "absolute",
              bottom: "clamp(3rem, 8vw, 7rem)",
              left: 0,
              right: 0,
              textAlign: "center",
              padding: "0 2rem",
              opacity: textVisible ? 1 : 0,
              transform: textVisible ? "translateY(0)" : "translateY(1.5rem)",
              transition: "opacity 1.4s ease, transform 1.4s ease",
              pointerEvents: "none",
            }}
          >
            <div
              style={{
                width: "2px",
                height: "clamp(1.5rem, 4vw, 3rem)",
                background:
                  "linear-gradient(to bottom, transparent, rgba(255,255,255,0.55))",
                margin: "0 auto 1.5rem",
              }}
            />
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
                fontSize: "clamp(1.1rem, 3vw, 2rem)",
                fontWeight: 300,
                fontStyle: "italic",
                letterSpacing: "0.08em",
                color: "#f5f0e8",
                textShadow: "0 2px 24px rgba(0,0,0,0.9), 0 0 60px rgba(0,0,0,0.6)",
                lineHeight: 1.5,
                marginBottom: "0.6rem",
              }}
            >
              A Corte autorizou sua passagem.
            </p>
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
                fontSize: "clamp(0.8rem, 1.8vw, 1.25rem)",
                fontWeight: 300,
                letterSpacing: "0.18em",
                color: "rgba(245,240,232,0.7)",
                textShadow: "0 2px 16px rgba(0,0,0,0.9)",
                textTransform: "uppercase",
              }}
            >
              Não nos faça rever essa decisão.
            </p>
          </div>

          {/* Botão pular — discreto, canto superior direito */}
          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: "1.5rem",
              right: "1.75rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.35)",
              fontSize: "0.6rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              padding: "0.5rem 0.75rem",
              fontFamily: "'Bebas Neue', sans-serif",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.75)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            aria-label="Pular experiência e ver pedido"
          >
            Pular
          </button>
        </>
      )}

      {/* ── FASE 2: Tela final redesenhada ── */}
      {phase === "final" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
            padding: "2.5rem 2rem",
            textAlign: "center",
          }}
        >
          {/* Linha decorativa topo */}
          <div
            style={{
              width: "1px",
              height: "clamp(2.5rem, 6vw, 5rem)",
              background:
                "linear-gradient(to bottom, transparent, rgba(255,0,110,0.6), rgba(255,255,255,0.15))",
              marginBottom: "3rem",
              opacity: showLine1 ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />

          {/* Frase rotativa — linha 1 (Cormorant italic) */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
              fontSize: "clamp(1.2rem, 4vw, 2.4rem)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.04em",
              color: "#f5f0e8",
              maxWidth: "600px",
              lineHeight: 1.5,
              marginBottom: "0.5rem",
              opacity: showFrase ? 1 : 0,
              transform: showFrase ? "translateY(0)" : "translateY(1.2rem)",
              transition: "opacity 1.4s ease, transform 1.4s ease",
            }}
          >
            {fraseL1}
          </p>

          {/* Frase rotativa — linha 2 (Bebas Neue, cor rosa choque) */}
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(0.85rem, 2.2vw, 1.4rem)",
              fontWeight: 400,
              letterSpacing: "0.22em",
              color: "#FF006E",
              maxWidth: "560px",
              lineHeight: 1.4,
              textTransform: "uppercase",
              opacity: showFrase ? 1 : 0,
              transform: showFrase ? "translateY(0)" : "translateY(1.2rem)",
              transition: "opacity 1.6s ease 0.2s, transform 1.6s ease 0.2s",
            }}
          >
            {fraseL2}
          </p>

          {/* Separador com ponto central */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              margin: "2.5rem auto",
              opacity: showDivider ? 1 : 0,
              transition: "opacity 1s ease",
            }}
          >
            <div
              style={{
                width: "clamp(2rem, 6vw, 4rem)",
                height: "1px",
                background: "rgba(255,255,255,0.15)",
              }}
            />
            <div
              style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                background: "#FF006E",
              }}
            />
            <div
              style={{
                width: "clamp(2rem, 6vw, 4rem)",
                height: "1px",
                background: "rgba(255,255,255,0.15)",
              }}
            />
          </div>

          {/* Número do pedido — destaque real */}
          <div
            style={{
              opacity: showNumber ? 1 : 0,
              transform: showNumber ? "translateY(0)" : "translateY(0.8rem)",
              transition: "opacity 1s ease, transform 1s ease",
              marginBottom: "3rem",
            }}
          >
            <p
              style={{
                fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
                fontSize: "clamp(0.65rem, 1.4vw, 0.85rem)",
                fontWeight: 300,
                letterSpacing: "0.3em",
                color: "rgba(245,240,232,0.4)",
                textTransform: "uppercase",
                marginBottom: "0.5rem",
              }}
            >
              Sua passagem foi registrada
            </p>
            <p
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(1.6rem, 5vw, 3rem)",
                letterSpacing: "0.25em",
                color: "#fff",
                lineHeight: 1,
              }}
            >
              {order_number}
            </p>
          </div>

          {/* Botão CTA — rosa choque, energia total */}
          <button
            onClick={onClose}
            style={{
              background: "#FF006E",
              border: "2px solid #FF006E",
              color: "#fff",
              padding: "1rem 3rem",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(0.85rem, 2vw, 1rem)",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition:
                "opacity 0.8s ease, transform 0.8s ease, background 0.25s, color 0.25s, border-color 0.25s",
              opacity: showButton ? 1 : 0,
              transform: showButton ? "translateY(0)" : "translateY(1rem)",
            } as CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#fff";
              e.currentTarget.style.color = "#000";
              e.currentTarget.style.borderColor = "#fff";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "#FF006E";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.borderColor = "#FF006E";
            }}
          >
            Ver meu pedido
          </button>

          {/* Link pular discreto abaixo do botão */}
          <button
            onClick={onClose}
            style={{
              marginTop: "1.5rem",
              background: "transparent",
              border: "none",
              color: "rgba(255,255,255,0.2)",
              fontSize: "0.55rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif",
              opacity: showButton ? 1 : 0,
              transition: "opacity 0.8s ease 0.3s, color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(255,255,255,0.2)")}
          >
            pular
          </button>
        </div>
      )}
    </div>
  );
}
