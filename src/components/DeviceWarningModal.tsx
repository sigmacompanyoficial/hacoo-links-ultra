"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Smartphone, ShoppingBag, LogIn, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

interface DeviceWarningModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DeviceWarningModal({ isOpen, onClose }: DeviceWarningModalProps) {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[3000] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="relative w-full max-w-xl bg-[#0c0c0c] border border-white/5 rounded-[2.5rem] p-10 md:p-14 shadow-2xl overflow-hidden"
        >
          {/* Decorative Gradient */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 blur-[80px] -mr-32 -mt-32 rounded-full" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/5 blur-[80px] -ml-32 -mb-32 rounded-full" />

          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-white transition-all hover:rotate-90"
          >
            <X size={20} />
          </button>

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-3xl bg-blue-600/10 flex items-center justify-center text-blue-500 mb-10">
              <Smartphone size={48} />
            </div>

            <h2 className="text-3xl md:text-5xl font-black text-white uppercase italic tracking-tighter mb-6 leading-tight">
              LOS LINKS SÓLO <span className="text-blue-500">FUNCIONAN EN MÓVIL</span>
            </h2>

            <p className="text-zinc-500 text-lg font-medium max-w-md mb-12 leading-relaxed">
              Hacoo requiere su aplicación oficial para procesar las compras. Sigue estos pasos para comprar este producto:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
              {[
                { 
                  icon: ShoppingBag, 
                  title: "1. GUARDA", 
                  desc: "Añade el producto a tu cesta ahora en PC." 
                },
                { 
                  icon: LogIn, 
                  title: "2. LOGIN", 
                  desc: "Entra con tu cuenta desde el móvil." 
                },
                { 
                  icon: ExternalLink, 
                  title: "3. COMPRA", 
                  desc: "Finaliza el pago desde la App de Hacoo." 
                }
              ].map((step, idx) => (
                <div key={idx} className="p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
                  <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center text-zinc-400 mb-4">
                    <step.icon size={18} />
                  </div>
                  <h3 className="text-white font-black text-xs uppercase tracking-widest mb-2">{step.title}</h3>
                  <p className="text-zinc-500 text-[10px] font-bold leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>

            <button 
              onClick={onClose}
              className="mt-14 w-full h-16 bg-white text-black rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all shadow-xl"
            >
              ENTENDIDO, GUARDAR EN CESTA
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
