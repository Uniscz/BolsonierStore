import { useState } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import { nanoid } from 'nanoid';

interface ColorOption {
  name: string;
  value: string;
  images: string[];
}

const COLORS: ColorOption[] = [
  {
    name: 'Preto',
    value: 'preto',
    images: [
      '/manus-storage/preto_0_5670725_22793c3e.png',
      '/manus-storage/preto_5_5670725_0522f42d.png',
    ],
  },
  {
    name: 'Branco',
    value: 'branco',
    images: [
      '/manus-storage/branco_1_5670725_87309e54.png',
      '/manus-storage/branco_6_5670725_c1dc48de.png',
    ],
  },
  {
    name: 'Azul Royal',
    value: 'azul',
    images: [
      '/manus-storage/azul-royal_3_5670725_71912610.png',
      '/manus-storage/azul-royal_8_5670725_ced5d006.png',
    ],
  },
  {
    name: 'Verde Bandeira',
    value: 'verde',
    images: [
      '/manus-storage/verde-bandeira_4_5670725_00d6ab28.png',
      '/manus-storage/verde-bandeira_9_5670725_dd47f19e.png',
    ],
  },
  {
    name: 'Amarelo Canário',
    value: 'amarelo',
    images: [
      '/manus-storage/amarelo-canario_2_5670725_66996668.png',
      '/manus-storage/amarelo-canario_7_5670725_a01c69c9.png',
    ],
  },
];

const SIZES = ['P', 'M', 'G', 'GG', 'XGG'];

const SIZE_MEASUREMENTS = {
  P: { largura: '46-50', comprimento: '65-69' },
  M: { largura: '48-52', comprimento: '67-71' },
  G: { largura: '53-57', comprimento: '69-73' },
  GG: { largura: '56-60', comprimento: '72-76' },
  XGG: { largura: '59-63', comprimento: '73-77' },
};

export default function CamisetaPix() {
  const [selectedColor, setSelectedColor] = useState('preto');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showMeasureModal, setShowMeasureModal] = useState(false);

  const currentColor = COLORS.find((c) => c.value === selectedColor)!;
  const currentImage = currentColor.images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % currentColor.images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? currentColor.images.length - 1 : prev - 1
    );
  };

  const { addItem } = useCart();
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [showFreightModal, setShowFreightModal] = useState(false);

  const handleAddToCart = () => {
    const item = {
      id: nanoid(),
      name: 'Camiseta O Pix é Nosso',
      color: currentColor.name,
      size: selectedSize,
      quantity,
      price: 99.9,
    };
    addItem(item);
    setShowCartNotification(true);
    setTimeout(() => setShowCartNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      <div className="flex-1 py-12 px-4">
        <div className="container max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="mb-8 text-sm text-gray-600">
            <Link href="/loja">
              <a className="hover:text-black transition-colors">Loja</a>
            </Link>
            <span className="mx-2">/</span>
            <Link href="/colecao-pix">
              <a className="hover:text-black transition-colors">O Pix é Nosso</a>
            </Link>
            <span className="mx-2">/</span>
            <span className="text-black font-semibold">Camiseta O Pix é Nosso</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Galeria de Imagens */}
            <div>
              <div className="relative bg-gray-100 aspect-square mb-4 overflow-hidden border-2 border-black">
                <img
                  src={currentImage}
                  alt={`Camiseta ${currentColor.name}`}
                  className="w-full h-full object-cover"
                />

                {/* Navegação de Imagens */}
                {currentColor.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 hover:bg-pink-shock transition-colors"
                    >
                      <ChevronLeft size={24} />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black text-white p-2 hover:bg-pink-shock transition-colors"
                    >
                      <ChevronRight size={24} />
                    </button>
                  </>
                )}

                {/* Indicador de Imagem */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-3 py-1 text-xs font-bold">
                  {currentImageIndex + 1} / {currentColor.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2">
                {currentColor.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`w-20 h-20 border-2 overflow-hidden transition-all ${
                      idx === currentImageIndex
                        ? 'border-pink-shock'
                        : 'border-gray-300 hover:border-gray-600'
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Informações do Produto */}
            <div>
              <h1 className="display-text mb-2">Camiseta O Pix é Nosso</h1>
              <p className="text-2xl font-bold text-pink-shock mb-6 uppercase tracking-wider">R$ 99,90</p>

              {/* Descrição */}
              <div className="mb-8 space-y-4 text-gray-700 leading-relaxed">
                <p>
                  A camiseta O Pix é Nosso nasceu do caos brasileiro, da internet e da vontade de transformar meme em uniforme.
                </p>
                <p>
                  Uma peça urbana, forte e divertida, feita para quem entende a piada antes de todo mundo. A estampa colorida traz energia de rua, humor nacional e aquele deboche brasileiro que não pede licença para existir.
                </p>
                <p>
                  Modelo unissex, disponível nas cores preto, azul, verde e amarelo.
                </p>
                <p>
                  Ideal para usar no rolê, no vídeo, no protesto imaginário, no churrasco ou em qualquer lugar onde o Brasil resolva virar entretenimento ao vivo.
                </p>
              </div>

              {/* Seletor de Cores */}
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-wider mb-4 text-sm">Cor: {currentColor.name}</h3>
                <div className="flex gap-3 flex-wrap">
                  {COLORS.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        setSelectedColor(color.value);
                        setCurrentImageIndex(0);
                      }}
                      className={`px-4 py-2 border-2 font-bold uppercase text-sm tracking-wider transition-all ${
                        selectedColor === color.value
                          ? 'border-pink-shock bg-pink-shock text-white'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {color.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seletor de Tamanhos */}
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-wider mb-4 text-sm">Tamanho: {selectedSize}</h3>
                <div className="flex gap-2 flex-wrap mb-4">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 border-2 font-bold uppercase text-sm transition-all ${
                        selectedSize === size
                          ? 'border-lime-acid bg-lime-acid text-black'
                          : 'border-black text-black hover:bg-black hover:text-white'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setShowMeasureModal(true)}
                  className="text-sm text-pink-shock font-bold hover:underline"
                >
                  Ver Tabela de Medidas
                </button>
              </div>

              {/* Quantidade */}
              <div className="mb-8">
                <h3 className="font-bold uppercase tracking-wider mb-4 text-sm">Quantidade</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border-2 border-black font-bold hover:bg-black hover:text-white transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="space-y-4">
                <button
                  onClick={handleAddToCart}
                  className="w-full bg-pink-shock text-white px-8 py-4 font-bold tracking-wider hover:bg-black transition-colors uppercase text-lg"
                >
                  Adicionar ao Carrinho
                </button>
                <button
                  onClick={() => setShowFreightModal(true)}
                  className="w-full bg-lime-acid text-black px-8 py-4 font-bold tracking-wider hover:bg-black hover:text-white transition-colors uppercase text-lg"
                >
                  Calcular Frete
                </button>
                <button className="w-full border-2 border-black text-black px-8 py-4 font-bold tracking-wider hover:bg-black hover:text-white transition-colors uppercase text-lg">
                  Compartilhar
                </button>
              </div>

              {/* Info PIX */}
              <div className="mt-8 p-4 bg-black text-white border-2 border-lime-acid">
                <p className="font-bold uppercase tracking-wider mb-2">Pagamento Exclusivo via PIX</p>
                <p className="text-sm">
                  Escolha sua cor, tamanho e quantidade. Após confirmar, você receberá a chave PIX para pagamento instantâneo. Produção sob demanda - até 25 dias.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Tabela de Medidas */}
      {showMeasureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto border-4 border-black">
            <div className="flex justify-between items-center p-6 border-b-2 border-black sticky top-0 bg-white">
              <h2 className="display-text text-2xl">Tabela de Medidas</h2>
              <button
                onClick={() => setShowMeasureModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-gray-600 mb-6 font-semibold">Quality Unissex</p>

              {/* Tabela */}
              <div className="overflow-x-auto mb-6">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-black text-white">
                      <th className="border-2 border-black p-3 text-left font-bold">Medida</th>
                      <th className="border-2 border-black p-3 text-center font-bold">P</th>
                      <th className="border-2 border-black p-3 text-center font-bold">M</th>
                      <th className="border-2 border-black p-3 text-center font-bold">G</th>
                      <th className="border-2 border-black p-3 text-center font-bold">GG</th>
                      <th className="border-2 border-black p-3 text-center font-bold">XGG</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border-2 border-black p-3 font-bold">Largura (cm)</td>
                      <td className="border-2 border-black p-3 text-center">46-50</td>
                      <td className="border-2 border-black p-3 text-center">48-52</td>
                      <td className="border-2 border-black p-3 text-center">53-57</td>
                      <td className="border-2 border-black p-3 text-center">56-60</td>
                      <td className="border-2 border-black p-3 text-center">59-63</td>
                    </tr>
                    <tr className="bg-gray-50">
                      <td className="border-2 border-black p-3 font-bold">Comprimento (cm)</td>
                      <td className="border-2 border-black p-3 text-center">65-69</td>
                      <td className="border-2 border-black p-3 text-center">67-71</td>
                      <td className="border-2 border-black p-3 text-center">69-73</td>
                      <td className="border-2 border-black p-3 text-center">72-76</td>
                      <td className="border-2 border-black p-3 text-center">73-77</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Nota */}
              <div className="bg-gray-100 p-4 border-2 border-black">
                <p className="text-xs text-gray-700 font-semibold">
                  <strong>Percentual de encolhimento pós lavagem:</strong><br />
                  Comprimento +/7% Largura 3/5%
                </p>
              </div>

              {/* Diagrama */}
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-300 text-center">
                <p className="text-sm text-gray-600 font-semibold mb-2">
                  As medidas são tiradas na peça aberta (deitada), de forma reta.
                </p>
                <p className="text-xs text-gray-500">
                  Ribana: 1,4 cm | Bainha: 2 cm
                </p>
              </div>

              <button
                onClick={() => setShowMeasureModal(false)}
                className="w-full mt-6 bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-pink-shock transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notificação de Item Adicionado */}
      {showCartNotification && (
        <div className="fixed bottom-8 right-8 bg-lime-acid text-black px-6 py-4 font-bold uppercase tracking-wider border-2 border-black shadow-lg z-40">
          ✓ Adicionado ao carrinho!
        </div>
      )}

      {/* Modal de Cálculo de Frete */}
      {showFreightModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-auto border-4 border-black">
            <div className="flex justify-between items-center p-6 border-b-2 border-black sticky top-0 bg-white">
              <h2 className="display-text text-2xl">Calcular Frete</h2>
              <button
                onClick={() => setShowFreightModal(false)}
                className="p-2 hover:bg-gray-100 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6 font-semibold">Informe seu CEP para calcular o frete</p>

              <div className="mb-6">
                <label className="block font-bold uppercase tracking-wider mb-2 text-sm">CEP</label>
                <input
                  type="text"
                  placeholder="00000-000"
                  className="w-full border-2 border-black p-3 font-bold uppercase tracking-wider"
                />
              </div>

              <div className="bg-gray-100 p-4 border-2 border-black mb-6">
                <p className="text-sm text-gray-700 font-semibold mb-4">
                  <strong>Opções de Frete:</strong>
                </p>
                <div className="space-y-3">
                  <div className="flex items-center p-3 border-2 border-black bg-white hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="frete" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">PAC (5-8 dias úteis)</p>
                      <p className="text-xs text-gray-600">Valor será calculado</p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 border-2 border-black bg-white hover:bg-gray-50 cursor-pointer">
                    <input type="radio" name="frete" className="mr-3" />
                    <div className="flex-1">
                      <p className="font-bold text-sm">SEDEX (2-3 dias úteis)</p>
                      <p className="text-xs text-gray-600">Valor será calculado</p>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                O cálculo de frete será realizado após confirmação do CEP. Você receberá um link de pagamento via PIX.
              </p>

              <button
                onClick={() => setShowFreightModal(false)}
                className="w-full bg-black text-white px-6 py-3 font-bold uppercase tracking-wider hover:bg-pink-shock transition-colors"
              >
                Calcular
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
