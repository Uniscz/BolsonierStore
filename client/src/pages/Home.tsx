import { Link } from "wouter";
import { ArrowRight, Zap, MessageCircle, ShoppingBag } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { getFeaturedProducts } from "@/data/products";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function Home() {
  const featuredProducts = getFeaturedProducts();
  const mainProduct = featuredProducts[0];
  const whatsappHelp = buildWhatsAppHelpMessage();

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="bg-black text-white py-20 px-4 relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, #FF006E 0, #FF006E 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <div className="max-w-3xl">
            <p
              className="text-lime-acid font-black tracking-widest uppercase text-sm mb-4"
              style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.3em" }}
            >
              Pré-venda · Produção sob demanda
            </p>
            <h1
              className="font-black uppercase mb-6 leading-none"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(3rem, 10vw, 7rem)",
                textShadow: "4px 4px 0px #FF006E",
                lineHeight: 0.9,
              }}
            >
              O PIX
              <br />
              <span style={{ color: "#FF006E" }}>É NOSSO</span>
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-xl leading-relaxed">
              Streetwear autoral brasileiro. Uma peça urbana, forte e divertida, feita para quem
              entende a piada antes de todo mundo.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/produto/camiseta-pix">
                <a
                  className="inline-flex items-center gap-2 bg-pink-shock text-white px-8 py-4 font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 uppercase border-2 border-pink-shock hover:border-white"
                  style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
                >
                  Comprar Agora
                  <ArrowRight size={20} />
                </a>
              </Link>
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-transparent text-white px-8 py-4 font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 uppercase border-2 border-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
              >
                <MessageCircle size={20} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Product */}
      {mainProduct && (
        <section className="py-20 px-4 bg-gray-50">
          <div className="container max-w-7xl mx-auto">
            <h2
              className="font-black uppercase mb-12 text-center"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                textShadow: "3px 3px 0px #FF006E",
              }}
            >
              Lançamento
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {mainProduct.colors.map((color) => (
                <Link key={color.key} href="/produto/camiseta-pix">
                  <a className="bg-white border-2 border-black hover:shadow-lg hover:-translate-y-1 transition-all duration-200 group block">
                    <div className="overflow-hidden">
                      <ProductImage
                        src={color.images.frente}
                        alt={`${mainProduct.name} - ${color.name}`}
                        className="w-full h-64 object-contain bg-gray-100 group-hover:scale-105 transition-transform duration-300"
                        fallbackClassName="w-full h-64"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-black text-sm uppercase tracking-wider mb-1">
                        {mainProduct.name}
                      </h3>
                      <p className="text-gray-500 text-xs mb-3">{color.name}</p>
                      <div className="flex justify-between items-center">
                        <span className="font-black text-lg text-pink-shock">
                          {mainProduct.priceDisplay}
                        </span>
                        <span className="bg-pink-shock text-white px-3 py-1.5 font-bold text-xs hover:bg-black transition-colors">
                          Ver
                        </span>
                      </div>
                    </div>
                  </a>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How it works */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-3xl">
            <h2
              className="font-black uppercase mb-6"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                color: "#CCFF00",
              }}
            >
              Pagamento Exclusivo via PIX
            </h2>
            <p className="text-2xl font-bold mb-4 uppercase tracking-wider">O PIX É NOSSO</p>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed">
              Nosso modelo é simples e direto: você escolhe, paga via PIX, e nós produzimos
              especialmente para você. Sem intermediários. Sem taxas abusivas.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: "1. Escolha",
                  text: "Navegue pela loja e escolha a peça que mais combina com seu estilo.",
                },
                {
                  step: "2. Pague via PIX",
                  text: "Finalize pelo WhatsApp e receba a chave PIX para pagamento.",
                },
                {
                  step: "3. Receba",
                  text: "Após confirmação do pagamento, produzimos e enviamos sua peça.",
                },
              ].map((item) => (
                <div key={item.step} className="border-2 border-lime-acid p-6">
                  <h3 className="text-xl font-bold mb-3 uppercase">{item.step}</h3>
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Info strip */}
      <section className="py-12 px-4 bg-pink-shock text-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <ShoppingBag size={40} className="mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Produção sob demanda</h3>
              <p className="text-sm opacity-90">Feito especialmente para você</p>
            </div>
            <div>
              <Zap size={40} className="mx-auto mb-4 text-lime-acid" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Até 25 dias úteis</h3>
              <p className="text-sm opacity-90">Prazo de produção e envio</p>
            </div>
            <div>
              <MessageCircle size={40} className="mx-auto mb-4 text-white" />
              <h3 className="text-xl font-bold tracking-wider mb-2 uppercase">Atendimento WhatsApp</h3>
              <p className="text-sm opacity-90">+55 47 99610-3720</p>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <h2
              className="font-black uppercase mb-6"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
              }}
            >
              Sobre Bolsonier
            </h2>
            <p className="text-lg text-gray-700 mb-4 font-semibold">Streetwear com atitude urbana</p>
            <p className="text-gray-600 leading-relaxed mb-6">
              Bolsonier Store é uma marca autoral de streetwear que respira a energia das ruas
              brasileiras. Com foco em design contemporâneo, tipografia ousada e conceito visual
              marcante, cada peça é uma declaração de estilo e presença.
            </p>
            <Link href="/sobre">
              <a className="inline-flex items-center gap-2 font-bold uppercase tracking-wider text-sm hover:text-pink-shock transition-colors">
                Saiba mais <ArrowRight size={16} />
              </a>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
