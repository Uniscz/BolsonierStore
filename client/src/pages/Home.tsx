import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Zap } from 'lucide-react';

const HERO_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/hero-pix-nosso-hJ33UxYd6Amx3wGBM3TYm6.webp';
const COLLECTION_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/collection-showcase-DMw5oUHbJQyX29GuaU5Ynh.webp';
const TEXTURE_IMAGE = 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/texture-graffiti-7kusHWvm3ENGhDWxWqGSPe.webp';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero Section */}
      <section className="relative w-full h-screen max-h-screen overflow-hidden bg-white">
        <img
          src={HERO_IMAGE}
          alt="O Pix é Nosso"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white/20" />
        
        {/* CTA Overlay */}
        <div className="absolute bottom-8 left-8 right-8 md:bottom-16 md:left-16 md:right-16 flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-4">
            <Link href="/colecao-pix">
              <a className="bg-pink-shock text-white px-8 py-4 font-bold tracking-wider hover:bg-black transition-colors duration-200 uppercase text-sm md:text-base flex items-center justify-center gap-2 flex-1 md:flex-none">
                Ver Colecao
                <ArrowRight size={20} />
              </a>
            </Link>
            <button className="border-2 border-black text-black px-8 py-4 font-bold tracking-wider hover:bg-black hover:text-white transition-colors duration-200 uppercase text-sm md:text-base">
              Comprar Agora
            </button>
          </div>
        </div>
      </section>

      {/* Collection Showcase */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="display-text mb-6">O Pix é Nosso</h2>
              <p className="text-lg text-gray-700 mb-4 font-semibold">Drop autoral em pre-venda</p>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Pecas autorais da Bolsonier Store. Producao sob demanda. Drop inicial em edicao limitada. Cada peca carrega a energia urbana e a atitude que define a marca.
              </p>
              <div className="flex gap-4 flex-wrap">
                <Link href="/colecao-pix">
                  <a className="bg-lime-acid text-black px-6 py-3 font-bold tracking-wider hover:bg-pink-shock hover:text-white transition-colors duration-200 uppercase text-sm">
                    Explorar Colecao
                  </a>
                </Link>
                <Link href="/loja">
                  <a className="border-2 border-black text-black px-6 py-3 font-bold tracking-wider hover:bg-black hover:text-white transition-colors duration-200 uppercase text-sm">
                    Ver Todos
                  </a>
                </Link>
              </div>
            </div>
            <img src={COLLECTION_IMAGE} alt="Colecao O Pix é Nosso" className="w-full" />
          </div>
        </div>
      </section>

      {/* Pre-venda Info */}
      <section className="py-16 px-4 bg-pink-shock text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Zap size={40} className="mx-auto mb-4 text-lime-acid" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Edicao Limitada</h3>
              <p className="text-sm">Quantidade restrita para cada design</p>
            </div>
            <div className="text-center">
              <Zap size={40} className="mx-auto mb-4 text-lime-acid" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Producao Sob Demanda</h3>
              <p className="text-sm">Feito especialmente para voce</p>
            </div>
            <div className="text-center">
              <Zap size={40} className="mx-auto mb-4 text-lime-acid" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Ate 25 dias</h3>
              <p className="text-sm">Prazo de producao e envio</p>
            </div>
          </div>
        </div>
      </section>

      {/* PIX Payment Section */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2 className="display-text mb-6 text-lime-acid">Pagamento Exclusivo via PIX</h2>
            <p className="text-2xl font-bold mb-4 uppercase tracking-wider">O PIX É NOSSO</p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Nosso modelo de negocio é simples e direto: você escolhe, paga via PIX, e nós produzimos especialmente para você. Sem intermediarios. Sem taxas abusivas. Apenas qualidade, criatividade e velocidade.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border-2 border-lime-acid p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">1. Escolha</h3>
                <p className="text-sm text-gray-300">Navegue pela loja e escolha a peca que mais combina com seu estilo.</p>
              </div>
              <div className="border-2 border-lime-acid p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">2. Pague via PIX</h3>
                <p className="text-sm text-gray-300">Confirme seu pedido e receba a chave PIX para pagamento instantaneo.</p>
              </div>
              <div className="border-2 border-lime-acid p-6">
                <h3 className="text-xl font-bold mb-3 uppercase">3. Receba</h3>
                <p className="text-sm text-gray-300">Apos confirmacao do pagamento, produzimos e enviamos sua peca.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Brand */}
      <section className="py-20 px-4 bg-white relative">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `url(${TEXTURE_IMAGE})`,
            backgroundSize: 'cover',
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="max-w-2xl">
            <h2 className="display-text mb-6">Sobre Bolsonier</h2>
            <p className="text-lg text-gray-700 mb-4 font-semibold">Streetwear com atitude urbana</p>
            <p className="text-gray-600 leading-relaxed">
              Bolsonier Store é uma marca autoral de streetwear que respira a energia das ruas brasileiras. Com foco em design contemporaneo, tipografia ousada e conceito visual marcante, cada peca é uma declaracao de estilo e presenca.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container max-w-7xl mx-auto">
          <h2 className="display-text mb-12 text-center">Destaques</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {[
              { color: 'Preto', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/preto_0_5670725_f8f5ea53.png' },
              { color: 'Branco', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/branco_1_5670725_55ece778.png' },
              { color: 'Azul Royal', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/azul-royal_3_5670725_6f88a1fa.png' },
              { color: 'Verde Bandeira', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/verde-bandeira_4_5670725_89e125cf.png' },
              { color: 'Amarelo Canário', image: 'https://d2xsxph8kpxj0f.cloudfront.net/310519663381634216/matQj4Bq3p2qq2UcicK4zv/amarelo-canario_2_5670725_b1bf8634.png' },
            ].map((product) => (
              <Link key={product.color} href="/camiseta-pix">
                <a className="bg-white border-2 border-black hover:shadow-lg transition-shadow">
                  <img src={product.image} alt={product.color} className="w-full h-64 object-cover" />
                  <div className="p-4">
                    <h3 className="font-bold text-sm uppercase tracking-wider mb-2">Camiseta Autoral</h3>
                    <p className="text-gray-600 text-xs mb-4">O Pix é Nosso - {product.color}</p>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-lg">R$ 99,90</span>
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
