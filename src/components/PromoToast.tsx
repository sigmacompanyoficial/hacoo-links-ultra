"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ticket, X, Copy, CheckCircle2, Sparkles } from "lucide-react";

export default function PromoToast() {
  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const PROMO_CODE = "ULTRA14";
  const INTERVAL_TIME = 4 * 60 * 1000;

  useEffect(() => {
    // Aparecer cada 4 minutos
    const interval = setInterval(() => {
      setIsVisible(true);
    }, 4 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (isVisible) {
      // Desaparecer después de 15 segundos
      timeout = setTimeout(() => {
        setIsVisible(false);
      }, 15000);
    }
    return () => clearTimeout(timeout);
  }, [isVisible]);

  const handleCopy = () => {
    navigator.clipboard.writeText(PROMO_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 50 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 50, filter: "blur(10px)" }}
          transition={{ type: "spring", damping: 20, stiffness: 200 }}
          className="fixed bottom-6 right-6 sm:bottom-10 sm:right-10 z-[2000] w-[calc(100vw-3rem)] sm:w-[380px]"
        >
          {/* Glow Effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl blur opacity-30 animate-pulse"></div>
          
          <div className="relative bg-[#080808] border border-white/10 rounded-xl p-6 shadow-2xl backdrop-blur-2xl overflow-hidden">
            {/* Background Decor */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/20 rounded-lg blur-[50px] pointer-events-none"></div>

            <div className="relative z-10 flex flex-col gap-5">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                    <Sparkles size={20} className="fill-current animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-white text-sm font-black uppercase tracking-widest">Recompensa</h4>
                    <p className="text-zinc-500 text-[11px] font-bold uppercase tracking-widest mt-0.5">Válido por 24h</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsVisible(false)}
                  className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-zinc-400 hover:bg-white/10 hover:text-white transition-all"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Body */}
              <div className="bg-white/[0.03] border border-white/[0.05] rounded-xl p-4 text-center">
                <p className="text-zinc-300 text-sm font-medium leading-relaxed mb-3">
                  Aprovecha un <span className="text-blue-400 font-black italic">14% EXTRA</span> de descuento usando nuestro código VIP.
                </p>
                <div className="inline-block bg-black border border-zinc-800 rounded-lg px-4 py-2 mb-1">
                  <span className="text-xl font-black tracking-[0.2em] text-white select-all">{PROMO_CODE}</span>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleCopy}
                className={`w-full py-4 rounded-lg flex items-center justify-center gap-3 font-black text-sm uppercase tracking-widest transition-all duration-300 ${
                  copied 
                  ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white shadow-lg shadow-green-500/30 scale-[0.98]" 
                  : "bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-600/20 active:scale-[0.98]"
                }`}
              >
                {copied ? <CheckCircle2 size={18} /> : <Ticket size={18} className="-rotate-45" />}
                {copied ? "¡CÓDIGO COPIADO!" : "COPIAR CUPÓN"}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
