import { Link } from "wouter";
import { ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFeaturedProducts, formatPrice } from "@/data/products";

export default function Collection() {
  const products = getFeaturedProducts().filter((p) => p.collection === "O Pix é Nosso");

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(-45deg, #CCFF00 0, #CCFF00 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <p
            className="text-lime-acid font-black tracking-widest uppercase text-sm mb-4"
            style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.3em" }}
          >
            Coleção
          </p>
          <h1
            className="font-black uppercase mb-4 leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              textShadow: "4px 4px 0px #FF006E",
            }}
          >
            O PIX É NOSSO
          </h1>
          <p className="text-gray-300 text-lg max-w-xl leading-relaxed">
            Streetwear autoral brasileiro. Uma peça urbana, forte e divertida, feita para quem
            entende a piada antes de todo mundo.
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <Link key={product.slug} href={`/produto/${product.slug}`}>
                <a className="bg-white border-2 border-black hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group block">
                  <div className="overflow-hidden">
                    <img
                      src={product.colors[0].images.frente}
                      alt={product.name}
                      className="w-full h-72 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-black text-sm uppercase tracking-wider mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">
                      {product.colors.length} cores · Tamanhos P ao XGG
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="font-black text-lg text-pink-shock">
                        {formatPrice(product.price)}
                      </span>
                      <span className="bg-pink-shock text-white px-3 py-1.5 font-bold text-xs hover:bg-black transition-colors">
                        Ver produto
                      </span>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>

          {products.length === 0 && (
            <div className="text-center py-20">
              <p className="text-gray-500 text-lg">Nenhum produto disponível nesta coleção.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
