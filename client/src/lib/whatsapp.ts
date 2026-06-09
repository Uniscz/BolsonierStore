// Utilitário para montar mensagens de pedido para o WhatsApp da Bolsonier Store

export const WHATSAPP_NUMBER = "5547996103720";
export const WHATSAPP_BASE_URL = `https://wa.me/${WHATSAPP_NUMBER}`;

export interface CartItemForMessage {
  name: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

/** Mensagem genérica de ajuda — usar em Header, Footer, Home, About, Contact, FAQ, BastilhaCollection */
export function buildWhatsAppHelpMessage(): string {
  const text = "Olá, vim da loja Bolsonier Store e preciso de ajuda.";
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}

/** Mensagem de pedido completo — usar apenas no botão "Finalizar pelo WhatsApp" do carrinho */
export function buildWhatsAppOrderMessage(
  cartItems: CartItemForMessage[],
  total: number
): string {
  const itemLines = cartItems
    .map(
      (item) =>
        `${item.quantity}x ${item.name}\nCor: ${item.color}\nTamanho: ${item.size}\nValor: R$ ${(item.price).toFixed(2).replace(".", ",")}`
    )
    .join("\n\n");

  const totalFormatted = total.toFixed(2).replace(".", ",");

  const message = `Olá, vim da loja Bolsonier Store e quero finalizar meu pedido.

Pedido:
${itemLines}

Subtotal: R$ ${totalFormatted}
Frete: a combinar pelo atendimento
Total parcial: R$ ${totalFormatted}

Pagamento via PIX.
Após o pagamento, envio o comprovante por aqui.

Prazo informado no site: até 25 dias úteis após confirmação do pagamento.`;

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(message)}`;
}

export function buildWhatsAppContactMessage(
  name: string,
  contact: string,
  message: string
): string {
  const text = `Olá, vim da loja Bolsonier Store.

Nome: ${name}
Contato: ${contact}

Mensagem:
${message}`;

  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}

export function buildWhatsAppFreightMessage(cep?: string): string {
  const cepPart = cep ? ` para o CEP: ${cep}` : "";
  const text = `Olá, vim da loja Bolsonier Store e quero consultar o frete da Camiseta O Pix é Nosso${cepPart}`;
  return `${WHATSAPP_BASE_URL}?text=${encodeURIComponent(text)}`;
}

export function openWhatsApp(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
