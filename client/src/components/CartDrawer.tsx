import { X, Plus, Minus, Trash2, ShoppingBag, MessageCircle, ShoppingCart } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useCart } from "@/contexts/CartContext";
import { buildWhatsAppHelpMessage, openWhatsApp } from "@/lib/whatsapp";
import { formatPrice } from "@/data/products";
import ProductImage from "@/components/ProductImage";

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, clearCart, total, itemCount, isOpen, closeCart } =
    useCart();
  const [, navigate] = useLocation();

  const handleGoToCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  const handleWhatsAppSupport = () => {
    const url = buildWhatsAppHelpMessage();
    openWhatsApp(url);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 flex flex-col shadow-2xl border-l-4 border-black">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b-4 border-black bg-black text-white">
          <div className="flex items-center gap-2">
            <ShoppingBag size={22} />
            <span
              className="font-black tracking-wider uppercase text-lg"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Carrinho
            </span>
            {itemCount > 0 && (
              <span className="bg-pink-shock text-white text-xs font-black w-6 h-6 flex items-center justify-center rounded-full">
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1 hover:bg-gray-800 transition-colors rounded"
            aria-label="Fechar carrinho"
          >
            <X size={22} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-6 text-center">
              <ShoppingBag size={64} className="text-gray-300" />
              <p className="text-gray-500 font-semibold text-lg">Seu carrinho está vazio.</p>
              <Link href="/produto/camiseta-pix">
                <a
                  onClick={closeCart}
                  className="bg-pink-shock text-white px-6 py-3 font-black tracking-wider uppercase text-sm hover:bg-black transition-colors border-2 border-pink-shock hover:border-black"
                  style={{ fontFamily: "'Bebas Neue', sans-serif" }}
                >
                  Ver produto
                </a>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 border-2 border-black p-3 bg-gray-50"
                >
                  {/* Image */}
                  <div className="w-16 h-16 flex-shrink-0 border border-gray-200 bg-white overflow-hidden">
                    <ProductImage
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                      fallbackClassName="w-16 h-16"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-xs uppercase tracking-wider truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Cor: {item.color} · Tam: {item.size}
                    </p>
                    <p className="text-xs font-bold text-pink-shock mt-1">
                      {formatPrice(item.price)} un.
                    </p>

                    {/* Quantity controls */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        aria-label="Diminuir quantidade"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-colors"
                        aria-label="Aumentar quantidade"
                      >
                        <Plus size={12} />
                      </button>
                      <span className="ml-auto text-sm font-black">
                        {formatPrice(item.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="flex-shrink-0 p-1 hover:text-red-600 transition-colors self-start"
                    aria-label="Remover item"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t-4 border-black p-4 space-y-3 bg-white">
            <div className="flex justify-between items-center">
              <span className="font-black uppercase tracking-wider text-sm">Total</span>
              <span className="font-black text-xl text-pink-shock">{formatPrice(total)}</span>
            </div>

            {/* Botão PRINCIPAL: Finalizar Pedido */}
            <button
              onClick={handleGoToCheckout}
              className="w-full bg-pink-shock text-white py-4 font-black tracking-wider uppercase flex items-center justify-center gap-2 hover:bg-black transition-colors border-2 border-pink-shock hover:border-black"
              style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
            >
              <ShoppingCart size={22} />
              Finalizar Pedido
            </button>

            {/* Botão SECUNDÁRIO: Suporte WhatsApp */}
            <button
              onClick={handleWhatsAppSupport}
              className="w-full py-2.5 font-bold uppercase tracking-wider text-xs border-2 border-gray-300 text-gray-600 hover:border-green-600 hover:text-green-700 transition-colors flex items-center justify-center gap-1.5"
            >
              <MessageCircle size={14} />
              Precisa de ajuda? Falar no WhatsApp
            </button>

            {/* Botão TERCIÁRIO: Limpar carrinho */}
            <button
              onClick={clearCart}
              className="w-full py-2 font-bold uppercase tracking-wider text-xs text-gray-400 hover:text-red-600 transition-colors"
            >
              Limpar carrinho
            </button>
          </div>
        )}
      </div>
    </>
  );
}
