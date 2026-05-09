"use client";

import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Info, AlertTriangle, ArrowLeft } from "lucide-react";
import Link from "next/link";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  },
  viewport: { once: true }
};

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-300 py-24 px-4 selection:bg-blue-500/30">
      <div className="container mx-auto flex flex-col items-center">
        {/* Header centered */}
        <motion.div 
          className="flex flex-col items-center text-center mb-16 w-full max-w-4xl"
          {...fadeInUp}
        >
          <Link href="/" className="inline-flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors mb-10 group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Volver al inicio</span>
          </Link>
          
          <h1 className="text-4xl md:text-7xl font-black text-white mb-8 tracking-tighter uppercase italic leading-[0.9] text-center">
            AVISO LEGAL Y <br />
            <span className="text-blue-500 underline decoration-blue-500/30 underline-offset-[12px]">PRIVACIDAD</span>
          </h1>
          
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl text-center leading-relaxed">
            Información importante sobre el uso de nuestra plataforma, protección de datos y exención de responsabilidad.
          </p>
        </motion.div>

        {/* Content Sections */}
        <div className="max-w-4xl w-full space-y-12 flex flex-col items-center">
          {/* Section 1: Disclaimer */}
          <motion.div 
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 md:p-14 w-full flex flex-col items-center text-center"
            {...fadeInUp}
          >
            <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-8">
              <AlertTriangle className="text-blue-500" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight uppercase italic text-center">Exención de Responsabilidad</h2>
            
            <div className="space-y-6 text-zinc-400 text-base md:text-lg leading-relaxed flex flex-col items-center w-full">
              <p className="max-w-3xl">
                <strong>Hacoo Ultra</strong> es una plataforma informativa que agrega y muestra enlaces de productos publicados en la plataforma <strong>Hacoo</strong>. No somos vendedores, no gestionamos pagos, ni enviamos productos.
              </p>
              <p className="max-w-3xl">
                Toda compra se realiza directamente en la plataforma Hacoo, quedando sujeta a sus propios términos y condiciones. El usuario es responsable de revisar dichas condiciones antes de realizar cualquier compra.
              </p>
              <div className="bg-blue-500/5 border-y border-blue-500/30 p-8 text-zinc-300 italic max-w-2xl text-center rounded-2xl my-8 w-full">
                "Sobre la naturaleza de los productos: Los artículos listados provienen de vendedores terceros en Hacoo. Esta web no verifica la autenticidad, calidad ni origen de los productos. Si un producto resulta ser una réplica o imitación de una marca registrada, la responsabilidad recae exclusivamente en el vendedor dentro de la plataforma de origen."
              </div>
              <p className="max-w-3xl">
                Para reclamaciones, devoluciones o incidencias, el usuario debe contactar directamente con el soporte de <strong>Hacoo</strong> o con el vendedor correspondiente.
              </p>
            </div>
          </motion.div>

          {/* Section 2: Privacy Policy */}
          <motion.div 
            id="privacidad"
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 md:p-14 w-full flex flex-col items-center text-center"
            {...fadeInUp}
          >
            <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center mb-8">
              <ShieldCheck className="text-indigo-500" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight uppercase italic text-center">Política de Privacidad (RGPD)</h2>
            
            <div className="space-y-6 text-zinc-400 text-base md:text-lg leading-relaxed flex flex-col items-center w-full">
              <p className="max-w-3xl">
                En cumplimiento con la <strong>LOPD/RGPD</strong>, informamos que este sitio web recoge datos mínimos necesarios para su funcionamiento:
              </p>
              <div className="flex justify-center w-full my-8">
                <ul className="list-none space-y-4 inline-block text-left">
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✦</span>
                    <span><strong>Cookies:</strong> Utilizamos cookies para mejorar la experiencia de usuario y analizar el tráfico de forma anónima a través de Firebase Analytics.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-blue-500 mt-1">✦</span>
                    <span><strong>Datos de Usuario:</strong> Si decides registrarte, almacenamos tu email y nombre de forma segura en Firebase para gestionar tus favoritos y perfil.</span>
                  </li>
                </ul>
              </div>
              <p className="max-w-3xl">
                Tus datos nunca serán vendidos a terceros. Tienes derecho a acceder, rectificar o eliminar tus datos en cualquier momento contactando con nosotros o a través de los ajustes de tu cuenta.
              </p>
            </div>
          </motion.div>

          {/* Section 3: Affiliation */}
          <motion.div 
            className="bg-zinc-900/40 backdrop-blur-xl border border-white/[0.06] rounded-[2.5rem] p-8 md:p-14 w-full flex flex-col items-center text-center"
            {...fadeInUp}
          >
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8">
              <Info className="text-emerald-500" size={28} />
            </div>
            <h2 className="text-2xl md:text-3xl font-black text-white mb-8 tracking-tight uppercase italic text-center">Programa de Afiliados</h2>
            
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-2xl text-center">
              Este sitio web participa en programas de afiliación. Esto significa que podemos recibir una pequeña comisión por las compras realizadas a través de nuestros enlaces, sin que esto suponga ningún coste adicional para ti. Esto nos ayuda a mantener la plataforma activa y gratuita.
            </p>
          </motion.div>
        </div>

        {/* Bottom text */}
        <div className="mt-24 text-center w-full">
          <p className="text-zinc-600 text-xs font-black uppercase tracking-[0.4em]">
            Hacoo Ultra Platform — Documento Legal Actualizado 2026
          </p>
        </div>
      </div>
    </div>
  );
}
