import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Slide {
  src: string;
  alt: string;
  label?: string;
}

interface EditorialCarouselProps {
  slides: Slide[];
  autoPlayInterval?: number;
}

export default function EditorialCarousel({ slides, autoPlayInterval = 4000 }: EditorialCarouselProps) {
  const [current, setCurrent] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const go = useCallback((index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrent((index + slides.length) % slides.length);
    setTimeout(() => setIsAnimating(false), 500);
  }, [isAnimating, slides.length]);

  const prev = () => go(current - 1);
  const next = useCallback(() => go(current + 1), [current, go]);

  useEffect(() => {
    const timer = setInterval(next, autoPlayInterval);
    return () => clearInterval(timer);
  }, [next, autoPlayInterval]);

  return (
    <div className="relative w-full overflow-hidden bg-black" style={{ aspectRatio: "auto" }}>
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-in-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            className="relative flex-shrink-0 w-full flex items-center justify-center"
            style={{ minHeight: "clamp(400px, 80vw, 700px)", background: "#000" }}
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
                maxHeight: "clamp(400px, 80vw, 700px)",
                display: "block",
              }}
            />
            {slide.label && (
              <div
                className="absolute bottom-0 left-0 right-0 px-6 py-4"
                style={{ background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)" }}
              >
                <span
                  className="text-white uppercase tracking-widest text-xs font-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.9rem", letterSpacing: "0.2em" }}
                >
                  {slide.label}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Prev / Next */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 transition-all duration-200"
        style={{ background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.3)", color: "#FFF" }}
        aria-label="Anterior"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex items-center justify-center w-10 h-10 transition-all duration-200"
        style={{ background: "rgba(0,0,0,0.6)", border: "2px solid rgba(255,255,255,0.3)", color: "#FFF" }}
        aria-label="Próximo"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            className="transition-all duration-300"
            style={{
              width: i === current ? "24px" : "8px",
              height: "8px",
              borderRadius: "4px",
              background: i === current ? "#FF006E" : "rgba(255,255,255,0.4)",
              border: "none",
              cursor: "pointer",
            }}
            aria-label={`Ir para slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
