import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: 'Qual é o prazo de producao e envio?',
      answer: 'O prazo é de ate 25 dias uteis a partir da confirmacao do pagamento. Este é o prazo para producao sob demanda e envio para o endereco informado.'
    },
    {
      question: 'Como funciona a producao sob demanda?',
      answer: 'Cada peca é produzida especialmente para voce, quando voce a encomendar. Isso permite que tenhamos edicoes limitadas e evitemos desperdicio. Voce recebe uma peca feita sob encomenda.'
    },
    {
      question: 'Qual é a politica de trocas e devolucoes?',
      answer: 'Se a peca chegar com defeito ou nao corresponder a descricao, voce pode solicitar troca ou devolucao em ate 7 dias apos o recebimento. Leia nossa politica completa para mais detalhes.'
    },
    {
      question: 'Como acompanho meu pedido?',
      answer: 'Apos a confirmacao do pagamento, voce recebera um email com o numero de rastreamento. Voce pode acompanhar seu pedido pelo site dos Correios ou por WhatsApp.'
    },
    {
      question: 'Quais sao as opcoes de tamanho?',
      answer: 'Oferecemos tamanhos P, M, G e GG. Consulte nosso guia de medidas para encontrar o tamanho ideal para voce. Temos uma tabela detalhada no site.'
    },
    {
      question: 'Posso cancelar meu pedido?',
      answer: 'Sim, voce pode cancelar seu pedido em ate 24 horas apos a confirmacao do pagamento. Apos esse periodo, o pedido ja estara em producao e nao podera ser cancelado.'
    },
    {
      question: 'Qual é o material das pecas?',
      answer: 'Usamos algodao premium de alta qualidade para todas as nossas pecas. O tecido é confortavel, duravel e adequado para uso diario.'
    },
    {
      question: 'Como faco para entrar em contato?',
      answer: 'Voce pode nos contatar por email em contato@bolsonierstore.com ou por WhatsApp em (11) 99999-9999. Respondemos em ate 24 horas.'
    },
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">FAQ</h1>
          <p className="text-xl">Perguntas frequentes sobre Bolsonier Store</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-black">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors"
                >
                  <h3 className="font-bold text-lg text-left uppercase tracking-wider">{faq.question}</h3>
                  <ChevronDown
                    size={24}
                    className={`flex-shrink-0 ml-4 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openIndex === index && (
                  <div className="border-t-2 border-black p-6 bg-gray-50">
                    <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 p-8 bg-gradient-to-r from-pink-shock to-lime-acid text-white text-center">
            <h2 className="text-2xl font-bold tracking-wider mb-4 uppercase">Ainda tem duvidas?</h2>
            <p className="mb-6">Entre em contato conosco. Estamos aqui para ajudar.</p>
            <a href="/contato" className="inline-block bg-black text-white px-8 py-3 font-bold tracking-wider hover:bg-white hover:text-black transition-colors uppercase">
              Enviar Mensagem
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
