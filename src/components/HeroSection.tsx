"use client";

import { motion } from "framer-motion";
import { ShoppingBag, Send, Sparkles } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

export default function HeroSection() {
  const { t } = useLanguage();

  return (
    <section className="section pt-12 pb-20 overflow-hidden relative min-h-[80vh] flex items-center">
      {/* Background Decorative Element */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl aspect-square bg-blue-600/5 rounded-xl blur-[120px] -z-10" />

      <div className="container relative z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600/10 border border-blue-500/20 text-blue-500 text-xs font-black uppercase tracking-widest mb-8"
        >
          <Sparkles size={14} />
          <span>MÁS DE 100 LINKS NUEVOS CADA DÍA</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-white text-[clamp(2.2rem,12vw,3rem)] leading-[1] sm:text-5xl md:text-8xl font-black mb-8 tracking-tighter uppercase italic"
        >
          {t("hero.title")} <br />
          <span className="text-blue-500">Hacoo Ultra</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-zinc-400 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed"
        >
          {t("hero.subtitle")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10 md:mb-16"
        >
          <Link href="/products" className="btn btn-primary btn-lg w-full sm:w-auto font-black shadow-2xl shadow-blue-500/20">
            <ShoppingBag size={22} />
            {t("hero.cta")}
          </Link>
          <a href="https://t.me/hacoolinkssigma" target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-lg w-full sm:w-auto font-black">
            <Send size={22} className="text-blue-500" />
            {t("hero.telegram")}
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 md:gap-20 border-t border-zinc-900 pt-12 md:pt-16 w-full max-w-3xl"
        >
          <div className="flex flex-col">
            <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">5K+</span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.2em] font-black mt-2">Miembros</span>
          </div>
          <div className="flex flex-col">
            <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">100+</span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.2em] font-black mt-2">Links/Día</span>
          </div>
          <div className="flex flex-col col-span-2 md:col-span-1">
            <span className="text-3xl md:text-5xl font-black text-white italic tracking-tighter">90%</span>
            <span className="text-[10px] md:text-xs text-zinc-500 uppercase tracking-[0.2em] font-black mt-2">Descuento</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
