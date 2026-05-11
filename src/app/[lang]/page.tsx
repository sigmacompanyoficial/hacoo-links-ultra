"use client";

import HeroSection from "@/components/HeroSection";
import ProductCard from "@/components/ProductCard";

import { products } from "@/data/products";
import { ArrowRight, ShieldCheck, Zap, Send, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { useLanguage } from "@/context/LanguageContext";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
  viewport: { once: true }
};

function HomeContent() {
  const { t, language } = useLanguage();
  const getPath = (path: string) => `/${language}${path}`;
  const searchParams = useSearchParams();
  const [showVerifiedToast, setShowVerifiedToast] = useState(false);
  const featuredProducts = products.filter(p => p.isNew).slice(0, 4);
  
  useEffect(() => {
    if (searchParams.get('verified') === 'true') {
      setShowVerifiedToast(true);
      const timer = setTimeout(() => setShowVerifiedToast(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  // Fallback if no new products
  const productsToShow = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 4);

  return (
    <div className="home-wrapper">
      {/* 1. HERO SECTION */}
      <HeroSection />


      {/* 2. VALUE PROPOSITION SECTION */}
      <section className="section bg-secondary/30">
        <div className="container">
          <motion.div 
            className="section-header mb-10 md:mb-16"
            {...fadeInUp}
          >
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
              {t("home.why_choose").includes("Hacoo Ultra") ? (
                <>
                  {t("home.why_choose").split("Hacoo Ultra")[0]}
                  <span className="text-blue-500">Hacoo Ultra</span>
                  {t("home.why_choose").split("Hacoo Ultra")[1]}
                </>
              ) : t("home.why_choose")}
            </h2>
            <p className="text-zinc-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed">
              {t("home.why_choose_desc")}
            </p>
          </motion.div>
          
          <div className="features-grid">
            <motion.div 
              className="feature-card"
              {...fadeInUp}
              transition={{ delay: 0.1 }}
            >
              <div className="feature-icon">
                <Zap size={24} />
              </div>
              <h3>{t("home.daily_update")}</h3>
              <p>{t("home.daily_update_desc")}</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              {...fadeInUp}
              transition={{ delay: 0.2 }}
            >
              <div className="feature-icon">
                <ShieldCheck size={24} />
              </div>
              <h3>{t("home.verified_quality")}</h3>
              <p>{t("home.verified_quality_desc")}</p>
            </motion.div>
            
            <motion.div 
              className="feature-card"
              {...fadeInUp}
              transition={{ delay: 0.3 }}
            >
              <div className="feature-icon">
                <Send size={24} />
              </div>
              <h3>{t("home.telegram_comm")}</h3>
              <p>{t("home.telegram_comm_desc")}</p>
            </motion.div>
          </div>
        </div>
      </section>



      {/* 3. FEATURED PRODUCTS PREVIEW */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="flex flex-col md:flex-row justify-between items-center md:items-end mb-10 md:mb-12 gap-6 md:gap-8"
            {...fadeInUp}
          >
            <div className="text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tighter uppercase italic">
                {t("home.new_arrivals").includes("semana") ? (
                  <>
                    {t("home.new_arrivals").split("semana")[0]}
                    <span className="text-blue-500">semana</span>
                    {t("home.new_arrivals").split("semana")[1]}
                  </>
                ) : t("home.new_arrivals").includes("week") ? (
                  <>
                    {t("home.new_arrivals").split("week")[0]}
                    <span className="text-blue-500">week</span>
                    {t("home.new_arrivals").split("week")[1]}
                  </>
                ) : t("home.new_arrivals").includes("semaine") ? (
                  <>
                    {t("home.new_arrivals").split("semaine")[0]}
                    <span className="text-blue-500">semaine</span>
                    {t("home.new_arrivals").split("semaine")[1]}
                  </>
                ) : t("home.new_arrivals").includes("Woche") ? (
                  <>
                    {t("home.new_arrivals").split("Woche")[0]}
                    <span className="text-blue-500">Woche</span>
                    {t("home.new_arrivals").split("Woche")[1]}
                  </>
                ) : (
                  t("home.new_arrivals")
                )}
              </h2>
              <p className="text-zinc-500 text-base md:text-xl max-w-2xl leading-relaxed">{t("home.new_arrivals_desc")}</p>
            </div>
            <Link href={getPath("/products")} className="w-full md:w-auto bg-zinc-900 text-white px-8 py-4 rounded-2xl font-black text-sm border border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
              {t("home.view_catalog")}
              <ArrowRight size={18} />
            </Link>
          </motion.div>

          <div className="product-grid">
            {productsToShow.map((product) => (
              <motion.div key={product.id} {...fadeInUp}>
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. CTA SECTION */}
      <section className="section mb-12">
        <div className="container">
          <motion.div 
            className="cta-banner"
            {...fadeInUp}
          >
            <div className="cta-content">
              <h2 className="cta-title">
                {t("home.cta_title")}
              </h2>
              <p className="cta-text">
                {t("home.cta_desc")}
              </p>
              <div className="cta-actions flex flex-col sm:flex-row gap-4 w-full justify-center lg:justify-start">
                <a href="https://t.me/hacoolinkssigma" target="_blank" rel="noopener noreferrer" className="w-full sm:w-auto bg-blue-600 text-white px-8 py-5 rounded-2xl font-black text-lg flex items-center justify-center gap-3 hover:bg-blue-500 transition-all shadow-2xl shadow-blue-500/20">
                  <Send size={20} />
                  {t("home.cta_telegram")}
                </a>
                <Link href={getPath("/products")} className="w-full sm:w-auto bg-zinc-900 text-white px-8 py-5 rounded-2xl font-black text-lg border border-zinc-800 flex items-center justify-center gap-3 hover:bg-zinc-800 transition-all">
                  <ShoppingBag size={20} />
                  {t("home.cta_explore")}
                </Link>
              </div>
            </div>
            {/* Background Glow */}
            <div className="cta-glow" />
          </motion.div>
        </div>
      </section>



      {/* Verification Toast */}
      <AnimatePresence>
        {showVerifiedToast && (
          <motion.div
            initial={{ opacity: 0, y: 100, x: '-50%' }}
            animate={{ opacity: 1, y: -40, x: '-50%' }}
            exit={{ opacity: 0, y: 100, x: '-50%' }}
            className="fixed bottom-0 left-1/2 z-[2000] w-[calc(100%-2rem)] max-w-md"
          >
            <div className="bg-emerald-500 text-white px-6 py-4 rounded-2xl shadow-2xl shadow-emerald-500/20 flex items-center justify-between gap-4 border border-emerald-400/20 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="font-black text-sm uppercase tracking-tight">Correo verificado</p>
                  <p className="text-white/80 text-xs font-bold italic">¡Ya puedes iniciar sesión!</p>
                </div>
              </div>
              <button 
                onClick={() => setShowVerifiedToast(false)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <Zap size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080808]" />}>
      <HomeContent />
    </Suspense>
  );
}
