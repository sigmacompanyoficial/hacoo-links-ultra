"use client";

import { useLanguage } from "@/context/LanguageContext";
import Link from "next/link";
import { AlertCircle, ArrowLeft, ShieldAlert } from "lucide-react";
import { motion } from "framer-motion";

export default function AuthCodeErrorPage() {
  const { language, t } = useLanguage();
  const getPath = (path: string) => `/${language}${path}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.06] rounded-[2.5rem] p-10 md:p-12 text-center shadow-2xl"
      >
        <div className="w-20 h-20 bg-red-500/10 rounded-xl flex items-center justify-center mx-auto mb-8">
          <ShieldAlert className="text-red-500" size={40} />
        </div>
        
        <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic mb-4 tracking-tight">
          Error de <span className="text-red-500">Autenticación</span>
        </h1>
        
        <p className="text-zinc-500 mb-8 leading-relaxed">
          No se pudo completar el inicio de sesión. Esto suele ocurrir si el enlace ha caducado, si las credenciales de Supabase no están configuradas en el archivo .env.local, o si hay un desajuste en las URLs de redirección.
        </p>

        <div className="space-y-4">
          <div className="bg-red-500/5 border border-red-500/10 p-4 rounded-2xl text-left">
            <div className="flex items-center gap-2 text-red-400 text-xs font-black uppercase mb-1">
              <AlertCircle size={14} />
              Posibles causas:
            </div>
            <ul className="text-[10px] text-zinc-400 space-y-1 list-disc ml-4 font-medium">
              <li>El archivo .env.local no tiene las API keys reales.</li>
              <li>La URL de redirección en el panel de Supabase no coincide.</li>
              <li>El usuario canceló el permiso en Google.</li>
            </ul>
          </div>

          <Link 
            href={getPath("/auth")} 
            className="w-full bg-white text-black py-4 rounded-xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-colors"
          >
            <ArrowLeft size={16} />
            Reintentar Login
          </Link>
          
          <Link 
            href={getPath("/")} 
            className="block text-zinc-500 hover:text-white text-xs font-black uppercase tracking-widest transition-colors"
          >
            Volver al Inicio
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
