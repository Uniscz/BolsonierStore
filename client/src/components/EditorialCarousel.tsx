import { useState, useEffect, useCallback } from "react";

const slides = [
  { src: "/model-1.png", alt: "Look 01 — Colecao O Pix E Nosso", label: "Look 01", desc: "Colecao O Pix E Nosso — Masculino Black", tag: "Colecao" },
  { src: "/model-2.png", alt: "Look 02 — Feminino Green", label: "Look 02", desc: "Colecao O Pix E Nosso — Feminino Green", tag: "Colecao" },
  { src: "/model-3.png", alt: "Look 03 — Editorial SP", label: "Look 03", desc: "Editorial Sao Paulo — Ruas da Cidade", tag: "Editorial" },
  { src: "/model-4.png", alt: "Look 04 — Colecao completa", label: "Look 04", desc: "Colecao O Pix E Nosso — Todas as Cores", tag: "Colecao" },
  { src: "/model-5.png", alt: "Look 05 — Editorial SP", label: "Look 05", desc: "Editorial Sao Paulo — Masculino + Feminino", tag: "Editorial" },
  { src: "/editorial-6.png", alt: "Look 06 — Arte Grafica", label: "Look 06", desc: "Arte Grafica — O Pix E Nosso", tag: "Arte" },
  { src: "/editorial-7.png", alt: "Look 07 — Ironia Elegante", label: "Look 07", desc: "Ironia Elegante — Vandalismo Refinado", tag: "Editorial" },
  { src: "/editorial-8.png", alt: "Look 08 — Vandalismo", label: "Look 08", desc: "Vandalismo Refinado — Feito no Brasil", tag: "Editorial" },
  { src: "/editorial-9.png", alt: "Look 09 — O Pix E Nosso", label: "Look 09", desc: "O Pix E Nosso — EST. 24", tag: "Colecao" },
];

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
    <div className="relative w-full overflow-hidden" style={{ background: "#0a0a0a" }}>
      <div className="relative">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-full flex items-center justify-center"
              style={{ background: "#000", minHeight: "clamp(320px, 65vw, 680px)" }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  objectPosition: "center",
                  maxHeight: "clamp(320px, 65vw, 680px)",
                  display: "block",
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(to right, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.05) 100%)" }}
              />
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16">
                <span className="badge-pink mb-3 inline-block">{slide.tag}</span>
                <div className="headline-lg text-white mb-1">{slide.label}</div>
                <p className="body-md text-sm">{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.5)", color: "#fff" }}
          aria-label="Anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all"
          style={{ border: "1px solid rgba(255,255,255,0.2)", background: "rgba(0,0,0,0.5)", color: "#fff" }}
          aria-label="Proximo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5"><path d="M9 18l6-6-6-6" /></svg>
        </button>

        <div className="absolute bottom-4 right-8 flex items-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all"
              style={{
                width: i === current ? "24px" : "6px",
                height: "6px",
                background: i === current ? "#FF0066" : "rgba(255,255,255,0.3)",
                border: "none",
                cursor: "pointer",
              }}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="hidden md:flex border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
        {slides.slice(0, 5).map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative flex-1 overflow-hidden transition-all"
            style={{
              aspectRatio: "3/4",
              maxHeight: "120px",
              borderBottom: i === current ? "2px solid #FF0066" : "2px solid transparent",
              opacity: i === current ? 1 : 0.45,
            }}
          >
            <img
              src={slide.src}
              alt={slide.label}
              style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
            />
            <div
              className="absolute inset-0 flex items-end p-2"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)" }}
            >
              <span className="text-white" style={{ fontSize: "0.55rem", fontWeight: 700, letterSpacing: "0.2em" }}>
                {slide.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
