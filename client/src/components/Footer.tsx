import { Link } from 'wouter';
import { Instagram, Twitter, MessageCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-black text-white border-t-4 border-lime-acid">
      <div className="container max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold tracking-wider mb-4 uppercase">Bolsonier Store</h3>
            <p className="text-sm text-gray-300 mb-4">Streetwear autoral. Edição limitada. Feito no Brasil.</p>
            <p className="text-sm text-gray-300 mb-2">
              <a href="mailto:contato@bolsonier.com.br" className="hover:text-lime-acid transition-colors">
                contato@bolsonier.com.br
              </a>
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-lime-acid transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="hover:text-lime-acid transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="hover:text-lime-acid transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Loja</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/loja" className="hover:text-lime-acid transition-colors">Todos os Produtos</Link></li>
              <li><Link href="/colecao-pix" className="hover:text-lime-acid transition-colors">O Pix é Nosso</Link></li>
              <li><Link href="/colecao-bastilha" className="hover:text-lime-acid transition-colors">A Bastilha</Link></li>
              <li><Link href="/camisetas" className="hover:text-lime-acid transition-colors">Camisetas</Link></li>
              <li><Link href="/croppeds" className="hover:text-lime-acid transition-colors">Croppeds</Link></li>
              <li><Link href="/bodies" className="hover:text-lime-acid transition-colors">Bodies</Link></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Informações</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/sobre" className="hover:text-lime-acid transition-colors">Sobre</Link></li>
              <li><Link href="/contato" className="hover:text-lime-acid transition-colors">Contato</Link></li>
              <li><Link href="/faq" className="hover:text-lime-acid transition-colors">FAQ</Link></li>
              <li><Link href="/prazo-envio" className="hover:text-lime-acid transition-colors">Prazo de Envio</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-bold tracking-wider mb-4 uppercase">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/politica-privacidade" className="hover:text-lime-acid transition-colors">Privacidade</Link></li>
              <li><Link href="/politica-trocas" className="hover:text-lime-acid transition-colors">Trocas e Devoluções</Link></li>
              <li><Link href="/termos" className="hover:text-lime-acid transition-colors">Termos de Uso</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-400">
          <p>&copy; 2026 Bolsonier Studios. Todos os direitos reservados.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Feito no Brasil</span>
            <span>Pix é Nosso</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
