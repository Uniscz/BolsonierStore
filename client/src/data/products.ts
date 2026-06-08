// Arquivo único de dados de produtos da Bolsonier Store
// Todas as páginas devem importar preço, nome, imagens, cores e tamanhos daqui.

export interface ProductColor {
  name: string;
  key: string;
  images: {
    frente: string;
    costas: string;
  };
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  collection: string;
  price: number;
  priceDisplay: string;
  category: string;
  description: string;
  details: string[];
  colors: ProductColor[];
  sizes: string[];
  featured: boolean;
}

export const products: Product[] = [
  {
    id: "camiseta-pix",
    slug: "camiseta-pix",
    name: "Camiseta O Pix é Nosso",
    collection: "O Pix é Nosso",
    price: 99.90,
    priceDisplay: "R$ 99,90",
    category: "camiseta",
    description:
      "A camiseta O Pix é Nosso nasceu do caos brasileiro, da internet e da vontade de transformar meme em uniforme. Uma peça urbana, forte e divertida, feita para quem entende a piada antes de todo mundo.",
    details: [
      "Modelo unissex",
      "Produção sob demanda",
      "Pré-venda limitada",
      "Prazo de produção e envio de até 25 dias úteis",
      "Pagamento via PIX",
      "Atendimento pelo WhatsApp",
      "Malha de qualidade, feita no Brasil",
    ],
    colors: [
      {
        name: "Preto",
        key: "preto",
        images: {
          frente: "/products/camiseta-pix/preto-frente.svg",
          costas: "/products/camiseta-pix/preto-costas.svg",
        },
      },
      {
        name: "Branco",
        key: "branco",
        images: {
          frente: "/products/camiseta-pix/branco-frente.svg",
          costas: "/products/camiseta-pix/branco-costas.svg",
        },
      },
      {
        name: "Azul Royal",
        key: "azul",
        images: {
          frente: "/products/camiseta-pix/azul-frente.svg",
          costas: "/products/camiseta-pix/azul-costas.svg",
        },
      },
      {
        name: "Verde Bandeira",
        key: "verde",
        images: {
          frente: "/products/camiseta-pix/verde-frente.svg",
          costas: "/products/camiseta-pix/verde-costas.svg",
        },
      },
      {
        name: "Amarelo Canário",
        key: "amarelo",
        images: {
          frente: "/products/camiseta-pix/amarelo-frente.svg",
          costas: "/products/camiseta-pix/amarelo-costas.svg",
        },
      },
    ],
    sizes: ["P", "M", "G", "GG", "XGG"],
    featured: true,
  },
];

// ─── Funções auxiliares ───────────────────────────────────────────────────────

export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 2,
  });
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((p) => p.featured);
}
