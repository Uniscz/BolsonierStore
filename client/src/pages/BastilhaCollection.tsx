import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight } from 'lucide-react';

export default function BastilhaCollection() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">A Bastilha de Bolsonier</h1>
          <p className="text-2xl font-bold mb-2">Revolucao Urbana - Edicao Limitada</p>
          <p className="text-lg text-gray-300">Pecas que carregam a energia da resistencia. Producao sob demanda. Feito no Brasil.</p>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="w-full h-96 bg-gradient-to-br from-lime-acid via-black to-pink-shock flex items-center justify-center border-4 border-black mb-12">
            <div className="text-center text-white">
              <p className="font-bold text-2xl uppercase tracking-wider">ESPACO PARA LOOKBOOK</p>
              <p className="text-sm mt-2">Imagem da colecao A Bastilha de Bolsonier</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-wider mb-6 uppercase">Conceito</h2>
              <p className="text-gray-600 mb-4 leading-relaxed">
                A Bastilha de Bolsonier é a revolucao que a marca esperava. Uma colecao que nao apenas veste, mas grita. Que nao apenas existe, mas resiste.
              </p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Inspirada na energia transformadora das ruas, cada peca carrega simbolos de liberdade, criatividade e poder. Tipografia agressiva, cores que chocam, designs que nao deixam passar despercebido. Porque a Bastilha de Bolsonier é para quem quer mudar o jogo.
              </p>
              <Link href="/loja">
                <a className="inline-flex items-center gap-2 bg-lime-acid text-black px-8 py-4 font-bold tracking-wider hover:bg-pink-shock hover:text-white transition-colors duration-200 uppercase">
                  Comprar Agora
                  <ArrowRight size={20} />
                </a>
              </Link>
            </div>
            <div className="bg-gradient-to-br from-lime-acid to-pink-shock p-8 text-black border-2 border-black">
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
                  <span>Algodao premium + Poliester</span>
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
            {[1, 2, 3, 4].map((i) => (
              <Link key={i} href={`/produto/${i + 8}`}>
                <a className="bg-white border-2 border-black hover:shadow-lg transition-shadow group">
                  <div className="w-full h-64 bg-gradient-to-br from-lime-acid to-pink-shock flex items-center justify-center text-black font-bold text-center p-4 group-hover:from-pink-shock group-hover:to-lime-acid transition-all duration-300">
                    <div>
                      <p className="text-sm uppercase tracking-wider">Produto {i}</p>
                      <p className="text-xs mt-1">Clique para detalhes</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Peca Autoral</h3>
                    <p className="text-gray-600 text-xs mb-4">A Bastilha de Bolsonier</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">R$ 99,90</span>
                      <button className="bg-lime-acid text-black px-3 py-2 font-bold text-xs hover:bg-pink-shock hover:text-white transition-colors">
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
