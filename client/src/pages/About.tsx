import { Link } from "wouter";
import { ArrowRight, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/data/products";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

const product = getProductBySlug("camiseta-pix")!;

export default function About() {
  const whatsappHelp = buildWhatsAppHelpMessage();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section className="about-hero-section">
        <div className="container-shell about-hero-grid">
          <div>
            <p className="kicker-green">Brazilian roots · Global attitude</p>
            <h1>
              SOBRE<br />
              <span>BOLSONIER</span>
            </h1>
            <p>
              A BOLSONIER STORE é uma boutique streetwear autoral que mistura humor brasileiro, estética de rua e acabamento editorial.
              Não é souvenir. Não é uniforme. É uma assinatura para quem entende o jogo e decide criar o próprio.
            </p>
          </div>
          <div className="about-logo-card">
            <img src={product.brandLogoImage} alt="Bolsonier Store Boutique Streetwear" />
          </div>
        </div>
      </section>

      <section className="about-story-section">
        <div className="container-shell about-story-grid">
          <div className="about-monogram-card">
            <img src={product.monogramImage} alt="Monograma B Bolsonier Store" />
          </div>

          <div className="about-story-copy">
            <p className="kicker-pink">Brand identity</p>
            <h2>
              LUXO,<br />
              RUA E<br />
              <span>AUTENTICIDADE</span>
            </h2>
            <p>
              A marca nasce da colisão entre a linguagem da internet, a ironia cotidiana e a vontade de vestir uma ideia com presença.
              O primeiro drop, <strong>O Pix É Nosso</strong>, transforma uma frase popular em objeto de desejo: gráfico direto, camiseta oversized e narrativa de campanha.
            </p>
            <p>
              A estética combina tipografia condensada, preto absoluto, acentos em hot pink e acid green, carimbos, pichação e composição editorial.
              É streetwear brasileiro com leitura global: visual limpo quando precisa ser premium, sujo quando precisa ter rua.
            </p>
          </div>
        </div>
      </section>

      <section className="about-principles-section">
        <div className="container-shell">
          <div className="about-principles-head">
            <p className="kicker-green">Operação do drop</p>
            <h2>COMO FUNCIONA</h2>
          </div>

          <div className="about-principles-grid">
            {[
              ["01", "Produção sob demanda", "Cada peça é produzida após confirmação do pedido para preservar qualidade, controle e responsabilidade."],
              ["02", "Pré-venda limitada", "O Lote 01 apresenta a camiseta O Pix É Nosso em cinco cores, com reposições conforme demanda real."],
              ["03", "Pagamento via PIX", "A compra é conduzida com pagamento via PIX e atendimento final pelo WhatsApp."],
              ["04", "Prazo transparente", "O prazo de produção e envio é de até 25 dias úteis após a confirmação do pagamento."],
            ].map(([number, title, text]) => (
              <article key={number}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="about-cta-section">
        <div className="container-shell about-cta-box">
          <p className="kicker-pink">Drop 01 disponível</p>
          <h2>
            O PIX É NOSSO.<br />
            <span>AGORA É SEU.</span>
          </h2>
          <div className="about-cta-actions">
            <Link href="/loja" className="btn-primary">
              Ver loja
              <ArrowRight size={18} />
            </Link>
            <a href={whatsappHelp} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MessageCircle size={18} />
              WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
