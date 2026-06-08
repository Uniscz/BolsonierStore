import { useState } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { ArrowLeft, Zap } from 'lucide-react';
import { Link } from 'wouter';

const PRODUCTS = [
  { id: 1, name: 'Camiseta O Pix é Nosso', price: 89.90, category: 'camiseta', collection: 'O Pix é Nosso', description: 'Camiseta autoral com design exclusivo da coleção O Pix é Nosso. Produção sob demanda em edição limitada.' },
  { id: 2, name: 'Camiseta Urbana', price: 89.90, category: 'camiseta', collection: 'O Pix é Nosso', description: 'Design urbano com tipografia ousada. Cada peça é uma declaração de estilo.' },
  { id: 3, name: 'Cropped Grafite', price: 79.90, category: 'cropped', collection: 'O Pix é Nosso', description: 'Cropped autoral com elementos de pichação. Conforto e atitude em uma peça.' },
  { id: 4, name: 'Body Autoral', price: 99.90, category: 'body', collection: 'O Pix é Nosso', description: 'Body exclusivo com design marcante. Perfeito para quem quer se destacar.' },
  { id: 5, name: 'Camiseta Preta', price: 89.90, category: 'camiseta', collection: 'Classicos', description: 'Clássico que nunca sai de moda. Qualidade premium e conforto garantido.' },
  { id: 6, name: 'Camiseta Branca', price: 89.90, category: 'camiseta', collection: 'Classicos', description: 'Branca pura com acabamento impecável. Versátil para qualquer estilo.' },
  { id: 7, name: 'Cropped Rosa', price: 79.90, category: 'cropped', collection: 'O Pix é Nosso', description: 'Rosa choque com design autoral. Ousadia e feminilidade em uma peça.' },
  { id: 8, name: 'Body Verde', price: 99.90, category: 'body', collection: 'Classicos', description: 'Verde ácido com design minimalista. Conforto e estilo combinados.' },
];

const SIZES = ['P', 'M', 'G', 'GG', 'XG'];

export default function ProductDetail() {
  const [match, params] = useRoute('/produto/:id');
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeTable, setShowSizeTable] = useState(false);
  const [quantity, setQuantity] = useState(1);

  if (!match) return null;

  const product = PRODUCTS.find(p => p.id === parseInt(params?.id || '0'));

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="display-text mb-4">Produto não encontrado</h1>
            <Link href="/loja">
              <a className="bg-pink-shock text-white px-6 py-3 font-bold tracking-wider hover:bg-black transition-colors uppercase">
                Voltar para Loja
              </a>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Breadcrumb */}
      <section className="py-4 px-4 bg-gray-50 border-b border-gray-200">
        <div className="container max-w-7xl mx-auto">
          <Link href="/loja">
            <a className="flex items-center gap-2 text-sm font-bold uppercase hover:text-pink-shock transition-colors">
              <ArrowLeft size={16} />
              Voltar para Loja
            </a>
          </Link>
        </div>
      </section>

      {/* Product Detail */}
      <section className="py-12 px-4 bg-white flex-1">
        <div className="container max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="w-full h-96 bg-gradient-to-br from-pink-shock to-lime-acid flex items-center justify-center border-2 border-black">
                <div className="text-center text-white">
                  <p className="font-bold text-lg uppercase tracking-wider">FRENTE DA PEÇA</p>
                  <p className="text-sm mt-2">{product.name}</p>
                </div>
              </div>

              {/* Thumbnail Images */}
              <div className="grid grid-cols-3 gap-4">
                <div className="h-24 bg-gradient-to-br from-lime-acid to-pink-shock flex items-center justify-center border-2 border-black cursor-pointer hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-white uppercase text-center">Costas</p>
                </div>
                <div className="h-24 bg-gradient-to-br from-pink-shock via-black to-lime-acid flex items-center justify-center border-2 border-black cursor-pointer hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-white uppercase text-center">No Modelo</p>
                </div>
                <div className="h-24 bg-gradient-to-br from-black to-pink-shock flex items-center justify-center border-2 border-black cursor-pointer hover:shadow-lg transition-shadow">
                  <p className="text-xs font-bold text-white uppercase text-center">Detalhe</p>
                </div>
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-between">
              <div>
                {/* Collection Badge */}
                <div className="inline-block mb-4">
                  <span className="bg-lime-acid text-black px-3 py-1 font-bold text-xs uppercase tracking-wider">
                    {product.collection}
                  </span>
                </div>

                {/* Title and Price */}
                <h1 className="display-text mb-2">{product.name}</h1>
                <p className="text-3xl font-bold mb-6">R$ {product.price.toFixed(2)}</p>

                {/* Description */}
                <p className="text-gray-600 mb-8 leading-relaxed">
                  {product.description}
                </p>

                {/* Size Selection */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <label className="font-bold uppercase tracking-wider text-sm">Tamanho</label>
                    <button
                      onClick={() => setShowSizeTable(true)}
                      className="text-xs font-bold text-pink-shock hover:text-black transition-colors uppercase underline"
                    >
                      Ver Tabela de Medidas
                    </button>
                  </div>

                  <div className="grid grid-cols-5 gap-3">
                    {SIZES.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`py-3 font-bold uppercase tracking-wider border-2 transition-all duration-200 ${
                          selectedSize === size
                            ? 'bg-pink-shock text-white border-pink-shock'
                            : 'border-black text-black hover:bg-lime-acid'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div className="mb-8">
                  <label className="font-bold uppercase tracking-wider text-sm block mb-4">Quantidade</label>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-12 h-12 border-2 border-black font-bold text-lg hover:bg-black hover:text-white transition-colors"
                    >
                      −
                    </button>
                    <span className="text-2xl font-bold w-12 text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-12 h-12 border-2 border-black font-bold text-lg hover:bg-black hover:text-white transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* PIX Info */}
                <div className="mb-8 p-4 bg-pink-shock text-white border-2 border-pink-shock">
                  <div className="flex items-center gap-2 mb-2">
                    <Zap size={20} className="text-lime-acid" />
                    <span className="font-bold uppercase tracking-wider">Pagamento Exclusivo via PIX</span>
                  </div>
                  <p className="text-sm">O PIX É NOSSO. Após confirmar seu pedido, você receberá a chave PIX para pagamento. Produção inicia após confirmação.</p>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="space-y-3">
                <button
                  disabled={!selectedSize}
                  className={`w-full py-4 font-bold uppercase tracking-wider text-lg transition-all duration-200 border-2 ${
                    selectedSize
                      ? 'bg-pink-shock text-white border-pink-shock hover:bg-black hover:border-black'
                      : 'bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed'
                  }`}
                >
                  Comprar Agora - R$ {(product.price * quantity).toFixed(2)}
                </button>
                <button className="w-full py-4 font-bold uppercase tracking-wider text-lg border-2 border-black text-black hover:bg-black hover:text-white transition-all duration-200">
                  Enviar Comprovante via WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Size Table Modal */}
      <Dialog open={showSizeTable} onOpenChange={setShowSizeTable}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold uppercase">Tabela de Medidas</DialogTitle>
            <DialogDescription>
              Todas as medidas em centímetros (cm)
            </DialogDescription>
          </DialogHeader>

          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-pink-shock text-white">
                  <th className="border-2 border-black p-3 text-left font-bold uppercase">Tamanho</th>
                  <th className="border-2 border-black p-3 text-left font-bold uppercase">Largura</th>
                  <th className="border-2 border-black p-3 text-left font-bold uppercase">Comprimento</th>
                  <th className="border-2 border-black p-3 text-left font-bold uppercase">Manga</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { size: 'P', width: '42', length: '64', sleeve: '18' },
                  { size: 'M', width: '45', length: '67', sleeve: '19' },
                  { size: 'G', width: '48', length: '70', sleeve: '20' },
                  { size: 'GG', width: '51', length: '73', sleeve: '21' },
                  { size: 'XG', width: '54', length: '76', sleeve: '22' },
                ].map((row) => (
                  <tr key={row.size} className="hover:bg-gray-50">
                    <td className="border-2 border-black p-3 font-bold uppercase">{row.size}</td>
                    <td className="border-2 border-black p-3">{row.width} cm</td>
                    <td className="border-2 border-black p-3">{row.length} cm</td>
                    <td className="border-2 border-black p-3">{row.sleeve} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-gray-600 mt-4">
            * Medidas aproximadas. Pequenas variações podem ocorrer devido ao processo de produção sob demanda.
          </p>
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
