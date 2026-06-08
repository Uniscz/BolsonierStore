import { useState } from 'react';
import { Menu, X, ShoppingBag, MessageCircle } from 'lucide-react';
import { Link } from 'wouter';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { label: 'Loja', href: '/loja' },
    { label: 'O Pix é Nosso', href: '/colecao-pix' },
    { label: 'Coleções', href: '/colecoes' },
    { label: 'Camisetas', href: '/camisetas' },
    { label: 'Croppeds', href: '/croppeds' },
    { label: 'Bodies', href: '/bodies' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ];

  return (
    <header className="bg-white border-b-2 border-black sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="font-bebas text-2xl font-bold tracking-wider">
                <span className="text-black">BOLSONIER</span>
                <br />
                <span className="text-xs tracking-widest">STORE</span>
              </div>
            </div>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-8">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a className="text-sm font-semibold tracking-wide hover:text-pink-shock transition-colors duration-200 uppercase">
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:flex items-center gap-2 bg-pink-shock text-white px-4 py-2 font-bold tracking-wider hover:bg-black transition-colors duration-200 uppercase text-xs">
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </button>
            <button className="relative p-2 hover:bg-lime-acid transition-colors duration-200">
              <ShoppingBag size={24} className="text-black" />
              <span className="absolute top-1 right-1 bg-pink-shock text-white text-xs font-bold w-5 h-5 flex items-center justify-center">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-lime-acid transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t-2 border-black space-y-3">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className="block text-sm font-bold tracking-wide hover:text-pink-shock transition-colors duration-200 uppercase"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <button className="w-full mt-4 bg-pink-shock text-white px-4 py-3 font-bold tracking-wider hover:bg-black transition-colors duration-200 uppercase text-sm flex items-center justify-center gap-2">
              <MessageCircle size={18} />
              WhatsApp
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
