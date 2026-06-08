import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getFeaturedProducts, formatPrice } from "@/data/products";

export default function Shop() {
  const products = getFeaturedProducts();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Page Header */}
      <section className="bg-black text-white py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h1
            className="font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              textShadow: "3px 3px 0px #FF006E",
            }}
          >
            Loja
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Pré-venda · Produção sob demanda</p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">
                      {product.collection}
                    </p>
                    <h3 className="font-black text-sm uppercase tracking-wider mb-2">
                      {product.name}
                    </h3>
                    <p className="text-gray-500 text-xs mb-3">
                      {product.colors.length} cores disponíveis · Tamanhos P ao XGG
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
              <p className="text-gray-500 text-lg">Nenhum produto disponível no momento.</p>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
