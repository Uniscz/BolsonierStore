import { useEffect, useState } from "react";
import { Link, useParams } from "wouter";
import { MessageCircle, ShoppingBag, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug, ProductColor } from "@/data/products";
import { buildWhatsAppFreightMessage, buildWhatsAppOrderMessage, openWhatsApp } from "@/lib/whatsapp";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type AngleKey = keyof ProductColor["images"];

const angleLabels: Record<AngleKey, string> = {
  frente: "Frente",
  costas: "Costas",
  detalhe: "Detalhe",
};

function getInitialColor(productColors: ProductColor[] | undefined): ProductColor | null {
  if (!productColors?.length) return null;
  const queryColor = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("cor") : null;
  return productColors.find((color) => color.key === queryColor) ?? productColors[0];
}

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const slug = params.id;
  const product = getProductBySlug(slug);

  const [selectedColor, setSelectedColor] = useState<ProductColor | null>(() => getInitialColor(product?.colors));
  const [selectedSide, setSelectedSide] = useState<AngleKey>("frente");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");

  const { addItem, openCart } = useCart();

  useEffect(() => {
    setSelectedColor(getInitialColor(product?.colors));
    setSelectedSide("frente");
  }, [product?.slug]);

  if (!product) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <div className="container-shell py-32 text-center">
          <h1 className="headline-lg mb-4">Produto não encontrado</h1>
          <p className="body-md mb-8">Este produto não existe ou foi removido.</p>
          <Link href="/loja" className="btn-primary">
            Ver loja
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const activeColor = selectedColor ?? product.colors[0];
  const currentImage = activeColor.images[selectedSide];

  const handleAddToCart = () => {
    if (!activeColor) {
      toast.error("Selecione uma cor antes de continuar.");
      return;
    }
    if (!selectedSize) {
      toast.error("Selecione um tamanho antes de continuar.");
      return;
    }

    addItem({
      productSlug: product.slug,
      name: `${product.name} ${product.collection}`,
      color: activeColor.name,
      size: selectedSize,
      quantity,
      price: product.price,
      image: activeColor.images.frente,
    });

    toast.success("Produto adicionado ao carrinho.", {
      action: { label: "Ver carrinho", onClick: openCart },
    });
  };

  const handleBuyNowWhatsApp = () => {
    if (!activeColor) {
      toast.error("Selecione uma cor antes de continuar.");
      return;
    }
    if (!selectedSize) {
      toast.error("Selecione um tamanho antes de continuar.");
      return;
    }

    const url = buildWhatsAppOrderMessage(
      [
        {
          name: `${product.name} ${product.collection}`,
          color: activeColor.name,
          size: selectedSize,
          quantity,
          price: product.price,
        },
      ],
      product.price * quantity
    );
    openWhatsApp(url);
  };

  const handleFreightWhatsApp = () => {
    openWhatsApp(buildWhatsAppFreightMessage(cep || undefined));
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <div className="container-shell py-4">
        <nav className="product-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Início</Link>
          <span>/</span>
          <Link href="/loja">Loja</Link>
          <span>/</span>
          <span>{product.name}</span>
        </nav>
      </div>

      <section className="product-detail-section">
        <div className="container-shell product-detail-grid">
          <div className="product-gallery">
            <div className="product-main-frame">
              <ProductImage
                src={currentImage}
                alt={`${product.name} ${activeColor.name} — ${angleLabels[selectedSide]}`}
                className="product-main-img"
                fallbackClassName="product-main-fallback"
              />
            </div>

            <div className="product-angle-row">
              {(Object.keys(angleLabels) as AngleKey[]).map((side) => (
                <button
                  key={side}
                  type="button"
                  onClick={() => setSelectedSide(side)}
                  className={selectedSide === side ? "active" : ""}
                >
                  {angleLabels[side]}
                </button>
              ))}
            </div>

            <div className="product-color-thumbs">
              {product.colors.map((color) => (
                <button
                  key={color.key}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={activeColor.key === color.key ? "active" : ""}
                  aria-label={`Selecionar cor ${color.name}`}
                >
                  <ProductImage
                    src={color.images[selectedSide]}
                    alt={color.name}
                    className="product-thumb-img"
                    fallbackClassName="product-thumb-fallback"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="product-info-panel">
            <p className="kicker-pink">{product.collection} · Drop 01</p>
            <h1>
              {product.name}<br />
              <span>{activeColor.name}</span>
            </h1>
            <strong className="product-price">{product.priceDisplay}</strong>
            <p className="product-description">{product.description}</p>

            <div className="product-control-group">
              <label>
                Cor: <span>{activeColor.name}</span>
              </label>
              <div className="product-color-buttons">
                {product.colors.map((color) => (
                  <button
                    key={color.key}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={activeColor.key === color.key ? "active" : ""}
                  >
                    <span style={{ background: color.hex }} />
                    {color.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="product-control-group">
              <label>
                Tamanho: <span>{selectedSize ?? "Selecione"}</span>
              </label>
              <div className="product-size-buttons">
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

            <div className="product-quantity-row">
              <span>Quantidade</span>
              <div>
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))}>−</button>
                <strong>{quantity}</strong>
                <button type="button" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="product-pix-box">
              <Zap size={20} />
              <div>
                <strong>Pagamento via PIX</strong>
                <p>A produção inicia após confirmação do pagamento. Atendimento e frete são finalizados pelo WhatsApp.</p>
              </div>
            </div>

            <div className="product-cta-stack">
              <button type="button" onClick={handleAddToCart} className="btn-primary">
                <ShoppingBag size={18} />
                Adicionar ao carrinho
              </button>
              <button type="button" onClick={handleBuyNowWhatsApp} className="btn-green">
                <MessageCircle size={18} />
                Comprar pelo WhatsApp
              </button>
            </div>

            <div className="product-freight-box">
              <p>Consultar frete</p>
              <span>Frete calculado no atendimento antes da confirmação final do pedido.</span>
              <div>
                <input
                  type="text"
                  placeholder="Seu CEP (opcional)"
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  maxLength={9}
                />
                <button type="button" onClick={handleFreightWhatsApp}>Consultar</button>
              </div>
            </div>

            <div className="product-details-list">
              <h3>Detalhes</h3>
              <ul>
                {product.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
