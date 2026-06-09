import { Link } from "wouter";
import ProductImage from "@/components/ProductImage";
import { formatPrice, getProductBySlug } from "@/data/products";

const product = getProductBySlug("camiseta-pix")!;

const TICKERS = {
  green: [
    "BOLSONIER STORE",
    "O PIX É NOSSO",
    "DROP 01",
    "FEITO NO BRASIL",
    "IRONIA ELEGANTE",
    "VANDALISMO REFINADO",
    "NO PERMISSION NEEDED",
    "BRASIL / INTERNET",
  ],
  pink: [
    "ENTRAR NO DROP",
    "PRÉ-VENDA",
    "R$ 99,90",
    "5 CORES",
    "PRODUÇÃO SOB DEMANDA",
    "ATÉ 25 DIAS ÚTEIS",
    "WHATSAPP",
    "PIX",
  ],
};

function Ticker({ color }: { color: "green" | "pink" }) {
  const items = [...TICKERS[color], ...TICKERS[color], ...TICKERS[color]];
  return (
    <div className={`ticker ticker-${color}`}>
      <div className="ticker-track">
        {items.map((item, i) => (
          <span key={`${item}-${i}`} className="ticker-item">
            ★ {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main style={{ background: "#000", minHeight: "100vh" }}>
      <section className="drop-hero">
        <div className="container-shell drop-hero-grid">
          <div className="drop-hero-copy">
            <p className="kicker-green">Bolsonier Studios apresenta</p>
            <div className="drop-hero-badges">
              <span className="badge-pink">DROP 01</span>
              <span className="badge-green">PRÉ-VENDA</span>
              <span className="badge-pink">LOTE 01</span>
            </div>
            <h1 className="drop-hero-title">
              O PIX<br />
              <span>É NOSSO</span>
            </h1>
            <p className="drop-hero-text">
              O meme saiu do feed.<br />
              Agora veste gente.
            </p>
            <div className="drop-hero-meta">
              <strong>{formatPrice(product.price)}</strong>
              <span>Produção sob demanda</span>
              <span>Até 25 dias úteis após confirmação</span>
            </div>
            <div className="drop-hero-actions">
              <Link href="/loja" className="btn-primary">
                Entrar no Drop
              </Link>
              <a href="#lookbook" className="btn-secondary">
                Ver Lookbook
              </a>
            </div>
          </div>

          <div className="drop-hero-visual">
            <ProductImage
              src={product.heroImage}
              alt="Campanha Drop 01 O Pix É Nosso"
              className="drop-hero-img"
              fallbackClassName="drop-hero-fallback"
            />
            <img src={product.stampImage} alt="Selo O Pix É Nosso" className="drop-stamp drop-stamp-hero" />
          </div>
        </div>
      </section>

      <Ticker color="green" />

      <section className="campaign-wide-section">
        <ProductImage
          src={product.wideCampaignImage}
          alt="Banner de campanha O Pix É Nosso com cinco cores"
          className="campaign-wide-img"
          fallbackClassName="campaign-wide-fallback"
        />
        <div className="campaign-wide-overlay">
          <p className="kicker-green">DROP 01 · PRÉ-VENDA</p>
          <h2>
            O PIX É NOSSO,<br />
            <span>MY FRIEND</span>
          </h2>
          <div className="campaign-wide-tags">
            <span>5 cores</span>
            <span>{formatPrice(product.price)}</span>
            <span>Produção sob demanda</span>
          </div>
        </div>
      </section>

      <Ticker color="pink" />

      <section className="brand-signature-section">
        <div className="brand-logo-panel">
          <img src={product.brandLogoImage} alt="Bolsonier Store Boutique Streetwear" />
        </div>
        <div className="brand-copy-panel">
          <p className="kicker-green">Assinatura premium da marca</p>
          <h2>
            Boutique<br />
            <span>Streetwear</span>
          </h2>
          <p>
            Um drop editorial com humor brasileiro, acabamento visual de campanha e a energia de quem transforma meme em objeto de desejo.
          </p>
          <Link href="/sobre" className="btn-secondary">
            Nossa História
          </Link>
        </div>
      </section>

      <section id="lookbook" className="lookbook-section">
        <div className="container-shell lookbook-header">
          <p className="kicker-pink">Looks editoriais</p>
          <h2>
            LOOKBOOK<br />
            <span>O PIX É NOSSO</span>
          </h2>
          <p>
            Scroll horizontal, imagens grandes e leitura de campanha. Sem vitrine genérica: o drop aparece como editorial de rua.
          </p>
        </div>
        <div className="lookbook-rail" aria-label="Lookbook O Pix É Nosso">
          {product.lookbookImages.map((src, index) => (
            <article className="lookbook-card" key={src}>
              <ProductImage
                src={src}
                alt={`Look editorial ${index + 1} do drop O Pix É Nosso`}
                className="lookbook-img"
                fallbackClassName="lookbook-fallback"
              />
              <span>{String(index + 1).padStart(2, "0")}</span>
            </article>
          ))}
        </div>
      </section>

      <section className="manifesto-section">
        <div className="manifesto-monogram">
          <img src={product.monogramImage} alt="Monograma B com coroa Bolsonier Store" />
        </div>
        <div className="manifesto-copy">
          <span className="kicker-green">Manifesto</span>
          <h2>
            FAZ PARTE<br />
            DE QUEM<br />
            <span>CONSTRÓI</span>
          </h2>
          <p>
            A BOLSONIER STORE nasceu da internet brasileira, do deboche e da vontade de transformar caos em estética.
            O primeiro drop é um recibo visual do Brasil: ironia elegante, rua e design na mesma peça.
          </p>
          <Link href="/sobre" className="btn-secondary">
            Nossa História
          </Link>
        </div>
      </section>

      <Ticker color="green" />

      <section className="shop-preview-section">
        <div className="container-shell shop-preview-grid">
          <div>
            <p className="kicker-pink">Camiseta Oversized</p>
            <h2>
              5 CORES.<br />
              <span>UMA FRASE.</span>
            </h2>
            <p>
              Preto, branco, azul, verde e amarelo em pré-venda. Escolha a cor, selecione o tamanho e entre no drop sem clique morto.
            </p>
          </div>
          <div className="shop-preview-actions">
            <Link href="/loja" className="btn-green">
              Comprar Agora
            </Link>
            <a href="https://instagram.com/euinelegivel" target="_blank" rel="noopener noreferrer" className="btn-secondary">
              Instagram
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
