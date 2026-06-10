// Arquivo único de dados de produtos da Bolsonier Store
export interface ProductColor {
  name: string;
  key: string;
  hex: string;
  images: {
    frente: string;
    costas: string;
    detalhe: string;
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
    name: "Camiseta O Pix É Nosso",
    collection: "O Pix É Nosso",
    price: 119.90,
    priceDisplay: "R$ 119,90",
    category: "camiseta",
    description:
      "A camiseta O Pix É Nosso nasceu do caos brasileiro, da internet e da vontade de transformar meme em uniforme. Uma peça urbana, forte e divertida, feita para quem entende a piada antes de todo mundo.",
    details: [
      "Modelo unissex T-shirt",
      "Produção sob demanda",
      "Pré-venda limitada",
      "Prazo de produção e envio de até 20 dias úteis",
      "Pagamento via Pix ou cartão",
      "Malha de qualidade, feita no Brasil",
    ],
    colors: [
      {
        name: "Preto",
        key: "preto",
        hex: "#1a1a1a",
        images: {
          frente: "/mockup-preto-1.png",
          costas: "/mockup-preto-2.png",
          detalhe: "/mockup-preto-3.png",
        },
      },
      {
        name: "Branco",
        key: "branco",
        hex: "#f0f0f0",
        images: {
          frente: "/mockup-branco-1.png",
          costas: "/mockup-branco-2.png",
          detalhe: "/mockup-branco-3.png",
        },
      },
      {
        name: "Azul Royal",
        key: "azul",
        hex: "#1a3a8f",
        images: {
          frente: "/mockup-azul-1.png",
          costas: "/mockup-azul-2.png",
          detalhe: "/mockup-azul-3.png",
        },
      },
      {
        name: "Verde Bandeira",
        key: "verde",
        hex: "#006b3c",
        images: {
          frente: "/mockup-verde-1.png",
          costas: "/mockup-verde-2.png",
          detalhe: "/mockup-verde-3.png",
        },
      },
      {
        name: "Amarelo Canário",
        key: "amarelo",
        hex: "#f5d800",
        images: {
          frente: "/mockup-amarelo-1.png",
          costas: "/mockup-amarelo-2.png",
          detalhe: "/mockup-amarelo-3.png",
        },
      },
    ],
  sizes: ["P", "M", "G", "GG", "XGG"],
  featured: true,
  },
];

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
