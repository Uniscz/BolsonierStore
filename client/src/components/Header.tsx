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
    <header className="bg-white border-b-4 border-black sticky top-0 z-50">
      <div className="container max-w-7xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center gap-1 hover:opacity-90 transition-opacity group">
              <div className="flex flex-col leading-tight">
                <span 
                  className="font-black tracking-tighter"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '1.5rem',
                    textTransform: 'uppercase',
                    textShadow: '2px 2px 0px #FF006E, 4px 4px 0px #CCFF00',
                    transform: 'skewY(-2deg)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  BOLSONIER
                </span>
                <span 
                  className="font-black tracking-widest"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '0.75rem',
                    color: '#FF006E',
                    textTransform: 'uppercase',
                    textShadow: '1px 1px 0px #CCFF00',
                    letterSpacing: '0.08em',
                  }}
                >
                  STORE
                </span>
              </div>
            </a>
          </Link>

          {/* Desktop Menu */}
          <nav className="hidden lg:flex items-center gap-6">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a 
                  className="font-black tracking-wider hover:text-pink-shock transition-all duration-200 uppercase text-xs hover:scale-110 transform"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: '0.875rem',
                  }}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 bg-pink-shock text-white px-4 py-2 font-black tracking-wider hover:bg-black transition-all duration-200 uppercase text-xs border-2 border-pink-shock hover:border-black"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              <MessageCircle size={18} />
              <span>WhatsApp</span>
            </button>
            <button className="relative p-2 hover:bg-lime-acid transition-colors duration-200 border-2 border-transparent hover:border-black">
              <ShoppingBag size={24} className="text-black" />
              <span className="absolute top-0 right-0 bg-pink-shock text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full">
                0
              </span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 hover:bg-lime-acid transition-colors duration-200 border-2 border-transparent hover:border-black"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="lg:hidden mt-4 pt-4 border-t-4 border-black space-y-3">
            {menuItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <a
                  className="block font-black tracking-wide hover:text-pink-shock transition-colors duration-200 uppercase text-sm"
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                  }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </a>
              </Link>
            ))}
            <button className="w-full mt-4 bg-pink-shock text-white px-4 py-3 font-black tracking-wider hover:bg-black transition-colors duration-200 uppercase text-sm flex items-center justify-center gap-2 border-2 border-pink-shock hover:border-black"
              style={{
                fontFamily: "'Bebas Neue', sans-serif",
              }}
            >
              <MessageCircle size={18} />
              WhatsApp
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
