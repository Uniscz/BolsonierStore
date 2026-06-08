import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

const COLLECTION_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/collection-showcase-DMw5oUHbJQyX29GuaU5Ynh.webp';

export default function Collection() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">O Pix é Nosso</h1>
          <p className="text-2xl font-bold mb-2">Drop Autoral - Edicao Limitada</p>
          <p className="text-lg text-gray-300">Peças que definem uma atitude. Produção sob demanda. Feito no Brasil.</p>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <img src={COLLECTION_IMAGE} alt="O Pix é Nosso" className="w-full mb-12" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-wider mb-6 uppercase">Conceito</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                O Pix é Nosso é mais que uma colecao. é uma declaracao. Uma afirmacao de que a cultura urbana brasileira é forte, criativa e merece ser celebrada.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Cada peca carrega elementos de pichacao contemporanea, tipografia ousada e design que nao passa despercebido. Porque quem usa Bolsonier nao quer passar despercebido.
              </p>
              <Link href="/loja">
                <a className="inline-flex items-center gap-2 bg-pink-shock text-white px-8 py-4 font-bold tracking-wider hover:bg-black transition-colors duration-200 uppercase">
                  Comprar Agora
                  <ArrowRight size={20} />
                </a>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-pink-shock to-lime-acid p-8 text-white">
              <h3 className="text-2xl font-bold mb-4 uppercase">Detalhes</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="font-bold">Producao:</span>
                  <span>Sob demanda, feita no Brasil</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Prazo:</span>
                  <span>Ate 25 dias uteis</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Quantidade:</span>
                  <span>Edicao limitada</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Materiais:</span>
                  <span>Algodao premium</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Garantia:</span>
                  <span>Satisfacao ou devolucao</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-7xl mx-auto">
          <h2 className="display-text mb-12">Pecas da Colecao</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white border-2 border-black hover:shadow-lg transition-shadow">
                <div className="w-full h-64 bg-gradient-to-br from-pink-shock to-lime-acid flex items-center justify-center text-white font-bold text-center p-4">
                  Peca {i}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Peca Autoral</h3>
                  <p className="text-gray-600 text-xs mb-4">O Pix é Nosso</p>
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-lg">R$ 89,90</span>
                    <button className="bg-pink-shock text-white px-3 py-2 font-bold text-xs hover:bg-black transition-colors">
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
