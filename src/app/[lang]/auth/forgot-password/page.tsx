"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, 
  Loader2, 
  ArrowLeft,
  ShoppingBag,
  AlertCircle,
  CheckCircle2,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const { error: authError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      
      if (authError) throw authError;
      
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Ocurrió un error al enviar el email de recuperación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#050505] relative overflow-hidden px-4 py-20 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-blue-600/[0.03] blur-[160px] rounded-xl" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-indigo-600/[0.03] blur-[160px] rounded-xl" />
      </div>
      
      <div className="w-full max-w-[460px] relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center mb-12"
        >
          <Link href="/" className="group flex flex-col items-center gap-4">
            <div className="w-12 h-12 bg-white/[0.03] border border-white/[0.08] rounded-2xl flex items-center justify-center shadow-2xl group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all duration-500">
              <ShoppingBag className="text-blue-500 group-hover:scale-110 transition-transform duration-500" size={24} />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">HacooUltra</span>
          </Link>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/40 backdrop-blur-3xl border border-white/[0.06] rounded-[2.5rem] p-10 md:p-12 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.8)]"
        >
          <div className="text-center mb-10">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-3 tracking-tight">
              Recuperar <span className="text-blue-500">Cuenta</span>
            </h1>
            <p className="text-zinc-500 text-sm font-medium leading-relaxed">
              Introduce tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-red-500/[0.03] border border-red-500/20 text-red-400 text-xs font-semibold p-4 rounded-2xl mb-8 flex items-center gap-3"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-emerald-500/[0.03] border border-emerald-500/20 text-emerald-400 text-xs font-semibold p-4 rounded-2xl mb-8 flex items-center gap-3"
              >
                <CheckCircle2 size={16} />
                ¡Email enviado! Revisa tu bandeja de entrada.
              </motion.div>
            )}
          </AnimatePresence>

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="input-group">
                <label className="input-label">Email</label>
                <div className="input-wrapper">
                  <Mail size={18} className="icon" />
                  <input
                    type="email"
                    placeholder="ejemplo@correo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 disabled:opacity-50 text-white rounded-2xl font-bold text-base flex items-center justify-center gap-3 transition-all shadow-xl shadow-blue-600/20 active:scale-[0.98]"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : (
                  <>
                    <span className="uppercase tracking-[0.1em] text-sm">Enviar enlace</span>
                    <ChevronRight size={18} className="opacity-50" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="text-center">
              <p className="text-zinc-400 text-sm mb-8">
                Si no recibes el correo en unos minutos, revisa tu carpeta de spam.
              </p>
              <button 
                onClick={() => setSuccess(false)}
                className="text-blue-500 font-bold hover:underline"
              >
                Intentar con otro email
              </button>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link 
              href="/auth" 
              className="footer-link-secondary inline-flex"
            >
              <ArrowLeft size={14} />
              Volver al login
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
