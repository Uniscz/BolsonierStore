import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";
import { MessageCircle } from "lucide-react";

interface LegalSection {
  title: string;
  content: React.ReactNode;
}

function LegalPage({ title, sections }: { title: string; sections: LegalSection[] }) {
  const whatsappHelp = buildWhatsAppHelpMessage();
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="bg-black text-white py-16 px-4">
        <div className="container max-w-7xl mx-auto">
          <h1
            className="font-black uppercase"
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: "clamp(2rem, 6vw, 4rem)",
              textShadow: "3px 3px 0px #FF006E",
            }}
          >
            {title}
          </h1>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="container max-w-4xl mx-auto">
          <div className="space-y-10">
            {sections.map((section, idx) => (
              <div key={idx}>
                <h2 className="font-black uppercase tracking-wider text-xl mb-4 border-b-4 border-pink-shock pb-2">
                  {section.title}
                </h2>
                <div className="text-gray-700 leading-relaxed">{section.content}</div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 bg-black text-white">
            <p className="font-bold mb-3">Dúvidas? Fale com a gente pelo WhatsApp.</p>
            <a
              href={whatsappHelp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-6 py-3 font-black uppercase tracking-wider hover:bg-green-700 transition-colors border-2 border-green-600 hover:border-green-700"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              <MessageCircle size={18} />
              +55 47 99610-3720
            </a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export function PrazoEnvio() {
  return (
    <LegalPage
      title="Prazo de Produção e Envio"
      sections={[
        {
          title: "Produção sob demanda",
          content: (
            <p>
              A Bolsonier Store trabalha com produção sob demanda. Cada peça é produzida após a
              confirmação do pagamento, garantindo qualidade e exclusividade para cada pedido.
            </p>
          ),
        },
        {
          title: "Prazo",
          content: (
            <p>
              O prazo de produção e envio é de <strong>até 25 dias úteis</strong> após confirmação
              do pagamento. O prazo pode variar conforme produção, disponibilidade de fornecedor,
              logística e região de entrega.
            </p>
          ),
        },
        {
          title: "Atendimento",
          content: (
            <p>
              O cliente será atendido pelo WhatsApp para confirmação do pedido, dados de entrega,
              frete e envio do comprovante de pagamento.
            </p>
          ),
        },
        {
          title: "Frete",
          content: (
            <p>
              O frete é calculado no atendimento pelo WhatsApp antes da confirmação final do pedido.
              O valor varia conforme a região de entrega.
            </p>
          ),
        },
      ]}
    />
  );
}

export function PoliticaTrocas() {
  return (
    <LegalPage
      title="Trocas e Devoluções"
      sections={[
        {
          title: "Produção sob demanda",
          content: (
            <p>
              A Bolsonier Store trabalha exclusivamente com <strong>produção sob demanda</strong>.
              Cada peça é fabricada individualmente após a confirmação do pagamento. Por isso, não
              mantemos estoque e cada pedido é único.
            </p>
          ),
        },
        {
          title: "Trocas por defeito de fabricação",
          content: (
            <div className="space-y-2">
              <p>
                Aceitamos trocas em caso de defeito de fabricação comprovado. O prazo para
                solicitação é de <strong>7 dias corridos</strong> após o recebimento do produto.
              </p>
              <p>
                O cliente deve enviar fotos do defeito pelo WhatsApp para análise. Após confirmação
                do defeito, a Bolsonier Store arcará com os custos de envio da peça substituta.
              </p>
            </div>
          ),
        },
        {
          title: "Trocas por tamanho",
          content: (
            <div className="space-y-2">
              <p>
                Como cada peça é produzida sob demanda, <strong>não garantimos troca por tamanho</strong>{" "}
                em todos os casos. Recomendamos consultar a tabela de medidas antes de finalizar o
                pedido.
              </p>
              <p>
                Caso o produto chegue com tamanho diferente do pedido por erro nosso, realizaremos a
                troca sem custo adicional.
              </p>
            </div>
          ),
        },
        {
          title: "Trocas por cor ou modelo",
          content: (
            <p>
              Trocas por cor ou modelo diferente do pedido original <strong>não são aceitas</strong>{" "}
              após a confirmação do pagamento, pois a produção é iniciada imediatamente. Verifique
              sua escolha antes de finalizar.
            </p>
          ),
        },
        {
          title: "Direito de arrependimento",
          content: (
            <div className="space-y-2">
              <p>
                Conforme o Código de Defesa do Consumidor (Art. 49), o cliente tem direito de
                desistir da compra em até <strong>7 dias corridos</strong> após o recebimento.
              </p>
              <p>
                No entanto, por se tratar de produto personalizado e produzido sob demanda, a
                devolução por arrependimento pode não ser aceita após o início da produção. Entre em
                contato pelo WhatsApp o quanto antes caso queira cancelar.
              </p>
            </div>
          ),
        },
        {
          title: "Produtos não aceitos para troca",
          content: (
            <ul className="list-disc pl-5 space-y-1">
              <li>Produtos usados, lavados ou com sinais de uso</li>
              <li>Produtos com etiqueta removida</li>
              <li>Produtos danificados por mau uso do cliente</li>
              <li>Produtos com mais de 7 dias do recebimento (exceto defeito oculto)</li>
            </ul>
          ),
        },
        {
          title: "Como solicitar troca ou devolução",
          content: (
            <div className="space-y-2">
              <p>
                Todo atendimento de trocas e devoluções é feito exclusivamente pelo WhatsApp:{" "}
                <strong>+55 47 99610-3720</strong>.
              </p>
              <p>
                Envie uma mensagem informando: número do pedido, motivo da troca, e fotos do
                produto. Nossa equipe responderá em até 2 dias úteis.
              </p>
            </div>
          ),
        },
      ]}
    />
  );
}

export function Termos() {
  return (
    <LegalPage
      title="Termos de Compra"
      sections={[
        {
          title: "Produção sob demanda",
          content: (
            <p>
              Ao comprar, o cliente entende que o produto é produzido sob demanda. A produção começa
              somente após a confirmação do pagamento via PIX.
            </p>
          ),
        },
        {
          title: "Pagamento",
          content: (
            <p>
              O pagamento é realizado exclusivamente via <strong>PIX</strong>. A chave PIX será
              fornecida pelo atendimento no WhatsApp após a finalização do pedido.
            </p>
          ),
        },
        {
          title: "Prazo",
          content: (
            <p>
              O prazo é de até <strong>25 dias úteis</strong> após confirmação do pagamento.
            </p>
          ),
        },
        {
          title: "Frete",
          content: (
            <p>
              O frete é combinado pelo WhatsApp antes da confirmação final do pedido. O valor varia
              conforme a região de entrega.
            </p>
          ),
        },
        {
          title: "Responsabilidade do cliente",
          content: (
            <p>
              O cliente deve conferir cor, tamanho, quantidade e endereço antes de finalizar o
              pedido. Erros de informação fornecidos pelo cliente não são de responsabilidade da
              Bolsonier Store.
            </p>
          ),
        },
      ]}
    />
  );
}

export function PoliticaPrivacidade() {
  return (
    <LegalPage
      title="Política de Privacidade"
      sections={[
        {
          title: "Dados coletados",
          content: (
            <p>
              A loja coleta apenas os dados necessários para atendimento e envio do pedido. Esses
              dados podem incluir nome, WhatsApp, endereço, produto escolhido e comprovante de
              pagamento.
            </p>
          ),
        },
        {
          title: "Uso dos dados",
          content: (
            <p>
              Os dados coletados são utilizados exclusivamente para processar o pedido e realizar o
              atendimento ao cliente. Não compartilhamos dados com terceiros para fins comerciais.
            </p>
          ),
        },
        {
          title: "Proteção dos dados",
          content: (
            <p>
              A Bolsonier Store não vende dados de clientes. Todas as informações são tratadas com
              sigilo e utilizadas apenas para a finalidade do pedido.
            </p>
          ),
        },
        {
          title: "Contato",
          content: (
            <p>
              Em caso de dúvidas sobre privacidade, entre em contato pelo WhatsApp:{" "}
              <strong>+55 47 99610-3720</strong>.
            </p>
          ),
        },
      ]}
    />
  );
}
