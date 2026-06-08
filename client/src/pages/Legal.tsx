import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocation } from 'wouter';

export default function Legal() {
  const [location] = useLocation();
  
  const getTitle = () => {
    if (location.includes('privacidade')) return 'Politica de Privacidade';
    if (location.includes('trocas')) return 'Politica de Trocas e Devolucoes';
    if (location.includes('prazo')) return 'Prazo de Producao e Envio';
    return 'Termos Legais';
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Hero */}
      <section className="py-20 px-4 bg-black text-white">
        <div className="container max-w-7xl mx-auto">
          <h1 className="display-text mb-4">{getTitle()}</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 px-4 bg-white">
        <div className="container max-w-3xl mx-auto prose prose-lg">
          {location.includes('privacidade') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-wider uppercase mb-4">Politica de Privacidade</h2>
              <p className="text-gray-600">
                A Bolsonier Store respeita sua privacidade e é comprometida em proteger seus dados pessoais. Esta politica descreve como coletamos, usamos e protegemos suas informacoes.
              </p>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Coleta de Dados</h3>
                <p className="text-gray-600">
                  Coletamos informacoes que voce fornece voluntariamente, como nome, email, endereco e dados de pagamento quando faz uma compra ou se inscreve em nossa newsletter.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Uso de Dados</h3>
                <p className="text-gray-600">
                  Usamos seus dados para processar pedidos, enviar atualizacoes sobre seus pedidos, responder a suas duvidas e melhorar nossos servicos.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Seguranca</h3>
                <p className="text-gray-600">
                  Implementamos medidas de seguranca adequadas para proteger seus dados pessoais contra acesso nao autorizado, alteracao ou destruicao.
                </p>
              </div>
            </div>
          )}

          {location.includes('trocas') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-wider uppercase mb-4">Politica de Trocas e Devolucoes</h2>
              <p className="text-gray-600">
                Queremos que voce esteja completamente satisfeito com sua compra. Se nao estiver, oferecemos uma politica de trocas e devolucoes simples.
              </p>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Prazo</h3>
                <p className="text-gray-600">
                  Voce tem ate 7 dias apos o recebimento do produto para solicitar uma troca ou devolucao.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Condicoes</h3>
                <p className="text-gray-600">
                  O produto deve estar em perfeito estado, sem uso, com todas as etiquetas e embalagem original. Produtos com defeito de fabricacao sao sempre aceitos.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Processo</h3>
                <p className="text-gray-600">
                  Entre em contato conosco por email ou WhatsApp para iniciar o processo. Enviaremos um codigo de devolucao e as instrucoes de envio.
                </p>
              </div>
            </div>
          )}

          {location.includes('prazo') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-wider uppercase mb-4">Prazo de Producao e Envio</h2>
              <p className="text-gray-600">
                Como produzimos sob demanda, cada pedido tem um prazo especifico para producao e envio.
              </p>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Producao</h3>
                <p className="text-gray-600">
                  O prazo de producao é de ate 15 dias uteis apos a confirmacao do pagamento. Este prazo pode variar dependendo da quantidade de pedidos.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Envio</h3>
                <p className="text-gray-600">
                  Apos a producao, o produto é enviado pelos Correios. O prazo de entrega é de ate 10 dias uteis dependendo da regiao.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Total</h3>
                <p className="text-gray-600">
                  O prazo total é de ate 25 dias uteis. Voce recebera um email com o numero de rastreamento para acompanhar seu pedido.
                </p>
              </div>
            </div>
          )}

          {!location.includes('privacidade') && !location.includes('trocas') && !location.includes('prazo') && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold tracking-wider uppercase mb-4">Termos de Uso</h2>
              <p className="text-gray-600">
                Ao acessar e usar o site da Bolsonier Store, voce concorda em cumprir estes termos e condicoes.
              </p>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Licenca de Uso</h3>
                <p className="text-gray-600">
                  O conteudo deste site é fornecido apenas para fins informativos e comerciais pessoais. Voce nao pode reproduzir, distribuir ou transmitir qualquer conteudo sem permissao.
                </p>
              </div>
              <div>
                <h3 className="text-xl font-bold tracking-wider uppercase mb-2">Limitacao de Responsabilidade</h3>
                <p className="text-gray-600">
                  A Bolsonier Store nao sera responsavel por danos indiretos, incidentais ou consequentes decorrentes do uso ou impossibilidade de usar este site.
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
