import { Link } from "wouter";
import { Instagram, MessageCircle } from "lucide-react";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

export default function Footer() {
  const whatsappHelp = buildWhatsAppHelpMessage();

  return (
    <footer className="bg-black text-white border-t-4 border-lime-acid">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3
              className="text-xl font-black tracking-wider mb-4 uppercase"
              style={{ fontFamily: "'Bebas Neue', sans-serif" }}
            >
              Bolsonier Store
            </h3>
            <p className="text-sm text-gray-300 mb-4">
              Streetwear autoral. Produção sob demanda. Feito no Brasil.
            </p>
            <div className="flex gap-4 items-center">
              <a
                href="https://instagram.com/euinelegivel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-acid transition-colors"
                aria-label="Instagram @euinelegivel"
              >
                <Instagram size={20} />
              </a>
              {/* TikTok — lucide-react não tem ícone nativo; link textual discreto */}
              <a
                href="https://www.tiktok.com/@euinelegivel"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-acid transition-colors text-xs font-bold tracking-widest uppercase"
                aria-label="TikTok @euinelegivel"
              >
                TikTok
              </a>
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-lime-acid transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Loja</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/loja" className="hover:text-lime-acid transition-colors">
                  Loja
                </Link>
              </li>
              <li>
                <Link href="/colecao-bastilha" className="hover:text-lime-acid transition-colors">
                  A Bastilha
                </Link>
              </li>
              <li>
                <Link href="/produto/camiseta-pix" className="hover:text-lime-acid transition-colors">
                  Camiseta O Pix é Nosso
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/sobre" className="hover:text-lime-acid transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link href="/contato" className="hover:text-lime-acid transition-colors">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-lime-acid transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/prazo-envio" className="hover:text-lime-acid transition-colors">
                  Prazo de Envio
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/politica-privacidade" className="hover:text-lime-acid transition-colors">
                  Privacidade
                </Link>
              </li>
              <li>
                <Link href="/politica-trocas" className="hover:text-lime-acid transition-colors">
                  Trocas e Devoluções
                </Link>
              </li>
              <li>
                <Link href="/termos" className="hover:text-lime-acid transition-colors">
                  Termos de Compra
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400 gap-4">
          <div>
            <p>© 2026 Bolsonier Store. Todos os direitos reservados.</p>
            <p className="mt-1">Produção sob demanda no Brasil.</p>
          </div>
          <a
            href={whatsappHelp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors font-semibold"
          >
            <MessageCircle size={16} />
            +55 47 99610-3720
          </a>
        </div>
      </div>
    </footer>
  );
}
