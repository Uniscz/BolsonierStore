import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug, ProductColor } from "@/data/products";

const product = getProductBySlug("camiseta-pix")!;

function StoreTicker() {
  const text = "PRODUÇÃO SOB DEMANDA · PAGAMENTO VIA PIX · FEITO NO BRASIL · 5 CORES DISPONÍVEIS · TAMANHOS P AO XGG";
  return (
    <div className="ticker ticker-green">
      <div className="ticker-track">
        {Array.from({ length: 4 }).map((_, index) => (
          <span key={index} className="ticker-item">
            {text}
          </span>
        ))}
      </div>
    </div>
  );
}

function ShirtCard({ color }: { color: ProductColor }) {
  const [angle, setAngle] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const { addItem, openCart } = useCart();

  const activeImage = color.mockups[angle] ?? color.mockups[0];
  const productUrl = `/produto/${product.slug}?cor=${color.key}`;

  const handleAdd = () => {
    if (!selectedSize) {
      alert("Selecione um tamanho antes de adicionar ao carrinho.");
      return;
    }

    addItem({
      productSlug: product.slug,
      name: `${product.name} ${product.collection} — ${color.name}`,
      price: product.price,
      size: selectedSize,
      color: color.name,
      image: color.images.frente,
      quantity: 1,
    });
    openCart();
  };

  return (
    <article className="shop-card">
      <Link href={productUrl}>
        <a className="shop-card-media" aria-label={`Ver ${product.name} na cor ${color.name}`}>
          <ProductImage
            src={activeImage}
            alt={`${product.name} ${color.name} — ${product.mockupAngles[angle] ?? "Frente"}`}
            className="shop-card-img"
            fallbackClassName="shop-card-fallback"
          />
          <span className="shop-card-badge">Drop 01</span>
        </a>
      </Link>

      <div className="shop-card-body">
        <div className="shop-card-head">
          <span className="shop-card-swatch" style={{ background: color.hex }} />
          <div>
            <p>Oversized T-Shirt</p>
            <h3>{color.name}</h3>
          </div>
          <strong>{product.priceDisplay}</strong>
        </div>

        <div className="shop-card-angles" aria-label="Selecionar ângulo do mockup">
          {product.mockupAngles.map((label, index) => (
            <button
              key={label}
              type="button"
              onClick={() => setAngle(index)}
              className={index === angle ? "active" : ""}
              aria-label={`Ver ${label}`}
            >
              {label}
            </button>
          ))}
        </div>

        <div>
          <p className="shop-card-label">Tamanho</p>
          <div className="shop-size-grid">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={selectedSize === size ? "active" : ""}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="shop-card-actions">
          <button type="button" onClick={handleAdd} className="shop-add-button">
            Adicionar
          </button>
          <Link href={productUrl}>
            <a className="shop-detail-link">Ver detalhes</a>
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function Shop() {
  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Header />

      <section className="shop-hero-section">
        <div className="container-shell shop-hero-grid">
          <div>
            <p className="kicker-pink">Pré-venda · Produção sob demanda</p>
            <h1>
              LOJA<br />
              <span>O PIX É NOSSO</span>
            </h1>
            <p>
              A primeira camiseta da BOLSONIER STORE em cinco cores. Escolha o mockup, selecione o tamanho e finalize pelo carrinho com atendimento via WhatsApp.
            </p>
          </div>
          <img src={product.stampImage} alt="Selo O Pix É Nosso" className="shop-hero-stamp" />
        </div>
      </section>

      <StoreTicker />

      <section className="shop-grid-section">
        <div className="container-shell">
          <div className="shop-section-head">
            <div>
              <p className="kicker-green">Coleção {product.collection}</p>
              <h2>{product.name}</h2>
            </div>
            <span>5 cores · {product.priceDisplay} · Est. 24</span>
          </div>

          <div className="shop-product-grid">
            {product.colors.map((color) => (
              <ShirtCard key={color.key} color={color} />
            ))}
          </div>
        </div>
      </section>

      <section className="shop-info-section">
        <div className="container-shell shop-info-grid">
          {[
            {
              title: "Produção sob demanda",
              text: "Cada peça é produzida após a confirmação do pedido. O prazo de produção e envio é de até 25 dias úteis.",
            },
            {
              title: "Pagamento via PIX",
              text: "O pagamento é feito via PIX. Após a confirmação, o atendimento acompanha seu pedido pelo WhatsApp.",
            },
            {
              title: "Feito no Brasil",
              text: "Malha nacional, linguagem brasileira e estética streetwear premium para o primeiro drop da marca.",
            },
          ].map((item, index) => (
            <article key={item.title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
