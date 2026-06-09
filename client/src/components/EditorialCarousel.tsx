import { useState, useEffect, useCallback } from "react";

const slides = [
  {
    src: "/model-1.png",
    alt: "Look 01 — Coleção O Pix É Nosso",
    label: "Look 01",
    desc: "Coleção O Pix É Nosso — Masculino Black",
    tag: "Coleção",
  },
  {
    src: "/model-2.png",
    alt: "Look 02 — Feminino Green",
    label: "Look 02",
    desc: "Coleção O Pix É Nosso — Feminino Green",
    tag: "Coleção",
  },
  {
    src: "/model-3.png",
    alt: "Look 03 — Editorial SP",
    label: "Look 03",
    desc: "Editorial São Paulo — Ruas da Cidade",
    tag: "Editorial",
  },
  {
    src: "/model-4.png",
    alt: "Look 04 — Coleção completa",
    label: "Look 04",
    desc: "Coleção O Pix É Nosso — Todas as Cores",
    tag: "Coleção",
  },
  {
    src: "/model-5.png",
    alt: "Look 05 — Editorial SP",
    label: "Look 05",
    desc: "Editorial São Paulo — Masculino + Feminino",
    tag: "Editorial",
  },
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
      {/* Main carousel */}
      <div className="relative">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {slides.map((slide, i) => (
            <div
              key={i}
              className="relative flex-shrink-0 w-full"
              style={{ aspectRatio: "16/9" }}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                loading={i === 0 ? "eager" : "lazy"}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "top",
                }}
              />
              {/* Overlay gradient */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to right, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0.1) 100%)",
                }}
              />
              {/* Slide info */}
              <div className="absolute bottom-8 left-8 md:bottom-12 md:left-16">
                <span className="badge-pink mb-3 inline-block">{slide.tag}</span>
                <div className="headline-lg text-white mb-1">{slide.label}</div>
                <p className="body-md text-sm">{slide.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Nav arrows */}
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.5)",
          }}
          aria-label="Anterior"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 transition-all"
          style={{
            border: "1px solid rgba(255,255,255,0.2)",
            background: "rgba(0,0,0,0.5)",
          }}
          aria-label="Próximo"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>

        {/* Dots */}
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

      {/* Thumbnail strip */}
      <div
        className="hidden md:flex border-t"
        style={{ borderColor: "rgba(255,255,255,0.08)" }}
      >
        {slides.map((slide, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="relative flex-1 overflow-hidden transition-all"
            style={{
              aspectRatio: "3/4",
              maxHeight: "120px",
              borderBottom:
                i === current ? "2px solid #FF0066" : "2px solid transparent",
              opacity: i === current ? 1 : 0.45,
            }}
          >
            <img
              src={slide.src}
              alt={slide.label}
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                objectFit: "cover",
                objectPosition: "top",
              }}
            />
            <div
              className="absolute inset-0 flex items-end p-2"
              style={{
                background: "linear-gradient(to top, rgba(0,0,0,0.7), transparent)",
              }}
            >
              <span
                className="text-white"
                style={{
                  fontSize: "0.55rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                }}
              >
                {slide.label}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
