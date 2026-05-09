"use client";

import Link from "next/link";
import { ShoppingBag, Send } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const { t } = useLanguage();

  return (
    <footer className="site-footer bg-[#050505] border-t border-zinc-900 pt-24 pb-12">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          {/* Column 1: Brand */}
          <div className="flex flex-col gap-6">
            <Link href="/" className="flex items-center group">
              <div className="flex flex-col leading-none">
                <span className="text-white font-black text-2xl tracking-tighter italic">HACOO<span className="text-blue-500">ULTRA</span></span>
              </div>
            </Link>
            <p className="text-zinc-500 text-sm leading-relaxed">
              {t("footer.desc")}
            </p>
          </div>

          {/* Column 2: Navigation */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-blue-500"></span>
              {t("footer.explore")}
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold">{t("nav.start")}</Link></li>
              <li><Link href="/products" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold">{t("nav.catalog")}</Link></li>
              <li><Link href="/cart" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold">{t("nav.cart")}</Link></li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-blue-500"></span>
              {t("footer.legal")}
            </h4>
            <ul className="flex flex-col gap-4">
              <li><Link href="/legal" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold">Aviso Legal</Link></li>
              <li><Link href="/legal#privacidad" className="text-zinc-500 hover:text-white transition-colors text-sm font-bold">Privacidad</Link></li>
            </ul>
          </div>

          {/* Column 4: Comunidad */}
          <div>
            <h4 className="text-white text-xs font-black uppercase tracking-widest mb-8 flex items-center gap-2">
              <span className="w-4 h-[1px] bg-blue-500"></span>
              {t("footer.community")}
            </h4>
            <div className="flex flex-col gap-6">
              <p className="text-zinc-500 text-sm leading-relaxed">
                Recibe alertas en tiempo real de ofertas flash en nuestro canal de Telegram.
              </p>
              <a
                href="https://t.me/hacoolinkssigma"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-zinc-900 text-white px-6 py-4 rounded-xl border border-zinc-800 flex items-center justify-center gap-3 font-black text-sm hover:bg-blue-600 hover:border-blue-500 transition-all shadow-xl"
              >
                <Send size={18} className="text-blue-400 group-hover:text-white" />
                TELEGRAM OFICIAL
              </a>
            </div>
          </div>
        </div>

        {/* Sub-footer */}
        <div className="pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col gap-2">
            <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest">
              © {currentYear} HACOO ULTRA PLATFORM — TODOS LOS DERECHOS RESERVADOS
            </p>
            <p className="text-zinc-700 text-[10px] max-w-2xl text-center md:text-left leading-relaxed">
              AVISO: Este sitio web participa en programas de afiliados y puede recibir comisiones por compras realizadas a través de nuestros enlaces. No somos vendedores directos, solo proporcionamos enlaces curados de alta calidad.
            </p>
          </div>

          <div className="flex items-center gap-6">
            {/* Social Icons could go here */}
          </div>
        </div>
      </div>
    </footer>
  );
}
