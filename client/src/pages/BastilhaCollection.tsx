import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getProductBySlug } from "@/data/products";

const product = getProductBySlug("camiseta-pix")!;

export default function BastilhaCollection() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <section className="legacy-drop-section">
        <div className="container-shell legacy-drop-grid">
          <div>
            <p className="kicker-pink">Drop ativo</p>
            <h1>
              O PIX<br />
              É NOSSO
            </h1>
            <p>
              A vitrine atual da BOLSONIER STORE está concentrada no primeiro drop da marca. Para uma experiência sem rotas quebradas, esta página direciona você à loja oficial.
            </p>
            <div className="legacy-drop-actions">
              <Link href="/loja" className="btn-primary">
                Ver loja
              </Link>
              <Link href={`/produto/${product.slug}`} className="btn-secondary">
                Ver produto
              </Link>
            </div>
          </div>
          <img src={product.stampImage} alt="Selo O Pix É Nosso" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
