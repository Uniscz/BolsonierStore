import { useState, useEffect, useCallback } from "react";

// Slots para os mockups — substitua os src quando tiver as fotos
const slides = [
  { id: 1, label: "Look 01", desc: "Coleção O Pix É Nosso — Em breve", tag: "Coleção" },
  { id: 2, label: "Look 02", desc: "Coleção O Pix É Nosso — Em breve", tag: "Coleção" },
  { id: 3, label: "Look 03", desc: "Editorial Brasil — Em breve", tag: "Editorial" },
  { id: 4, label: "Look 04", desc: "Coleção O Pix É Nosso — Em breve", tag: "Coleção" },
  { id: 5, label: "Look 05", desc: "Editorial Brasil — Em breve", tag: "Editorial" },
];

function PlaceholderSlide({ label, tag }: { label: string; tag: string }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0a0a0a",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        border: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Monograma B como placeholder */}
      <img
        src="/brand-monogram.png"
        alt="Bolsonier"
        style={{ width: "clamp(80px, 15vw, 160px)", opacity: 0.15, filter: "invert(1)" }}
      />
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(0.6rem, 1.2vw, 0.85rem)",
            letterSpacing: "0.3em",
            color: "#FF0066",
            marginBottom: "0.5rem",
          }}
        >
          {tag}
        </div>
        <div
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
            color: "rgba(255,255,255,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: "0.7rem",
            letterSpacing: "0.2em",
            color: "rgba(255,255,255,0.15)",
            marginTop: "0.5rem",
            textTransform: "uppercase",
          }}
        >
          Mockup em breve
        </div>
      </div>
    </div>
  );
}

export default function EditorialCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const next = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((c) => (c + 1) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  const prev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((c) => (c - 1 + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(next, 4500);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div style={{ background: "#0a0a0a", width: "100%" }}>
      {/* Slide principal — altura fixa para desktop, responsiva para mobile */}
      <div
        className="relative overflow-hidden"
        style={{ height: "clamp(320px, 60vh, 700px)", width: "100%" }}
      >
        {/* Track de slides */}
        <div
          style={{
            display: "flex",
            height: "100%",
            transform: `translateX(-${current * 100}%)`,
            transition: "transform 0.5s ease-in-out",
          }}
        >
          {slides.map((slide) => (
            <div
              key={slide.id}
              style={{ flexShrink: 0, width: "100%", height: "100%", position: "relative" }}
            >
              <PlaceholderSlide label={slide.label} tag={slide.tag} />
              {/* Info overlay */}
              <div
                style={{
                  position: "absolute",
                  bottom: "2rem",
                  left: "2rem",
                }}
              >
                <span className="badge-pink" style={{ display: "inline-block", marginBottom: "0.75rem" }}>
                  {slide.tag}
                </span>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
                    color: "#fff",
                    lineHeight: 1,
                    marginBottom: "0.25rem",
                  }}
                >
                  {slide.label}
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.5)", letterSpacing: "0.1em" }}>
                  {slide.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Seta esquerda */}
        <button
          onClick={prev}
          aria-label="Anterior"
          style={{
            position: "absolute",
            left: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "2.5rem",
            height: "2.5rem",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Seta direita */}
        <button
          onClick={next}
          aria-label="Próximo"
          style={{
            position: "absolute",
            right: "1rem",
            top: "50%",
            transform: "translateY(-50%)",
            width: "2.5rem",
            height: "2.5rem",
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.6)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
        <div
          style={{
            position: "absolute",
            bottom: "1rem",
            right: "2rem",
            display: "flex",
            gap: "0.5rem",
            alignItems: "center",
          }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                background: i === current ? "#FF0066" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails — apenas desktop */}
      <div
        className="hidden md:flex"
        style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}
      >
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            style={{
              flex: 1,
              height: "100px",
              background: i === current ? "#111" : "#0a0a0a",
              borderBottom: i === current ? "2px solid #FF0066" : "2px solid transparent",
              borderTop: "none",
              borderLeft: "none",
              borderRight: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.25rem",
              opacity: i === current ? 1 : 0.45,
              transition: "all 0.3s",
            }}
          >
            <img
              src="/brand-monogram.png"
              alt=""
              style={{ width: "24px", opacity: 0.3, filter: "invert(1)" }}
            />
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "#fff",
              }}
            >
              {slide.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
