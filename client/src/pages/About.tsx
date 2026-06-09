import { Link } from "wouter";
import { ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function About() {
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
              "repeating-linear-gradient(45deg, #CCFF00 0, #CCFF00 1px, transparent 0, transparent 50%)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="container max-w-7xl mx-auto relative z-10">
          <h1
            className="font-black uppercase mb-4 leading-none"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 7rem)",
              textShadow: "4px 4px 0px #FF006E",
            }}
          >
            Sobre
          </h1>
          <p className="text-gray-300 text-xl max-w-xl">
            A história por trás da Bolsonier Store e do universo criado por André, da página @euinelegivel.
          </p>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="font-black uppercase mb-6"
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 3.5rem)",
                }}
              >
                Bolsonier Store
              </h2>
              <p className="text-lg text-gray-700 mb-4 font-semibold">
                Um universo criado na internet para ser vestido na vida real.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Para quem ainda não me conhece, eu sou o André, criador da página @euinelegivel. Sou criador de conteúdo por teimosia e por visão, e a Bolsonier Store nasceu de uma ideia muito simples: transformar o universo que criei na internet em algo real, que pudesse ser vestido.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Tudo começou com as sátiras e os delírios tais como a Bastilha de Bolsonier. O que era apenas humor e meme acabou crescendo. Deixou de ser só vídeo para virar uma estética, uma identidade e um público. Foi essa energia que deu origem à loja.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Eu não vim da moda, não tenho formação em marketing e não conto com uma equipe gigante. O que eu tenho são ideias grandes e a vontade absurda de construir algo meu. Cada peça que você vê aqui carrega exatamente isso: um pedaço dessa trajetória, o deboche, a narrativa e a criatividade de quem faz acontecer.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                A Bolsonier Store é a prova de que, com as ferramentas certas e coragem para começar, é possível construir a própria história sem pedir licença ou esperar por um manual de instruções. É uma marca feita na prática, no improviso e em parceria com quem já acompanha e entende a nossa brincadeira.
              </p>
              <p className="text-gray-600 leading-relaxed">
                A nossa ideia é simples: vestir um universo criado por quem decidiu não esperar autorização para existir.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-shock to-lime-acid p-8 text-white border-2 border-black">
              <h3 className="text-2xl font-bold mb-4 uppercase">Detalhes</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex gap-2">
                  <span className="font-bold">Criador:</span>
                  <span>André, da página @euinelegivel</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Origem:</span>
                  <span>Sátiras, memes e a Bastilha de Bolsonier</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Proposta:</span>
                  <span>Transformar o universo da internet em peças reais</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Produção:</span>
                  <span>Sob demanda, feita no Brasil</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold">Atendimento:</span>
                  <span>WhatsApp +55 47 99610-3720</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto text-center">
          <h2
            className="font-black uppercase mb-6"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 5vw, 3.5rem)",
              color: "#CCFF00",
            }}
          >
            Conheça a loja
          </h2>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/loja">
              <a
                className="inline-flex items-center gap-2 bg-pink-shock text-white px-8 py-4 font-black tracking-wider hover:bg-white hover:text-black transition-all duration-200 uppercase border-2 border-pink-shock hover:border-white"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.1rem" }}
              >
                Ver loja
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
      </section>

      <Footer />
    </div>
  );
}
