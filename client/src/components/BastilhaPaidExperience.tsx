import { useState, useRef, useEffect, type CSSProperties } from "react";

// Detecta mobile (tela estreita ou touch) para usar o vídeo 9:16
const isMobile = () =>
  typeof window !== "undefined" &&
  (window.innerWidth < 768 || ("ontouchstart" in window && window.innerWidth < 1024));

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
  const [finalTextVisible, setFinalTextVisible] = useState(false);
  const [buttonVisible, setButtonVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoSrc = isMobile()
    ? "/videos/bastilha-portoes-mobile.mp4"
    : "/videos/bastilha-portoes.mp4";

  // Fade-in do texto sobre o vídeo após 1.2s
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 1200);
    return () => clearTimeout(t);
  }, []);

  // Quando o vídeo termina → transição para tela final
  function handleVideoEnded() {
    setPhase("final");
    setTimeout(() => setFinalTextVisible(true), 400);
    setTimeout(() => setButtonVisible(true), 2200);
  }

  // Tentar dar play (necessário em alguns browsers)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // Se autoplay com som falhar, tenta muted
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
          {/* Vídeo fullscreen */}
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
              background: "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.18) 50%, rgba(0,0,0,0.08) 100%)",
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
            {/* Linha decorativa */}
            <div
              style={{
                width: "2px",
                height: "clamp(1.5rem, 4vw, 3rem)",
                background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.55))",
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

      {/* ── FASE 2: Tela final preta ── */}
      {phase === "final" && (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "100vh",
            width: "100%",
            padding: "2rem",
            textAlign: "center",
          }}
        >
          {/* Linha decorativa topo */}
          <div
            style={{
              width: "1px",
              height: "clamp(2rem, 5vw, 4rem)",
              background: "linear-gradient(to bottom, transparent, rgba(255,255,255,0.3))",
              marginBottom: "2.5rem",
              opacity: finalTextVisible ? 1 : 0,
              transition: "opacity 1.2s ease",
            }}
          />

          {/* Frase final */}
          <p
            style={{
              fontFamily: "'Cormorant Garamond', 'Garamond', 'Georgia', serif",
              fontSize: "clamp(1.1rem, 3.5vw, 2.2rem)",
              fontWeight: 300,
              fontStyle: "italic",
              letterSpacing: "0.06em",
              color: "#f5f0e8",
              maxWidth: "640px",
              lineHeight: 1.6,
              opacity: finalTextVisible ? 1 : 0,
              transform: finalTextVisible ? "translateY(0)" : "translateY(1rem)",
              transition: "opacity 1.6s ease, transform 1.6s ease",
            }}
          >
            Seu pedido agora segue para os ateliês da Bolsonier Store.
          </p>

          {/* Linha decorativa baixo */}
          <div
            style={{
              width: "clamp(2rem, 8vw, 5rem)",
              height: "1px",
              background: "rgba(255,255,255,0.18)",
              margin: "2.5rem auto",
              opacity: finalTextVisible ? 1 : 0,
              transition: "opacity 1.8s ease 0.4s",
            }}
          />

          {/* Número do pedido — discreto */}
          <p
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.65rem",
              letterSpacing: "0.35em",
              color: "rgba(255,255,255,0.22)",
              marginBottom: "3rem",
              opacity: finalTextVisible ? 1 : 0,
              transition: "opacity 2s ease 0.6s",
            }}
          >
            PEDIDO {order_number}
          </p>

          {/* Botão "Ver detalhes do pedido" */}
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
              color: "rgba(255,255,255,0.7)",
              padding: "0.85rem 2.5rem",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "0.75rem",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              cursor: "pointer",
              transition: "opacity 1s ease, transform 1s ease, border-color 0.3s, color 0.3s, background 0.3s",
              opacity: buttonVisible ? 1 : 0,
              transform: buttonVisible ? "translateY(0)" : "translateY(0.75rem)",
            } as CSSProperties}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.7)";
              e.currentTarget.style.color = "#fff";
              e.currentTarget.style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.25)";
              e.currentTarget.style.color = "rgba(255,255,255,0.7)";
              e.currentTarget.style.background = "transparent";
            }}
          >
            Ver detalhes do pedido
          </button>
        </div>
      )}
    </div>
  );
}
