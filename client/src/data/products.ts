export interface ProductColor {
  name: string;
  key: string;
  hex: string;
  images: {
    frente: string;
    costas: string;
    detalhe: string;
  };
  mockups: string[];
}

export interface ProductImages {
  hero: string;
  wide: string;
  stamp: string;
  logo: string;
  logoCompact: string;
  monogram: string;
  lookbook: string[];
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
  campaignImages: string[];
  lookbookImages: string[];
  mockupAngles: string[];
  heroImage: string;
  wideCampaignImage: string;
  stampImage: string;
  brandLogoImage: string;
  brandLogoCompactImage: string;
  monogramImage: string;
  images: ProductImages;
}

const lookbookImages = [
  "/media/drop-pix/lookbook-01.png",
  "/media/drop-pix/lookbook-02.png",
  "/media/drop-pix/lookbook-03.png",
  "/media/drop-pix/lookbook-04.png",
  "/media/drop-pix/lookbook-05.png",
  "/media/drop-pix/lookbook-06.png",
  "/media/drop-pix/lookbook-07.png",
  "/media/drop-pix/lookbook-08.png",
];

const campaignImages = [
  "/media/drop-pix/hero-campaign.png",
  "/media/drop-pix/campaign-wide.png",
  "/model-composition.png",
];

export const products: Product[] = [
  {
    id: "camiseta-pix",
    slug: "camiseta-pix",
    name: "Camiseta Oversized",
    collection: "O Pix É Nosso",
    price: 99.9,
    priceDisplay: "R$ 99,90",
    category: "camiseta",
    description:
      "A camiseta O Pix É Nosso nasceu do caos brasileiro, da internet e da vontade de transformar meme em uniforme. Uma peça oversized, urbana e direta, feita para quem entende a piada antes de todo mundo.",
    details: [
      "Modelo unissex oversized",
      "Coleção O Pix É Nosso · Drop 01",
      "Pré-venda limitada · Lote 01",
      "Produção sob demanda",
      "Prazo de produção e envio de até 25 dias úteis após confirmação",
      "Pagamento via PIX",
      "Atendimento pelo WhatsApp",
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
        mockups: ["/mockup-preto-1.png", "/mockup-preto-2.png", "/mockup-preto-3.png"],
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
        mockups: ["/mockup-branco-1.png", "/mockup-branco-2.png", "/mockup-branco-3.png"],
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
        mockups: ["/mockup-azul-1.png", "/mockup-azul-2.png", "/mockup-azul-3.png"],
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
        mockups: ["/mockup-verde-1.png", "/mockup-verde-2.png", "/mockup-verde-3.png"],
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
        mockups: ["/mockup-amarelo-1.png", "/mockup-amarelo-2.png", "/mockup-amarelo-3.png"],
      },
    ],
    sizes: ["P", "M", "G", "GG", "XGG"],
    featured: true,
    campaignImages,
    lookbookImages,
    mockupAngles: ["Frente", "Costas", "Detalhe"],
    heroImage: "/media/drop-pix/hero-campaign.png",
    wideCampaignImage: "/media/drop-pix/campaign-wide.png",
    stampImage: "/brand/pix-stamp.png",
    brandLogoImage: "/brand/bolsonier-logo-wide.png",
    brandLogoCompactImage: "/brand/bolsonier-logo-compact.png",
    monogramImage: "/brand/bolsonier-monogram-b.png",
    images: {
      hero: "/media/drop-pix/hero-campaign.png",
      wide: "/media/drop-pix/campaign-wide.png",
      stamp: "/brand/pix-stamp.png",
      logo: "/brand/bolsonier-logo-wide.png",
      logoCompact: "/brand/bolsonier-logo-compact.png",
      monogram: "/brand/bolsonier-monogram-b.png",
      lookbook: lookbookImages,
    },
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
