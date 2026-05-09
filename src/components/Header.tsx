"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, Send, User, LogOut, Settings, ShieldCheck } from "lucide-react";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";

import { useLanguage } from "@/context/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();
  const { cartCount } = useCart();
  const { t, language, setLanguage } = useLanguage();

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMenuOpen]);

  const navLinks = [
    { name: t("nav.start"), href: "/" },
    { name: t("nav.catalog"), href: "/products" },
  ];

  const getPath = (path: string) => `/${language}${path === '/' ? '' : path}`;

  return (
    <header className="fixed top-0 left-0 w-full z-[1000]">
      <div className="site-header h-[var(--header-height-mobile)] md:h-[var(--header-height)] bg-[#080808]/85 backdrop-blur-xl border-b border-zinc-900">
        <div className="container header-container h-full flex justify-between items-center">
          {/* Left: Logo */}
          <Link href={getPath("/")} className="flex items-center gap-2 group">
            <div className="flex flex-col leading-none">
              <span className="text-white font-black text-xl md:text-2xl tracking-tighter italic">HACOO<span className="text-blue-500">ULTRA</span></span>
              <span className="text-zinc-500 text-[8px] font-bold uppercase tracking-[0.3em] mt-0.5">Premium Shopping</span>
            </div>
          </Link>

          {/* Center: Desktop Navigation */}
          <nav className="nav-links hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={getPath(link.href)}
                className={`nav-item text-zinc-400 hover:text-white transition-colors ${pathname === getPath(link.href) ? "text-blue-500 font-bold" : ""}`}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://t.me/hacoolinkssigma"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-item text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
            >
              <Send size={16} />
              Telegram
            </a>
          </nav>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Admin Link (Only for admins) */}
            {profile?.role === "admin" && (
              <Link 
                href={getPath("/admin")}
                className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
              >
                <ShieldCheck size={14} />
                Admin
              </Link>
            )}

            {/* Configuration Button */}
            <div className="relative group">
              <Link href={getPath("/configuration")} className="p-2 text-zinc-400 hover:text-white transition-colors rounded-xl hover:bg-zinc-900/50 block">
                <Settings size={20} className="group-hover:rotate-45 transition-transform duration-500" />
              </Link>

              {/* Config Dropdown */}
              <div className="absolute right-0 mt-3 w-52 bg-[#0d0d0d] border border-zinc-800/50 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[1100] p-3 backdrop-blur-xl">
                <div className="text-[10px] font-bold uppercase text-zinc-500 px-3 py-2 tracking-widest">Preferencia de Sistema</div>
                <div className="flex flex-col gap-1 mt-1">
                  <div className="px-3 py-1.5 text-xs font-semibold text-zinc-400">Idioma Regional</div>
                  <div className="grid grid-cols-5 gap-1.5 p-1">
                    {[
                      { code: "es", flag: "🇪🇸" },
                      { code: "en", flag: "🇺🇸" },
                      { code: "fr", flag: "🇫🇷" },
                      { code: "de", flag: "🇩🇪" },
                      { code: "pt", flag: "🇵🇹" }
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm hover:bg-zinc-800 transition-all ${language === lang.code ? 'bg-blue-600/20 border border-blue-500/40 text-white' : 'text-zinc-500'}`}
                        title={lang.code.toUpperCase()}
                      >
                        {lang.flag}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-zinc-800/50">
                  <Link 
                    href={getPath("/configuration")}
                    className="flex items-center gap-2 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                  >
                    <Settings size={12} />
                    Más Ajustes
                  </Link>
                </div>
              </div>
            </div>

            {/* Cart Icon */}
            <Link href={getPath("/cart")} className="relative p-2 text-zinc-400 hover:text-white transition-colors group">
              <ShoppingBag size={20} className="group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-blue-600 text-white text-[9px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-xl flex items-center justify-center border-2 border-[#080808] shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Auth Button */}
            <div className="hidden md:block">
              {user ? (
                <Link href={getPath("/profile")} className="flex items-center gap-4 group cursor-pointer">
                  <div className="flex flex-col items-end">
                    <span className="text-zinc-200 text-xs font-semibold group-hover:text-blue-500 transition-colors">{profile?.displayName || "Mi Cuenta"}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); logout(); }}
                      className="text-zinc-500 text-[9px] uppercase font-bold tracking-widest hover:text-red-500 transition-colors mt-0.5"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-500 overflow-hidden group-hover:border-blue-500/40 transition-all shadow-inner">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName || ""} className="w-full h-full object-cover" />
                    ) : (
                      <User size={18} />
                    )}
                  </div>
                </Link>
              ) : (
                <Link href={getPath("/auth")} className="btn bg-white text-black hover:bg-zinc-200 shadow-lg shadow-white/5 font-bold text-xs" style={{ padding: '0.6rem 1.5rem', borderRadius: '12px' }}>
                  Acceso
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              className="mobile-menu-toggle md:hidden text-white p-1 ml-1"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-0 z-[2000] flex flex-col p-6 bg-[#080808] overflow-y-auto"
          >
            <div className="flex justify-between items-center mb-16">
              <Link href={getPath("/")} onClick={() => setIsMenuOpen(false)}>
                <div className="flex flex-col leading-none">
                  <span className="text-white font-black text-2xl tracking-tighter italic">HACOO<span className="text-blue-500">ULTRA</span></span>
                </div>
              </Link>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800/50 flex items-center justify-center text-white"
              >
                <X size={24} />
              </button>
            </div>

            <nav className="flex flex-col gap-6 mb-12">
              {navLinks.map((link, idx) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 + idx * 0.05 }}
                >
                  <Link
                    href={getPath(link.href)}
                    className={`text-4xl font-bold uppercase tracking-tight transition-colors ${pathname === getPath(link.href) ? "text-blue-500" : "text-zinc-200"}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                <a
                  href="https://t.me/hacoolinkssigma"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-4xl font-bold uppercase tracking-tight text-zinc-200 flex items-center gap-4"
                >
                  Telegram
                  <Send size={24} className="text-blue-500" />
                </a>
              </motion.div>

              {profile?.role === "admin" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Link
                    href={getPath("/admin")}
                    className="text-4xl font-bold uppercase tracking-tight text-blue-500 flex items-center gap-4"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin Panel
                    <ShieldCheck size={28} />
                  </Link>
                </motion.div>
              )}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-auto pt-10"
            >
              {user ? (
                <Link 
                  href={getPath("/profile")} 
                  className="flex items-center gap-4 p-5 bg-zinc-900/50 rounded-2xl border border-white/[0.03] group active:scale-[0.98] transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-12 h-12 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-500 overflow-hidden">
                    {profile?.photoURL ? (
                      <img src={profile.photoURL} alt={profile.displayName || ""} className="h-full w-full object-cover" />
                    ) : (
                      <User size={24} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-white font-bold text-sm tracking-tight">{profile?.displayName || "Mi Perfil"}</span>
                    <button
                      onClick={(e) => { e.preventDefault(); logout(); setIsMenuOpen(false); }}
                      className="text-red-500 text-[10px] font-bold uppercase tracking-widest text-left mt-0.5"
                    >
                      Cerrar sesión
                    </button>
                  </div>
                </Link>
              ) : (
                <Link
                  href={getPath("/auth")}
                  className="w-full bg-blue-600 text-white py-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-blue-600/10 active:scale-[0.98] transition-all"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={22} />
                  INICIAR SESIÓN
                </Link>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
