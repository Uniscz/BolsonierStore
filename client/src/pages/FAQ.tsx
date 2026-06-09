import { useState } from "react";
import { Link } from "wouter";
import { ChevronDown, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

const faqs = [
  {
    question: "Qual é o prazo de produção e envio?",
    answer:
      "O prazo é de até 25 dias úteis a partir da confirmação do pagamento. Este é o prazo para produção sob demanda e envio para o endereço informado. O prazo pode variar conforme a região de entrega.",
  },
  {
    question: "Como funciona a produção sob demanda?",
    answer:
      "Cada peça é produzida especialmente para você, quando você a encomendar. Isso permite edições limitadas, design exclusivo e produção sem desperdício. Você recebe uma peça feita sob encomenda.",
  },
  {
    question: "Como faço para comprar?",
    answer:
      "Escolha o produto, selecione cor, tamanho e quantidade, e finalize pelo WhatsApp. Você receberá a chave PIX para pagamento. A produção começa após a confirmação do pagamento.",
  },
  {
    question: "Qual é a forma de pagamento?",
    answer:
      "Aceitamos exclusivamente pagamento via PIX. Após finalizar o pedido pelo WhatsApp, você receberá a chave PIX para realizar o pagamento.",
  },
  {
    question: "Como é calculado o frete?",
    answer:
      "O frete é calculado no atendimento pelo WhatsApp antes da confirmação final do pedido. O valor varia conforme a região de entrega.",
  },
  {
    question: "Quais são as opções de tamanho?",
    answer:
      "Oferecemos tamanhos P, M, G, GG e XGG. Consulte a tabela de medidas na página do produto para encontrar o tamanho ideal.",
  },
  {
    question: "Qual é a política de trocas?",
    answer:
      "Trocas por defeito devem ser solicitadas em até 7 dias corridos após o recebimento. Trocas por tamanho ou cor são avaliadas caso a caso. Entre em contato pelo WhatsApp.",
  },
  {
    question: "Posso acompanhar meu pedido?",
    answer:
      "Sim. Todo o acompanhamento é feito pelo WhatsApp. Você receberá atualizações sobre a produção e o envio do seu pedido.",
  },
  {
    question: "Como entro em contato?",
    answer:
      "Pelo WhatsApp: +55 47 99610-3720. Respondemos pedidos, dúvidas sobre tamanhos, frete e pagamento.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const whatsappHelp = buildWhatsAppHelpMessage();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-16 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1
            className="font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2.5rem, 8vw, 5rem)",
              textShadow: "3px 3px 0px #FF006E",
            }}
          >
            FAQ
          </h1>
          <p className="text-gray-300 mt-2 text-lg">Perguntas frequentes sobre a Bolsonier Store</p>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-16 px-4 bg-white flex-1">
        <div className="container max-w-3xl mx-auto">
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="border-2 border-black">
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="w-full flex items-center justify-between p-6 bg-white hover:bg-gray-50 transition-colors text-left"
                >
                  <h3 className="font-bold text-base uppercase tracking-wider">{faq.question}</h3>
                  <ChevronDown
                    size={22}
                    className={`flex-shrink-0 ml-4 transition-transform ${
                      openIndex === index ? "rotate-180" : ""
                    }`}
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
          <div className="mt-16 p-8 bg-black text-white text-center">
            <h2
              className="text-3xl font-black tracking-wider mb-4 uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Ainda tem dúvidas?
            </h2>
            <p className="mb-6 text-gray-300">
              Entre em contato pelo WhatsApp. Respondemos rapidamente.
            </p>
            <a
              href={whatsappHelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-3 font-black uppercase tracking-wider hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <MessageCircle size={20} />
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
