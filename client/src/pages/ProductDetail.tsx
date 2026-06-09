import { useState } from "react";
import { useParams, Link } from "wouter";
import { MessageCircle, ShoppingBag, Zap } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { getProductBySlug, formatPrice } from "@/data/products";
import { buildWhatsAppOrderMessage, buildWhatsAppFreightMessage, openWhatsApp } from "@/lib/whatsapp";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

export default function ProductDetail() {
  const params = useParams<{ id: string }>();
  const slug = params.id;

  const product = getProductBySlug(slug);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0] ?? null);
  const [selectedSide, setSelectedSide] = useState<"frente" | "costas">("frente");
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [cep, setCep] = useState("");

  const { addItem, openCart } = useCart();

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

  const currentImage = selectedColor
    ? selectedColor.images[selectedSide]
    : product.colors[0].images[selectedSide];

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

    toast.success("Produto adicionado ao carrinho.", {
      action: {
        label: "Ver carrinho",
        onClick: openCart,
      },
    });
  };

  const handleBuyNowWhatsApp = () => {
    if (!selectedColor) {
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
          name: product.name,
          color: selectedColor.name,
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
    const url = buildWhatsAppFreightMessage(cep || undefined);
    openWhatsApp(url);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Breadcrumb */}
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

      {/* Product */}
      <section className="py-8 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Gallery */}
            <div>
              {/* Main image */}
              <div
                className="border-2 border-black mb-4 bg-gray-50 flex items-center justify-center overflow-hidden"
                style={{ minHeight: "400px" }}
              >
                <ProductImage
                  src={currentImage}
                  alt={`${product.name} - ${selectedColor?.name} - ${selectedSide}`}
                  className="w-full max-h-[500px] object-contain"
                  fallbackClassName="w-full"
                  style={{ minHeight: "400px" }}
                />
              </div>

              {/* Side toggle */}
              <div className="flex gap-2 mb-4">
                {(["frente", "costas"] as const).map((side) => (
                  <button
                    key={side}
                    onClick={() => setSelectedSide(side)}
                    className={`px-4 py-2 font-bold uppercase text-xs tracking-wider border-2 transition-colors ${
                      selectedSide === side
                        ? "bg-black text-white border-black"
                        : "bg-white text-black border-black hover:bg-gray-100"
                    }`}
                  >
                    {side === "frente" ? "Frente" : "Costas"}
                  </button>
                ))}
              </div>

              {/* Color thumbnails */}
              {selectedColor && (
                <div className="grid grid-cols-5 gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setSelectedColor(color)}
                      className={`border-2 overflow-hidden transition-all ${
                        selectedColor.key === color.key
                          ? "border-pink-shock scale-105"
                          : "border-gray-200 hover:border-black"
                      }`}
                    >
                      <ProductImage
                        src={color.images[selectedSide]}
                        alt={color.name}
                        className="w-full h-16 object-contain bg-gray-50"
                        fallbackClassName="w-full h-16"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div>
              <p className="text-sm text-gray-500 uppercase tracking-wider mb-2">
                {product.collection}
              </p>
              <h1
                className="font-black uppercase mb-4 leading-tight"
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

              <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

              {/* Color selection */}
              <div className="mb-6">
                <label className="font-black uppercase tracking-wider text-sm block mb-3">
                  Cor:{" "}
                  <span className="text-pink-shock">{selectedColor?.name ?? "Selecione"}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.key}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 font-bold text-sm border-2 transition-all ${
                        selectedColor?.key === color.key
                          ? "bg-black text-white border-black"
                          : "bg-white text-black border-black hover:bg-gray-100"
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size selection */}
              <div className="mb-6">
                <label className="font-black uppercase tracking-wider text-sm block mb-3">
                  Tamanho:{" "}
                  <span className="text-pink-shock">{selectedSize ?? "Selecione"}</span>
                </label>
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

              {/* Quantity */}
              <div className="mb-8">
                <label className="font-black uppercase tracking-wider text-sm block mb-3">
                  Quantidade
                </label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 border-2 border-black font-bold text-lg hover:bg-black hover:text-white transition-colors"
                  >
                    −
                  </button>
                  <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 border-2 border-black font-bold text-lg hover:bg-black hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* PIX Info */}
              <div className="mb-6 p-4 bg-pink-shock text-white border-2 border-pink-shock">
                <div className="flex items-center gap-2 mb-2">
                  <Zap size={20} className="text-lime-acid" />
                  <span className="font-bold uppercase tracking-wider text-sm">
                    Pagamento via PIX
                  </span>
                </div>
                <p className="text-sm opacity-90">
                  Após finalizar pelo WhatsApp, você receberá a chave PIX. A produção inicia após
                  confirmação do pagamento.
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="w-full py-4 font-black uppercase tracking-wider text-lg transition-all duration-200 border-2 bg-black text-white border-black hover:bg-pink-shock hover:border-pink-shock flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <ShoppingBag size={22} />
                  Adicionar ao carrinho
                </button>
                <button
                  onClick={handleBuyNowWhatsApp}
                  className="w-full py-4 font-black uppercase tracking-wider text-lg transition-all duration-200 border-2 bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  <MessageCircle size={22} />
                  Comprar agora pelo WhatsApp
                </button>
              </div>

              {/* Freight */}
              <div className="border-2 border-gray-200 p-4 mb-6">
                <p className="font-bold uppercase text-sm mb-3">Consultar frete</p>
                <p className="text-sm text-gray-600 mb-3">
                  Frete calculado no atendimento pelo WhatsApp antes da confirmação final do pedido.
                </p>
                <div className="flex gap-2">
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

              {/* Details */}
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
