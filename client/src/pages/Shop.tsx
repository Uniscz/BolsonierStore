import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductImage from "@/components/ProductImage";
import { formatPrice, getProductBySlug } from "@/data/products";

const product = getProductBySlug("camiseta-pix");

const editorialCoverByColor: Partial<Record<NonNullable<typeof product>["colors"][0]["key"], string>> = {
  preto: "/lifestyle/pix-preto-modelo-rua.png",
  branco: "/lifestyle/pix-branco-modelo-rua-1.png",
  azul: "/lifestyle/pix-azul-modelo-rua.png",
  verde: "/lifestyle/pix-verde-modelo-rua.png",
  amarelo: "/lifestyle/pix-amarelo-modelo-rua.png",
};

function getColorCoverImage(color: NonNullable<typeof product>["colors"][0]) {
  return editorialCoverByColor[color.key] ?? color.images.detalhe;
}

function hasEditorialCover(color: NonNullable<typeof product>["colors"][0]) {
  return Boolean(editorialCoverByColor[color.key]);
}

function ProductColorCard({ color }: { color: NonNullable<typeof product>["colors"][0] }) {
  const coverImage = getColorCoverImage(color);
  const isEditorialCover = hasEditorialCover(color);

  return (
    <Link href={`/produto/camiseta-pix?cor=${color.key}`}>
      <a
        style={{
          background: "#0a0a0a",
          border: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          textDecoration: "none",
          color: "inherit",
          transition: "transform 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(event) => {
          event.currentTarget.style.transform = "translateY(-4px)";
          event.currentTarget.style.borderColor = "rgba(255, 0, 102, 0.7)";
        }}
        onMouseLeave={(event) => {
          event.currentTarget.style.transform = "translateY(0)";
          event.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
        }}
        aria-label={`Abrir produto Camiseta O Pix É Nosso diretamente na cor ${color.name}`}
      >
        <div style={{ position: "relative", aspectRatio: "4/5", overflow: "hidden", background: "#111", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <ProductImage
            src={coverImage}
            alt={`Camiseta O Pix É Nosso — ${color.name} — ${isEditorialCover ? "look editorial" : "mockup da peça"}`}
            className={`w-full h-full transition-transform duration-300 ${isEditorialCover ? "object-cover" : "object-contain"}`}
            fallbackClassName="w-full h-full"
            style={isEditorialCover ? { padding: 0 } : { padding: "1.15rem" }}
          />
          <div
            style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: "#FF0066",
              color: "#fff",
              fontSize: "0.55rem",
              letterSpacing: "0.16em",
              fontWeight: 800,
              padding: "0.35rem 0.5rem",
              textTransform: "uppercase",
            }}
          >
            {isEditorialCover ? "Look real" : "Ver produto"}
          </div>
        </div>

        <div style={{ padding: "1.25rem", flex: 1, display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div
              style={{
                width: "18px",
                height: "18px",
                borderRadius: "50%",
                background: color.hex,
                border: "1px solid rgba(255,255,255,0.25)",
                flexShrink: 0,
              }}
            />
            <div>
              <div
                style={{
                  fontSize: "0.55rem",
                  letterSpacing: "0.25em",
                  color: "#FF0066",
                  textTransform: "uppercase",
                  marginBottom: "0.15rem",
                }}
              >
                T-Shirt
              </div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "1.1rem",
                  color: "#fff",
                  letterSpacing: "0.05em",
                }}
              >
                {color.name}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "1rem",
              marginTop: "auto",
            }}
          >
            <span
              style={{
                fontSize: "0.6rem",
                letterSpacing: "0.18em",
                color: "rgba(255,255,255,0.45)",
                textTransform: "uppercase",
              }}
            >
              Escolha tamanho na página
            </span>
            <span
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "1.1rem",
                color: "#A6FF00",
                whiteSpace: "nowrap",
              }}
            >
              {product ? formatPrice(product.price) : ""}
            </span>
          </div>
        </div>
      </a>
    </Link>
  );
}

export default function Shop() {
  if (!product) {
    return (
      <div style={{ background: "#000", minHeight: "100vh" }}>
        <Header />
        <section className="container-shell" style={{ padding: "6rem 0", color: "#fff" }}>
          <h1 className="font-black uppercase text-4xl mb-4">Produto não encontrado</h1>
          <p style={{ color: "rgba(255,255,255,0.55)" }}>Nenhum produto ativo foi encontrado para exibição.</p>
        </section>
        <Footer />
      </div>
    );
  }

  return (
    <div style={{ background: "#000", minHeight: "100vh" }}>
      <Header />

      <section
        style={{
          background: "#000",
          paddingTop: "clamp(3rem, 7vw, 6rem)",
          paddingBottom: "clamp(2rem, 4vw, 3rem)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div className="kicker-pink" style={{ marginBottom: "1rem" }}>
            Pré-venda · Produção sob demanda
          </div>
          <h1
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(3rem, 10vw, 8rem)",
              lineHeight: 0.88,
              color: "#fff",
              marginBottom: "1rem",
            }}
          >
            LOJA
          </h1>
          <p style={{ fontSize: "0.85rem", color: "rgba(255,255,255,0.45)", maxWidth: "560px", lineHeight: 1.7 }}>
            Escolha a cor da camiseta para abrir a página do produto. Lá você vê as fotos, seleciona tamanho, quantidade e finaliza o pedido.
          </p>
        </div>
      </section>

      <div style={{ background: "#A6FF00", overflow: "hidden", padding: "0.6rem 0" }}>
        <div className="ticker-track">
          {Array(3).fill(null).map((_, i) => (
            <span key={i} className="ticker-content" style={{ color: "#000", fontSize: "0.7rem" }}>
              PRODUÇÃO SOB DEMANDA &nbsp;·&nbsp; PIX OU CARTÃO &nbsp;·&nbsp; FEITO NO BRASIL &nbsp;·&nbsp; 5 CORES DISPONÍVEIS &nbsp;·&nbsp; TAMANHOS P AO XGG &nbsp;·&nbsp;
            </span>
          ))}
        </div>
      </div>

      <section style={{ background: "#000", padding: "clamp(3rem, 6vw, 5rem) 0" }}>
        <div className="container-shell">
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              marginBottom: "2rem",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <div className="kicker-green" style={{ marginBottom: "0.5rem" }}>Coleção O Pix É Nosso</div>
              <h2
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: "clamp(2rem, 5vw, 4rem)",
                  lineHeight: 0.92,
                  color: "#fff",
                }}
              >
                CAMISETA T-SHIRT
              </h2>
            </div>
            <div
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: "0.65rem",
                letterSpacing: "0.2em",
                color: "#A6FF00",
                border: "1px solid #A6FF00",
                padding: "0.3rem 0.75rem",
              }}
            >
              5 CORES · EST. 24
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gap: "2px",
            }}
            className="grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
          >
            {product.colors.map((color) => (
              <ProductColorCard key={color.key} color={color} />
            ))}
          </div>
        </div>
      </section>

      <section
        style={{
          background: "#0a0a0a",
          padding: "clamp(3rem, 6vw, 5rem) 0",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div style={{ display: "grid", gap: "3rem" }} className="grid-cols-1 md:grid-cols-3">
            {[
              {
                title: "Escolha a cor",
                text: "Clique na camiseta para abrir a página completa do produto.",
              },
              {
                title: "Defina tamanho e quantidade",
                text: "A seleção de tamanho acontece dentro da página do produto, com fotos e detalhes.",
              },
              {
                title: "PAGUE COM SEGURANÇA",
                text: "Finalize pelo checkout da loja. Pix e cartão disponíveis na tela segura.",
              },
            ].map((item, i) => (
              <div key={i}>
                <div
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "1.1rem",
                    color: "#fff",
                    letterSpacing: "0.05em",
                    marginBottom: "0.5rem",
                  }}
                >
                  {item.title}
                </div>
                <p style={{ fontSize: "0.8rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.7 }}>{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
