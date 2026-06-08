import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Filter } from 'lucide-react';

export default function Shop() {
  const products = [
    { id: 1, name: 'Camiseta O Pix é Nosso', price: 89.90, category: 'camiseta', collection: 'O Pix é Nosso' },
    { id: 2, name: 'Camiseta Urbana', price: 89.90, category: 'camiseta', collection: 'O Pix é Nosso' },
    { id: 3, name: 'Cropped Grafite', price: 79.90, category: 'cropped', collection: 'O Pix é Nosso' },
    { id: 4, name: 'Body Autoral', price: 99.90, category: 'body', collection: 'O Pix é Nosso' },
    { id: 5, name: 'Camiseta Preta', price: 89.90, category: 'camiseta', collection: 'Classicos' },
    { id: 6, name: 'Camiseta Branca', price: 89.90, category: 'camiseta', collection: 'Classicos' },
    { id: 7, name: 'Cropped Rosa', price: 79.90, category: 'cropped', collection: 'O Pix é Nosso' },
    { id: 8, name: 'Body Verde', price: 99.90, category: 'body', collection: 'Classicos' },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Page Header */}
      <section className="py-12 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-2">Loja</h1>
          <p className="text-lg">Colecoes autorais em edicao limitada</p>
        </div>
      </section>

      {/* Filters and Products */}
      <section className="py-12 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold tracking-wider uppercase">Todos os Produtos</h2>
            <button className="flex items-center gap-2 border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors">
              <Filter size={20} />
              Filtrar
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Link key={product.id} href={`/produto/${product.id}`}>
                <a className="bg-white border-2 border-black hover:shadow-lg transition-shadow group">
                  <div className="w-full h-64 bg-gradient-to-br from-pink-shock to-lime-acid flex items-center justify-center text-white font-bold text-center p-4 group-hover:from-lime-acid group-hover:to-pink-shock transition-all duration-300">
                    {product.name}
                  </div>
                  <div className="p-4">
                    <p className="text-xs text-gray-500 mb-2 uppercase tracking-wider">{product.collection}</p>
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-3">{product.name}</h3>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">R$ {product.price.toFixed(2)}</span>
                      <button className="bg-pink-shock text-white px-3 py-2 font-bold text-xs hover:bg-black transition-colors">
                        +
                      </button>
                    </div>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
