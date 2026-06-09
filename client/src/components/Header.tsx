import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingBag, MessageCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { buildWhatsAppHelpMessage } from "@/lib/whatsapp";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/loja", label: "Loja" },
  { href: "/colecao-pix", label: "O Pix É Nosso" },
  { href: "/sobre", label: "Sobre" },
  { href: "/contato", label: "Contato" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { openCart, itemCount } = useCart();
  const [location] = useLocation();
  const whatsappHelp = buildWhatsAppHelpMessage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          background: scrolled ? "rgba(0,0,0,0.96)" : "rgba(0,0,0,0.92)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div className="container-shell">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link href="/">
              <a className="flex flex-col leading-none hover:opacity-80 transition-opacity select-none">
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(1.5rem, 4vw, 2rem)",
                    color: "#FFFFFF",
                    letterSpacing: "0.02em",
                    lineHeight: 1,
                  }}
                >
                  BOL<span style={{ color: "#FF0066" }}>S</span>ONIER
                </span>
                <span
                  style={{
                    fontFamily: "'Bebas Neue', sans-serif",
                    fontSize: "clamp(0.5rem, 1.2vw, 0.65rem)",
                    color: "rgba(255,255,255,0.5)",
                    letterSpacing: "0.45em",
                    lineHeight: 1,
                  }}
                >
                  S&nbsp;T&nbsp;O&nbsp;R&nbsp;E
                </span>
              </a>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="nav-link"
                    style={{ color: location === link.href ? "#FF0066" : undefined }}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="hidden md:flex items-center gap-4">
              <a
                href="https://www.instagram.com/euinelegivel/"
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link"
              >
                Instagram
              </a>
              <button
                onClick={openCart}
                className="relative nav-link flex items-center gap-1"
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={16} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-2 -right-2 text-white text-xs font-black w-4 h-4 flex items-center justify-center rounded-full"
                    style={{ background: "#FF0066", fontSize: "0.5rem" }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
              <Link href="/loja">
                <a className="btn-primary" style={{ padding: "0.6rem 1.4rem", fontSize: "0.6rem" }}>
                  Ver Coleção
                </a>
              </Link>
            </div>

            {/* Mobile: cart + hambúrguer */}
            <div className="md:hidden flex items-center gap-3">
              <button
                onClick={openCart}
                className="relative p-1"
                style={{ color: "#fff" }}
                aria-label="Abrir carrinho"
              >
                <ShoppingBag size={20} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1 -right-1 text-white text-xs font-black w-4 h-4 flex items-center justify-center rounded-full"
                    style={{ background: "#FF0066", fontSize: "0.5rem" }}
                  >
                    {itemCount}
                  </span>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex flex-col gap-1.5 p-2"
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              >
                <span
                  className="block h-px w-6 bg-white transition-all duration-300"
                  style={{ transform: menuOpen ? "rotate(45deg) translateY(6px)" : "none" }}
                />
                <span
                  className="block h-px w-6 transition-all duration-300"
                  style={{ background: "#FF0066", opacity: menuOpen ? 0 : 1 }}
                />
                <span
                  className="block h-px w-6 bg-white transition-all duration-300"
                  style={{ transform: menuOpen ? "rotate(-45deg) translateY(-6px)" : "none" }}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div
            className="md:hidden border-t"
            style={{ borderColor: "rgba(255,255,255,0.08)", background: "#000" }}
          >
            <div className="container-shell py-6 flex flex-col gap-5">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  <a
                    className="nav-link"
                    style={{ fontSize: "0.85rem", color: location === link.href ? "#FF0066" : undefined }}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.label}
                  </a>
                </Link>
              ))}
              <a
                href={whatsappHelp}
                target="_blank"
                rel="noopener noreferrer"
                className="nav-link flex items-center gap-2"
                style={{ fontSize: "0.85rem" }}
                onClick={() => setMenuOpen(false)}
              >
                <MessageCircle size={14} />
                WhatsApp
              </a>
              <div className="pt-4 border-t" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                <Link href="/loja">
                  <a className="btn-primary w-full justify-center" onClick={() => setMenuOpen(false)}>
                    Ver Coleção
                  </a>
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Spacer para compensar o header fixo */}
      <div style={{ height: "4rem" }} className="md:hidden" />
      <div style={{ height: "5rem" }} className="hidden md:block" />
    </>
  );
}
