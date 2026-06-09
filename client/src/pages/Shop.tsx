import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/data/products";

// Dados das camisetas com mockups reais
const shirts = [
  {
    id: "preto",
    label: "Preto",
    hex: "#1a1a1a",
    images: ["/mockup-preto-1.png", "/mockup-preto-2.png", "/mockup-preto-3.png"],
    angles: ["Frente", "Costas", "Detalhe"],
  },
  {
    id: "branco",
    label: "Branco",
    hex: "#f0f0f0",
    images: ["/mockup-branco-1.png", "/mockup-branco-2.png", "/mockup-branco-3.png"],
    angles: ["Frente", "Costas", "Detalhe"],
  },
  {
    id: "azul",
    label: "Azul Royal",
    hex: "#1a3a8f",
    images: ["/mockup-azul-1.png", "/mockup-azul-2.png", "/mockup-azul-3.png"],
    angles: ["Frente", "Costas", "Detalhe"],
  },
  {
    id: "verde",
    label: "Verde Bandeira",
    hex: "#006b3c",
    images: ["/mockup-verde-1.png", "/mockup-verde-2.png", "/mockup-verde-3.png"],
    angles: ["Frente", "Costas", "Detalhe"],
  },
  {
    id: "amarelo",
    label: "Amarelo Canário",
    hex: "#f5d800",
    images: ["/mockup-amarelo-1.png", "/mockup-amarelo-2.png", "/mockup-amarelo-3.png"],
    angles: ["Frente", "Costas", "Detalhe"],
  },
];

const SIZES = ["P", "M", "G", "GG", "XGG"];
const PRICE = 99.90;

function ShirtCard({ shirt }: { shirt: typeof shirts[0] }) {
  const [angle, setAngle] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem, openCart } = useCart();

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Selecione um tamanho!");
      return;
    }
    addItem({
      productSlug: "camiseta-pix",
      name: `Camiseta O Pix É Nosso — ${shirt.label}`,
      price: PRICE,
      size: selectedSize,
      color: shirt.label,
      image: shirt.images[0],
      quantity: 1,
    });
    openCart();
  };

  return (
    <div
      style={{
        background: "#0a0a0a",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Imagem com seletor de ângulo */}
      <div style={{ position: "relative", aspectRatio: "1/1", overflow: "hidden", background: "#111" }}>
        {shirt.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${shirt.label} — ${shirt.angles[i]}`}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
              padding: "1.5rem",
              transition: "opacity 0.35s ease",
              opacity: i === angle ? 1 : 0,
            }}
          />
        ))}
        {/* Dots de ângulo */}
        <div
          style={{
            position: "absolute",
            top: "0.75rem",
            right: "0.75rem",
            display: "flex",
            gap: "5px",
          }}
        >
          {shirt.angles.map((label, i) => (
            <button
              key={i}
              onClick={() => setAngle(i)}
              title={label}
              style={{
                width: i === angle ? "20px" : "7px",
                height: "7px",
                background: i === angle ? "#FF0066" : "rgba(255,255,255,0.25)",
                border: "none",
                cursor: "pointer",
                transition: "all 0.3s",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "1rem" }}>
        {/* Cor + nome + preço */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <div
            style={{
              width: "18px",
              height: "18px",
              borderRadius: "50%",
              background: shirt.hex,
              border: "1px solid rgba(255,255,255,0.2)",
              flexShrink: 0,
            }}
          />
          <div>
            <div
              style={{
                fontSize: "0.55rem",
                letterSpacing: "0.25em",
                color: "#FF0066",
                textTransform: "uppercase",
                marginBottom: "0.15rem",
              }}
            >
              Oversized T-Shirt
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                color: "#fff",
                letterSpacing: "0.05em",
              }}
            >
              {shirt.label}
            </div>
          </div>
          <div
            style={{
              marginLeft: "auto",
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "1.1rem",
              color: "#A6FF00",
            }}
          >
            {formatPrice(PRICE)}
          </div>
        </div>

        {/* Seletor de tamanho */}
        <div>
          <div
            style={{
              fontSize: "0.55rem",
              letterSpacing: "0.2em",
              color: "rgba(255,255,255,0.35)",
              marginBottom: "0.5rem",
              textTransform: "uppercase",
            }}
          >
            Tamanho
          </div>
          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
            {SIZES.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                style={{
                  width: "36px",
                  height: "36px",
                  border: selectedSize === size ? "1px solid #FF0066" : "1px solid rgba(255,255,255,0.15)",
                  background: selectedSize === size ? "#FF0066" : "transparent",
                  color: selectedSize === size ? "#fff" : "rgba(255,255,255,0.6)",
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Botão adicionar */}
        <button
          onClick={handleAdd}
          style={{
            background: "#FF0066",
            color: "#fff",
            border: "none",
            padding: "0.75rem 1rem",
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "0.85rem",
            letterSpacing: "0.15em",
            cursor: "pointer",
            transition: "background 0.2s",
            marginTop: "auto",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#cc0052")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#FF0066")}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}

export default function Shop() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Header />

      {/* Header da loja */}
      <section
        style={{
          background: "#000",
          paddingTop: "clamp(3rem, 7vw, 6rem)",
          paddingBottom: "clamp(2rem, 4vw, 3rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div className="kicker-pink" style={{ marginBottom: "1rem" }}>
            Pré-venda · Produção sob demanda
          </div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.88,
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            LOJA
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", maxWidth: "500px", lineHeight: 1.7 }}>
            Todas as peças são produzidas sob demanda. Prazo de produção e envio de até 25 dias úteis após confirmação do pagamento via PIX.
          </p>
        </div>
      </section>

      {/* Ticker */}
      <div style={{ background: "#A6FF00", overflow: "hidden", padding: "0.6rem 0" }}>
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#000", fontSize: "0.7rem" }}>
              PRODUÇÃO SOB DEMANDA &nbsp;·&nbsp; PAGAMENTO VIA PIX &nbsp;·&nbsp; FEITO NO BRASIL &nbsp;·&nbsp; 5 CORES DISPONÍVEIS &nbsp;·&nbsp; TAMANHOS P AO XGG &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      {/* Grid de produtos */}
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
              <div className="kicker-green" style={{ marginBottom: "0.5rem" }}>Coleção O Pix É Nosso</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 0.92,
                  color: "#fff",
                }}
              >
                CAMISETA OVERSIZED
              </h2>
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "#A6FF00",
                border: "1px solid #A6FF00",
                padding: "0.3rem 0.75rem",
              }}
            >
              5 CORES · EST. 24
            </div>
          </div>

          {/* Grid de camisetas */}
          <div
            style={{
              display: "grid",
              gap: "2px",
            }}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            {shirts.map((shirt) => (
              <ShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        </div>
      </section>

      {/* Informações */}
      <section
        style={{
          background: "#0a0a0a",
          padding: "clamp(3rem, 6vw, 5rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div
            style={{ display: "grid", gap: "3rem" }}
            className="grid-cols-1 md:grid-cols-3"
          >
            {[
              {
                icon: "📦",
                title: "Produção sob demanda",
                text: "Cada peça é produzida após a confirmação do pedido. Prazo de até 25 dias úteis.",
              },
              {
                icon: "💸",
                title: "Pagamento via PIX",
                text: "Pagamento exclusivo via PIX. Após o pagamento, você recebe a confirmação pelo WhatsApp.",
              },
              {
                icon: "🇧🇷",
                title: "Feito no Brasil",
                text: "Malha de qualidade, produção nacional. Streetwear autoral, do Brasil para o mundo.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.75rem" }}>{item.icon}</div>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.1rem",
                    color: "#fff",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
