import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, X, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

const menuItems = [
  { href: "/", label: "Home" },
  { href: "/loja", label: "Loja" },
  { href: "/colecao/o-pix-e-nosso", label: "Coleção" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, itemCount } = useCart();
  const [location] = useLocation();
  const whatsappHelp = buildWhatsAppHelpMessage();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isMenuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.97)" : "#000000",
          borderBottom: "3px solid #FF006E",
          backdropFilter: scrolled ? "blur(8px)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/">
              <a className="flex flex-col leading-none hover:opacity-80 transition-opacity select-none">
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(1.4rem, 4vw, 1.9rem)", color: "#FFFFFF", letterSpacing: "0.04em", lineHeight: 1 }}>
                  BOLSONIER
                </span>
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "clamp(0.55rem, 1.5vw, 0.7rem)", color: "#FF006E", letterSpacing: "0.35em", lineHeight: 1 }}>
                  S&nbsp;T&nbsp;O&nbsp;R&nbsp;E
                </span>
              </a>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {menuItems.map((item) => (
                <Link key={item.href} href={item.href}>
                  <a
                    className="relative font-black uppercase tracking-widest text-xs transition-colors duration-200 group"
                    style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.85rem", color: location === item.href ? "#FF006E" : "#FFFFFF" }}
                  >
                    {item.label}
                    <span className="absolute -bottom-1 left-0 h-0.5 bg-pink-shock transition-all duration-300 group-hover:w-full" style={{ width: location === item.href ? "100%" : "0%", background: "#FF006E" }} />
                  </a>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:flex items-center gap-2 px-4 py-2 font-black tracking-wider uppercase text-xs transition-all duration-200 border-2"
                style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#FF006E", borderColor: "#FF006E", color: "#FFFFFF", fontSize: "0.8rem" }}
              >
                <MessageCircle size={15} />
                WhatsApp
              </a>

              <button onClick={openCart} className="relative p-2 transition-colors duration-200" style={{ color: "#FFFFFF" }} aria-label="Abrir carrinho">
                <ShoppingBag size={22} />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 text-white text-xs font-black w-5 h-5 flex items-center justify-center rounded-full" style={{ background: "#FF006E", fontSize: "0.6rem" }}>
                    {itemCount > 99 ? "99+" : itemCount}
                  </span>
                )}
              </button>

              {/* Hambúrguer animado */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
                aria-label={isMenuOpen ? "Fechar menu" : "Abrir menu"}
                aria-expanded={isMenuOpen}
              >
                <span className="block h-0.5 w-6 transition-all duration-300 origin-center" style={{ background: "#FFFFFF", transform: isMenuOpen ? "translateY(8px) rotate(45deg)" : "none" }} />
                <span className="block h-0.5 w-6 transition-all duration-300" style={{ background: "#FF006E", opacity: isMenuOpen ? 0 : 1, transform: isMenuOpen ? "scaleX(0)" : "none" }} />
                <span className="block h-0.5 w-6 transition-all duration-300 origin-center" style={{ background: "#FFFFFF", transform: isMenuOpen ? "translateY(-8px) rotate(-45deg)" : "none" }} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 lg:hidden transition-all duration-300"
        style={{ background: "rgba(0,0,0,0.7)", opacity: isMenuOpen ? 1 : 0, pointerEvents: isMenuOpen ? "auto" : "none" }}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Drawer lateral */}
      <div
        className="fixed top-0 right-0 h-full z-50 lg:hidden flex flex-col transition-transform duration-300"
        style={{ width: "min(320px, 85vw)", background: "#000000", borderLeft: "3px solid #FF006E", transform: isMenuOpen ? "translateX(0)" : "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b-2" style={{ borderColor: "#FF006E" }}>
          <div className="flex flex-col leading-none">
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.4rem", color: "#FFF", letterSpacing: "0.04em" }}>BOLSONIER</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "0.6rem", color: "#FF006E", letterSpacing: "0.35em" }}>S&nbsp;T&nbsp;O&nbsp;R&nbsp;E</span>
          </div>
          <button onClick={() => setIsMenuOpen(false)} className="p-2" style={{ color: "#FFFFFF" }} aria-label="Fechar menu">
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-6 py-8 flex flex-col gap-1">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <a
                className="block py-4 border-b transition-all duration-200"
                style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: "1.6rem", letterSpacing: "0.06em", color: location === item.href ? "#FF006E" : "#FFFFFF", borderColor: "rgba(255,255,255,0.08)" }}
              >
                {item.label}
              </a>
            </Link>
          ))}
        </nav>

        <div className="px-6 pb-8 flex flex-col gap-3">
          <a
            href={whatsappHelp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 py-4 font-black uppercase tracking-wider border-2 transition-all duration-200"
            style={{ fontFamily: "'Bebas Neue', sans-serif", background: "#FF006E", borderColor: "#FF006E", color: "#FFFFFF", fontSize: "1rem" }}
          >
            <MessageCircle size={18} />
            Falar no WhatsApp
          </a>
          <p className="text-center text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Bebas Neue', sans-serif", letterSpacing: "0.2em" }}>
            FEITO NO BRASIL · EST. 24
          </p>
        </div>
      </div>
    </>
  );
}
