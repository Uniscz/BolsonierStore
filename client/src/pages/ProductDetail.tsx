import { useEffect, useState } from "react";
import { useParams, Link } from "wouter";
import { ShoppingBag, Truck, ShieldCheck } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug, formatPrice } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

// Verde ácido forte e elegante — usado apenas como acento
const ACID = "#7CFC00";

type GalleryView = "conjunto" | "frente" | "dobrada";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const slug = params.id;

  const product = getProductBySlug(slug);
  const colorKeyFromUrl =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("cor")
      : null;
  const initialColor =
    product?.colors.find((c) => c.key === colorKeyFromUrl) ??
    product?.colors[0] ??
    null;

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedView, setSelectedView] = useState<GalleryView>("conjunto");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!product) return;
    const colorFromUrl =
      product.colors.find((c) => c.key === colorKeyFromUrl) ??
      product.colors[0];
    setSelectedColor(colorFromUrl);
    setSelectedView("conjunto");
  }, [colorKeyFromUrl, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-4xl font-black uppercase mb-4">
            Produto não encontrado
          </h1>
          <p className="text-gray-500 mb-8">
            Este produto não existe ou foi removido.
          </p>
          <Link href="/loja">
            <a className="bg-pink-shock text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-black transition-colors">
              Ver loja
            </a>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const orderedImageSources = (() => {
    if (!selectedColor) return null;
    if (selectedColor.key === "preto")
      return {
        conjunto: selectedColor.images.frente,
        frente: selectedColor.images.costas,
        dobrada: selectedColor.images.detalhe,
      };
    if (selectedColor.key === "branco")
      return {
        conjunto: selectedColor.images.detalhe,
        frente: selectedColor.images.costas,
        dobrada: selectedColor.images.frente,
      };
    return {
      conjunto: selectedColor.images.detalhe,
      frente: selectedColor.images.frente,
      dobrada: selectedColor.images.costas,
    };
  })();

  const galleryImages = orderedImageSources
    ? [
        {
          key: "conjunto" as const,
          label: "Frente e costas",
          helper: "visão completa",
          src: orderedImageSources.conjunto,
        },
        {
          key: "frente" as const,
          label: "Frente",
          helper: "estampa principal",
          src: orderedImageSources.frente,
        },
        {
          key: "dobrada" as const,
          label: "Dobrada",
          helper: "detalhe da peça",
          src: orderedImageSources.dobrada,
        },
      ]
    : [];

  const activeImage =
    galleryImages.find((img) => img.key === selectedView) ?? galleryImages[0];
  const currentImage = activeImage?.src ?? product.colors[0].images.frente;

  const handleSelectColor = (color: (typeof product.colors)[number]) => {
    setSelectedColor(color);
    setSelectedView("conjunto");
    if (typeof window !== "undefined")
      window.history.replaceState(
        null,
        "",
        `/produto/${product.slug}?cor=${color.key}`
      );
  };

  const handleAddToCart = () => {
    if (!selectedColor) {
      toast.error("Selecione uma cor antes de continuar.");
      return;
    }
    if (!selectedSize) {
      toast.error("Selecione um tamanho antes de continuar.");
      return;
    }
    addItem({
      productSlug: product.slug,
      name: product.name,
      color: selectedColor.name,
      size: selectedSize,
      quantity,
      price: product.price,
      image: selectedColor.images.frente,
    });
    toast.success("PRODUTO ADICIONADO À SACOLA", {
      description: "Sua peça foi registrada no carrinho.",
      action: { label: "VER CARRINHO", onClick: openCart },
    });
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-widest">
          <Link href="/">
            <a className="hover:text-pink-shock transition-colors">Início</a>
          </Link>
          <span>/</span>
          <Link href="/loja">
            <a className="hover:text-pink-shock transition-colors">Loja</a>
          </Link>
          <span>/</span>
          <span className="text-black font-bold">{product.name}</span>
        </nav>
      </div>

      <section className="py-6 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(400px,0.92fr)] gap-12 items-start">

            {/* ── Galeria ── */}
            <div className="lg:sticky lg:top-24">
              {selectedColor && (
                <p className="text-xs font-black uppercase tracking-[0.26em] text-pink-shock mb-3">
                  {selectedColor.name} · {activeImage?.label ?? "Frente e costas"}
                </p>
              )}
              <div className="group relative bg-[#f7f7f2] overflow-hidden cursor-zoom-in min-h-[420px] lg:min-h-[620px] flex items-center justify-center">
                <ProductImage
                  src={currentImage}
                  alt={`${product.name} - ${selectedColor?.name} - ${activeImage?.label ?? "Frente e costas"}`}
                  className="w-full h-full min-h-[420px] lg:min-h-[620px] object-contain transition-transform duration-500 ease-out group-hover:scale-125"
                  fallbackClassName="w-full h-full min-h-[420px] lg:min-h-[620px]"
                  style={{ padding: "clamp(1rem, 3vw, 2.5rem)" }}
                />
                <div className="pointer-events-none absolute bottom-4 right-4 bg-white/85 backdrop-blur px-3 py-2 text-[0.65rem] font-black uppercase tracking-[0.16em] text-black shadow-sm">
                  Passe o mouse para aproximar
                </div>
              </div>
              {selectedColor && (
                <div className="mt-4 grid grid-cols-3 gap-3">
                  {galleryImages.map((img) => (
                    <button
                      key={img.key}
                      onClick={() => setSelectedView(img.key)}
                      className={`group text-left transition-all ${
                        selectedView === img.key
                          ? "opacity-100"
                          : "opacity-55 hover:opacity-100"
                      }`}
                      aria-label={`Ver ${img.label.toLowerCase()} da cor ${selectedColor.name}`}
                    >
                      <div
                        className={`bg-[#f7f7f2] overflow-hidden border-b-2 transition-colors ${
                          selectedView === img.key
                            ? "border-pink-shock"
                            : "border-transparent"
                        }`}
                      >
                        <ProductImage
                          src={img.src}
                          alt={`${selectedColor.name} - ${img.label}`}
                          className="w-full aspect-[4/5] object-contain transition-transform duration-300 group-hover:scale-110"
                          fallbackClassName="w-full aspect-[4/5]"
                          style={{ padding: "0.6rem" }}
                        />
                      </div>
                      <span className="mt-2 block text-[0.72rem] font-black uppercase tracking-wider text-black">
                        {img.label}
                      </span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.16em] text-gray-400">
                        {img.helper}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Painel de compra ── */}
            <div className="space-y-5">

              {/* Cabeçalho do produto */}
              <div className="pb-4 border-b border-gray-100">
                <p
                  className="text-xs uppercase tracking-[0.22em] mb-2"
                  style={{ color: ACID, fontWeight: 700 }}
                >
                  {product.collection} · Pré-venda
                </p>
                <h1
                  className="font-black uppercase leading-none text-black mb-3"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                  }}
                >
                  {product.name}
                </h1>
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-4xl font-black text-pink-shock">
                    {formatPrice(product.price)}
                  </span>
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded-sm"
                    style={{ background: ACID, color: "#000" }}
                  >
                    Frete grátis
                  </span>
                </div>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* ── Bloco de Cor ── */}
              <div className="bg-black p-5">
                <div className="flex items-center justify-between mb-4">
                  <p
                    className="font-black uppercase tracking-[0.12em] text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                  >
                    Escolha a cor
                  </p>
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5"
                    style={{ background: "#FF0066", color: "#fff" }}
                  >
                    {selectedColor?.name ?? "Selecione"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.colors.map((color) => {
                    const active = selectedColor?.key === color.key;
                    return (
                      <button
                        key={color.key}
                        onClick={() => handleSelectColor(color)}
                        className="flex items-center gap-2.5 px-3 py-3 font-bold text-xs uppercase tracking-wider transition-all duration-150"
                        style={{
                          border: active ? "2px solid #FF0066" : "2px solid rgba(255,255,255,0.15)",
                          background: active ? "#FF0066" : "rgba(255,255,255,0.06)",
                          color: "#fff",
                        }}
                      >
                        <span
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{
                            backgroundColor: color.hex,
                            border: active ? "2px solid #fff" : "1px solid rgba(255,255,255,0.3)",
                          }}
                          aria-hidden="true"
                        />
                        {color.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Bloco de Tamanho ── */}
              <div className="bg-[#0d0d0d] p-5">
                <div className="flex items-center justify-between mb-1">
                  <p
                    className="font-black uppercase tracking-[0.12em] text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                  >
                    Escolha o tamanho
                  </p>
                  <span
                    className="text-xs font-bold uppercase tracking-widest px-2 py-0.5"
                    style={{
                      background: selectedSize ? "#FF0066" : "rgba(255,255,255,0.1)",
                      color: "#fff",
                    }}
                  >
                    {selectedSize ?? "Selecione"}
                  </span>
                </div>
                <p className="text-xs mb-4" style={{ color: ACID }}>
                  Guia de medidas abaixo
                </p>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => {
                    const active = selectedSize === size;
                    return (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className="font-black text-sm transition-all duration-150"
                        style={{
                          width: "3.2rem",
                          height: "3.2rem",
                          border: active ? "2px solid #FF0066" : "2px solid rgba(255,255,255,0.2)",
                          background: active ? "#FF0066" : "rgba(255,255,255,0.05)",
                          color: "#fff",
                        }}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ── Bloco de Quantidade ── */}
              <div className="bg-[#111] p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p
                      className="font-black uppercase tracking-[0.12em] text-white"
                      style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                    >
                      Quantidade
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.4)" }}>
                      Ajuste antes de adicionar
                    </p>
                  </div>
                  <div className="flex items-center" style={{ border: "2px solid rgba(255,255,255,0.15)" }}>
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="font-bold text-xl text-white transition-colors"
                      style={{ width: "2.8rem", height: "2.8rem", background: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FF0066")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span
                      className="font-black text-white text-xl flex items-center justify-center"
                      style={{
                        width: "3rem",
                        height: "2.8rem",
                        borderLeft: "2px solid rgba(255,255,255,0.15)",
                        borderRight: "2px solid rgba(255,255,255,0.15)",
                      }}
                    >
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="font-bold text-xl text-white transition-colors"
                      style={{ width: "2.8rem", height: "2.8rem", background: "transparent" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#FF0066")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Selos de benefício ── */}
              <div className="flex flex-wrap gap-2">
                <span
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5"
                  style={{ border: `1px solid ${ACID}`, color: ACID }}
                >
                  <Truck size={13} />
                  Frete grátis
                </span>
                <span
                  className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider px-3 py-1.5"
                  style={{ border: `1px solid ${ACID}`, color: ACID }}
                >
                  <ShieldCheck size={13} />
                  Pix ou cartão no checkout seguro
                </span>
              </div>

              {/* ── CTA principal ── */}
              <button
                onClick={handleAddToCart}
                className="w-full py-5 font-black uppercase tracking-wider text-xl transition-all duration-200 flex items-center justify-center gap-3"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  background: "#FF0066",
                  color: "#fff",
                  border: "2px solid #FF0066",
                  letterSpacing: "0.12em",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#000";
                  e.currentTarget.style.borderColor = "#000";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#FF0066";
                  e.currentTarget.style.borderColor = "#FF0066";
                }}
              >
                <ShoppingBag size={22} />
                Adicionar ao carrinho
              </button>

              {/* ── Guia de Medidas ── */}
              <div className="border border-gray-200 overflow-hidden">
                <div className="bg-black px-4 py-3 flex items-center justify-between">
                  <h3
                    className="font-black uppercase tracking-wider text-white"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1rem" }}
                  >
                    Guia de Medidas
                  </h3>
                  <span className="text-xs" style={{ color: ACID }}>
                    Medidas aproximadas ±2 cm
                  </span>
                </div>
                <div className="bg-white">
                  <img
                    src="/guia-de-medidas.png"
                    alt="Guia de medidas da camiseta O Pix É Nosso — tabela com tamanhos P ao XGG"
                    className="w-full h-auto block"
                  />
                </div>
              </div>

              {/* ── Detalhes ── */}
              <div className="border-t border-gray-100 pt-4">
                <h3
                  className="font-black uppercase tracking-wider text-sm mb-3 text-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Detalhes da peça
                </h3>
                <ul className="space-y-2">
                  {product.details.map((detail, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-sm text-gray-600"
                    >
                      <span className="font-bold mt-0.5" style={{ color: "#FF0066" }}>
                        ·
                      </span>
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
