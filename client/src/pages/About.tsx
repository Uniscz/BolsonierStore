import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function About() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">Sobre</h1>
          <p className="text-xl">Conheca a historia por tras da marca</p>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl font-bold tracking-wider mb-4 uppercase">Bolsonier Store</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Bolsonier Store é mais que uma marca de roupas. é uma atitude. Uma declaracao de que a cultura urbana brasileira merece ser celebrada, amplificada e usada com orgulho.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Nascemos da vontade de criar streetwear autoral, sem compromissos com estetica generica ou tendencias passageiras. Cada peca é pensada, desenhada e produzida com conceito.
              </p>
            </div>

            <div className="border-l-4 border-pink-shock pl-6 py-4">
              <h3 className="text-2xl font-bold tracking-wider mb-3 uppercase">Nossa Missao</h3>
              <p className="text-gray-600 leading-relaxed">
                Criar pecas de streetwear que carregam energia urbana, tipografia ousada e design memoravel. Pecas que fazem quem usa sentir-se parte de algo maior: uma comunidade que valoriza autoria, criatividade e presenca visual.
              </p>
            </div>

            <div className="border-l-4 border-lime-acid pl-6 py-4">
              <h3 className="text-2xl font-bold tracking-wider mb-3 uppercase">Valores</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex gap-2">
                  <span className="font-bold text-pink-shock">•</span>
                  <span><strong>Autoria:</strong> Design original, conceito proprio, sem copia.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-shock">•</span>
                  <span><strong>Qualidade:</strong> Materiais premium, producao cuidadosa, detalhes que importam.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-shock">•</span>
                  <span><strong>Presenca:</strong> Design que nao passa despercebido, que faz diferenca.</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-shock">•</span>
                  <span><strong>Comunidade:</strong> Conectar pessoas que compartilham dessa visao.</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-pink-shock to-lime-acid p-8 text-white">
              <h3 className="text-2xl font-bold tracking-wider mb-3 uppercase">Producao</h3>
              <p className="mb-4">
                Todas as pecas Bolsonier sao produzidas sob demanda. Isso significa que cada peca é feita especialmente para voce, quando voce a encomendar.
              </p>
              <p>
                Isso permite que tenhamos edicoes limitadas, que cada design seja especial, e que nao tenhamos desperdicio. Producao consciente, design intencional.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
