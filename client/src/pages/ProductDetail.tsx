import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { MessageCircle, ShoppingBag, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug, formatPrice } from "@/data/products";
import { buildWhatsAppFreightMessage, buildWhatsAppHelpMessage, openWhatsApp } from "@/lib/whatsapp";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

type GalleryView = "conjunto" | "frente" | "dobrada";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const [location] = useLocation();
  const slug = params.id;

  const product = getProductBySlug(slug);
  const colorKeyFromUrl = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("cor")
    : null;
  const initialColor = product?.colors.find((color) => color.key === colorKeyFromUrl) ?? product?.colors[0] ?? null;

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [selectedView, setSelectedView] = useState<GalleryView>("conjunto");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");

  const { addItem, openCart } = useCart();

  useEffect(() => {
    if (!product) return;

    const colorFromUrl = product.colors.find((color) => color.key === colorKeyFromUrl) ?? product.colors[0];
    setSelectedColor(colorFromUrl);
    setSelectedView("conjunto");
  }, [location, colorKeyFromUrl, product]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
          <h1 className="text-4xl font-black uppercase mb-4">Produto não encontrado</h1>
          <p className="text-gray-500 mb-8">Este produto não existe ou foi removido.</p>
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

    if (selectedColor.key === "preto") {
      return {
        conjunto: selectedColor.images.frente,
        frente: selectedColor.images.costas,
        dobrada: selectedColor.images.detalhe,
      };
    }

    if (selectedColor.key === "branco") {
      return {
        conjunto: selectedColor.images.detalhe,
        frente: selectedColor.images.costas,
        dobrada: selectedColor.images.frente,
      };
    }

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

  const activeImage = galleryImages.find((image) => image.key === selectedView) ?? galleryImages[0];
  const currentImage = activeImage?.src ?? product.colors[0].images.frente;

  const handleSelectColor = (color: typeof product.colors[number]) => {
    setSelectedColor(color);
    setSelectedView("conjunto");

    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `/produto/${product.slug}?cor=${color.key}`);
    }
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
      action: {
        label: "VER CARRINHO",
        onClick: openCart,
      },
    });
  };

  const handleFreightWhatsApp = () => {
    const url = buildWhatsAppFreightMessage(cep || undefined);
    openWhatsApp(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/">
            <a className="hover:text-pink-shock transition-colors">Início</a>
          </Link>
          <span>/</span>
          <Link href="/loja">
            <a className="hover:text-pink-shock transition-colors">Loja</a>
          </Link>
          <span>/</span>
          <span className="text-black font-semibold">{product.name}</span>
        </nav>
      </div>

      <section className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.08fr)_minmax(380px,0.92fr)] gap-12 items-start">
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
                  {galleryImages.map((image) => (
                    <button
                      key={image.key}
                      onClick={() => setSelectedView(image.key)}
                      className={`group text-left transition-all ${
                        selectedView === image.key
                          ? "opacity-100"
                          : "opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Ver ${image.label.toLowerCase()} da cor ${selectedColor.name}`}
                    >
                      <div
                        className={`bg-[#f7f7f2] overflow-hidden border-b-2 transition-colors ${
                          selectedView === image.key ? "border-pink-shock" : "border-transparent"
                        }`}
                      >
                        <ProductImage
                          src={image.src}
                          alt={`${selectedColor.name} - ${image.label}`}
                          className="w-full aspect-[4/5] object-contain transition-transform duration-300 group-hover:scale-110"
                          fallbackClassName="w-full aspect-[4/5]"
                          style={{ padding: "0.6rem" }}
                        />
                      </div>
                      <span className="mt-2 block text-[0.72rem] font-black uppercase tracking-wider text-black">
                        {image.label}
                      </span>
                      <span className="block text-[0.62rem] uppercase tracking-[0.16em] text-gray-400">
                        {image.helper}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-7">
              <div>
                <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                  {product.collection}
                </p>
                <h1
                  className="font-black uppercase mb-4 leading-tight text-black"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(2rem, 5vw, 3rem)",
                  }}
                >
                  {product.name}
                </h1>
                <p className="text-3xl font-black text-pink-shock mb-6">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              <div className="border-2 border-black p-5 bg-white">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <p className="font-black uppercase tracking-wider text-sm">Escolha a cor</p>
                  <span className="text-pink-shock font-black uppercase text-xs tracking-wider">
                    {selectedColor?.name ?? "Selecione"}
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => handleSelectColor(color)}
                      className={`px-3 py-3 font-bold text-xs border-2 transition-all flex items-center gap-2 justify-center ${
                        selectedColor?.key === color.key
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-gray-100"
                      }`}
                    >
                      <span
                        className="w-3 h-3 rounded-full border border-gray-400"
                        style={{ backgroundColor: color.hex }}
                        aria-hidden="true"
                      />
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black p-5 bg-white">
                <div className="flex items-center justify-between gap-4 mb-4">
                  <p className="font-black uppercase tracking-wider text-sm">Escolha o tamanho</p>
                  <span className="text-pink-shock font-black uppercase text-xs tracking-wider">
                    {selectedSize ?? "Selecione"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 font-black text-sm border-2 transition-all ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-gray-100"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black p-5 bg-[#f7f7f2] text-black">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <p className="font-black uppercase tracking-wider text-sm text-black">Quantidade</p>
                    <p className="text-xs uppercase tracking-[0.14em] text-gray-700 mt-1">
                      Ajuste antes de enviar o pedido
                    </p>
                  </div>
                  <div className="flex items-center border-2 border-black bg-white self-start sm:self-auto">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 font-bold text-lg text-black hover:bg-black hover:text-white transition-colors"
                      aria-label="Diminuir quantidade"
                    >
                      −
                    </button>
                    <span className="text-xl font-black text-black w-14 text-center border-x-2 border-black h-12 flex items-center justify-center">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 font-bold text-lg text-black hover:bg-black hover:text-white transition-colors"
                      aria-label="Aumentar quantidade"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-pink-shock text-white border-2 border-pink-shock">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className="text-lime-acid" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    Pagamento via PIX
                  </span>
                </div>
                <p className="text-sm opacity-90">
                  Finalize seu pedido pelo site e receba a chave PIX para pagamento. A produção inicia após confirmação.
                </p>
              </div>

              <div className="space-y-3">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 font-black uppercase tracking-wider text-lg transition-all duration-200 border-2 bg-black text-white border-black hover:bg-pink-shock hover:border-pink-shock flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <ShoppingBag size={22} />
                  Adicionar ao carrinho
                </button>
                <button
                  onClick={() => openWhatsApp(buildWhatsAppHelpMessage())}
                  className="w-full py-3 font-bold uppercase tracking-wider text-sm transition-all duration-200 border-2 border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-700 flex items-center justify-center gap-2"
                >
                  <MessageCircle size={18} />
                  Dúvidas sobre tamanho? Falar no WhatsApp
                </button>
              </div>

              <div className="border-2 border-gray-200 p-4">
                <p className="font-bold uppercase text-sm mb-3">Consultar frete</p>
                <p className="text-sm text-gray-600 mb-3">
                  Frete calculado no atendimento pelo WhatsApp antes da confirmação final do pedido.
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Seu CEP (opcional)"
                    value={cep}
                    onChange={(e) => setCep(e.target.value)}
                    className="flex-1 border-2 border-black px-3 py-2 text-sm font-semibold focus:outline-none focus:border-pink-shock"
                    maxLength={9}
                  />
                  <button
                    onClick={handleFreightWhatsApp}
                    className="bg-black text-white px-4 py-2 font-bold text-xs uppercase tracking-wider hover:bg-pink-shock transition-colors border-2 border-black hover:border-pink-shock whitespace-nowrap"
                  >
                    Consultar frete
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-black uppercase tracking-wider text-sm mb-3">Detalhes</h3>
                <ul className="space-y-2">
                  {product.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                      <span className="text-pink-shock font-bold mt-0.5">·</span>
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
