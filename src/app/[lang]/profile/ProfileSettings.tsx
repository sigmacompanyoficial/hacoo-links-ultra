"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  User, 
  Mail, 
  Camera, 
  Save, 
  Trash2, 
  Globe, 
  Shield, 
  LogOut,
  AlertTriangle,
  Settings,
  Lock,
  RefreshCw,
  Heart,
  ExternalLink,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { useFavorites } from "@/context/FavoritesContext";
import { products } from "@/data/products";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function ProfileSettings() {
  const { user, profile, logout } = useAuth();
  const { 
    language, 
    setLanguage, 
    currency, 
    setCurrency, 
    region, 
    setRegion, 
    t 
  } = useLanguage();
  const { favorites, toggleFavorite } = useFavorites();
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [activeTab, setActiveTab] = useState<"profile" | "favorites" | "settings">("profile");
  
  // Email Change State
  const [newEmail, setNewEmail] = useState("");
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  
  if (!user) return null;

  const favoriteProducts = products.filter(p => favorites.includes(p.slug));

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          display_name: (e.target as any).display_name.value
        })
        .eq("id", user.id);
      
      if (error) throw error;
      setSuccessMsg(t("settings.success"));
    } catch (err: any) {
      setSuccessMsg(t("settings.error"));
    } finally {
      setIsUpdating(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });
      if (error) throw error;
      setSuccessMsg("Enlace de recuperación enviado al correo.");
    } catch (err: any) {
      setSuccessMsg("Error al enviar el enlace.");
    } finally {
      setIsUpdating(false);
      setTimeout(() => setSuccessMsg(""), 3000);
    }
  };

  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail || newEmail === user.email) return;
    setIsUpdatingEmail(true);
    try {
      const { error } = await supabase.auth.updateUser({ email: newEmail });
      if (error) throw error;
      setSuccessMsg("Se ha enviado un enlace de confirmación a ambos correos.");
      setNewEmail("");
    } catch (err: any) {
      setSuccessMsg("Error al actualizar el correo.");
    } finally {
      setIsUpdatingEmail(false);
      setTimeout(() => setSuccessMsg(""), 4000);
    }
  };

  return (
    <div className="w-full flex flex-col items-center min-h-screen">
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-blue-600/[0.04] blur-[140px] pointer-events-none rounded-xl z-0" />
      
      <div className="w-full max-w-5xl relative z-10 flex flex-col items-center py-12 px-6">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16 w-full"
        >
          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase italic italic">
            PANEL <span className="text-blue-500">DE CONTROL</span>
          </h1>
          
          {/* Custom Tab Navigation */}
          <div className="flex items-center justify-center gap-2 p-1.5 bg-zinc-900/40 backdrop-blur-xl border border-white/5 rounded-2xl w-fit mx-auto">
            {[
              { id: "profile", label: "Perfil", icon: User },
              { id: "favorites", label: "Favoritos", icon: Heart },
              { id: "settings", label: "Ajustes", icon: Settings },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === tab.id 
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" 
                  : "text-zinc-500 hover:text-white hover:bg-white/5"
                }`}
              >
                <tab.icon size={16} />
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </motion.div>

        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeTab === "profile" && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10"
              >
                {/* Profile Card */}
                <div className="bg-[#0c0c0c] border border-white/[0.05] rounded-3xl p-10 md:p-16 shadow-2xl overflow-hidden relative group">
                  {/* Decorative Gradient */}
                  <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-blue-600/5 blur-[100px] -mr-48 -mt-48 rounded-full transition-opacity group-hover:opacity-100 opacity-50" />
                  
                  <div className="relative z-10 flex flex-col md:flex-row gap-16">
                    {/* Avatar Section */}
                    <div className="flex flex-col items-center gap-8 min-w-[200px]">
                      <div className="relative">
                        <div className="w-48 h-48 rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden flex items-center justify-center p-1 shadow-2xl">
                          <div className="w-full h-full rounded-xl bg-[#080808] overflow-hidden flex items-center justify-center">
                            {profile?.photoURL ? (
                              <img src={profile.photoURL} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <User size={72} className="text-zinc-800" />
                            )}
                          </div>
                        </div>
                        <button className="absolute -bottom-3 -right-3 w-14 h-14 bg-blue-600 hover:bg-blue-500 rounded-xl flex items-center justify-center text-white border-4 border-[#0c0c0c] shadow-xl transition-all hover:scale-110 active:scale-95">
                          <Camera size={20} />
                        </button>
                      </div>
                      <div className="text-center space-y-2">
                        <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                          {profile?.displayName || "Usuario"}
                        </h2>
                        <p className="text-zinc-500 font-bold text-xs uppercase tracking-widest">{user.email}</p>
                      </div>
                    </div>

                    {/* Forms Section */}
                    <div className="flex-1 space-y-16">
                      {/* Name Form */}
                      <div className="space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <User size={20} />
                          </div>
                          <h3 className="text-lg font-black text-white uppercase tracking-wider italic">Información Personal</h3>
                        </div>
                        
                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nombre Público</label>
                            <input 
                              name="display_name"
                              type="text" 
                              defaultValue={profile?.displayName || ""}
                              className="w-full h-16 bg-[#080808] border border-zinc-800 rounded-xl px-12 text-white font-bold focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/5 outline-none transition-all text-lg"
                              placeholder="Tu nombre"
                            />
                          </div>
                          <button 
                            disabled={isUpdating}
                            className="h-16 px-10 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-200 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                          >
                            <Save size={18} />
                            {isUpdating ? "GUARDANDO..." : "ACTUALIZAR PERFIL"}
                          </button>
                        </form>
                      </div>

                      {/* Email Form */}
                      <div className="pt-16 border-t border-white/5 space-y-8">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Mail size={20} />
                          </div>
                          <h3 className="text-lg font-black text-white uppercase tracking-wider italic">Cambiar Correo Electrónico</h3>
                        </div>

                        <form onSubmit={handleUpdateEmail} className="space-y-6">
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Nuevo Email</label>
                            <div className="relative group/input">
                              <input 
                                type="email" 
                                value={newEmail}
                                onChange={(e) => setNewEmail(e.target.value)}
                                className="w-full h-16 bg-[#080808] border border-zinc-800 rounded-xl pl-16 pr-8 text-white font-bold focus:border-orange-500/50 focus:ring-4 focus:ring-orange-500/5 outline-none transition-all text-lg"
                                placeholder="nuevo@correo.com"
                              />
                              <div className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-orange-500 transition-colors pointer-events-none">
                                <Mail size={22} />
                              </div>
                            </div>
                          </div>
                          <button 
                            disabled={isUpdatingEmail}
                            className="h-16 px-10 bg-zinc-900 text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 transition-all flex items-center justify-center gap-3 w-full md:w-auto"
                          >
                            <RefreshCw size={18} className={isUpdatingEmail ? "animate-spin" : ""} />
                            {isUpdatingEmail ? "PROCESANDO..." : "SOLICITAR CAMBIO"}
                          </button>
                          <div className="p-6 bg-orange-500/5 rounded-2xl border border-orange-500/10">
                            <p className="text-[11px] text-zinc-500 font-bold leading-loose flex items-start gap-3">
                              <span className="text-orange-500 font-black shrink-0">AVISO:</span>
                              Deberás confirmar el cambio en el enlace que enviaremos a tu correo actual y al nuevo para que sea efectivo por seguridad.
                            </p>
                          </div>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <button 
                    onClick={handlePasswordReset}
                    className="p-8 bg-[#0c0c0c] border border-white/5 rounded-3xl flex items-center gap-8 hover:border-blue-500/30 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:scale-110 transition-transform">
                      <Lock size={28} />
                    </div>
                    <div className="text-left">
                      <span className="block text-white font-black text-sm uppercase tracking-[0.1em] mb-1 italic">Seguridad</span>
                      <span className="block text-zinc-500 font-bold text-xs uppercase tracking-widest">Resetear contraseña</span>
                    </div>
                  </button>

                  <button 
                    onClick={logout}
                    className="p-8 bg-[#0c0c0c] border border-white/5 rounded-3xl flex items-center gap-8 hover:border-red-500/30 transition-all group"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                      <LogOut size={28} />
                    </div>
                    <div className="text-left">
                      <span className="block text-red-500 font-black text-sm uppercase tracking-[0.1em] mb-1 italic">Sesión</span>
                      <span className="block text-zinc-500 font-bold text-xs uppercase tracking-widest">Cerrar sesión actual</span>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === "favorites" && (
              <motion.div
                key="favorites"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="w-full"
              >
                <div className="bg-[#0c0c0c] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                  <div className="flex justify-between items-center mb-10">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <Heart size={20} fill="currentColor" />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Mis Favoritos</h3>
                    </div>
                    <span className="px-4 py-2 bg-blue-600/10 text-blue-500 border border-blue-500/20 rounded-xl text-[10px] font-black tracking-widest">{favoriteProducts.length} ITEMS</span>
                  </div>

                  {favoriteProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {favoriteProducts.map((product) => (
                        <div key={product.id} className="group bg-[#080808] border border-white/[0.03] rounded-3xl overflow-hidden hover:border-blue-500/30 transition-all shadow-xl">
                          <div className="aspect-square relative overflow-hidden">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            <button 
                              onClick={() => toggleFavorite(product.slug)}
                              className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-xl rounded-xl flex items-center justify-center text-red-500 shadow-2xl border border-white/5 hover:scale-110 transition-all"
                            >
                              <Heart size={18} fill="currentColor" />
                            </button>
                          </div>
                          <div className="p-5 bg-gradient-to-b from-[#0c0c0c] to-[#080808]">
                            <h4 className="text-white font-bold text-sm truncate mb-2 group-hover:text-blue-400 transition-colors">{product.name}</h4>
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col">
                                <span className="text-blue-500 font-black text-xl tracking-tighter">{product.price.toFixed(2)}€</span>
                                <span className="text-[9px] text-zinc-600 font-black uppercase">Precio Ultra</span>
                              </div>
                              <Link 
                                href={`/${language}/product/${product.slug}`}
                                className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 hover:bg-blue-600 hover:text-white hover:border-blue-500 transition-all shadow-lg"
                              >
                                <ExternalLink size={16} />
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-32 text-center border-2 border-dashed border-white/5 rounded-[2rem]">
                      <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center mx-auto mb-6 text-zinc-700">
                        <Heart size={32} />
                      </div>
                      <p className="text-zinc-500 font-black uppercase tracking-[0.2em] text-xs">No tienes favoritos aún</p>
                      <Link href={`/${language}/products`} className="mt-6 inline-block text-blue-500 font-black text-[10px] uppercase tracking-widest hover:underline">Ir a la tienda</Link>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                <div className="bg-[#0c0c0c] border border-white/[0.05] rounded-[2.5rem] p-8 md:p-12 shadow-2xl">
                  <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Globe size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Preferencia de Idioma</h3>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {[
                      { code: "es", label: "Español", flag: "🇪🇸" },
                      { code: "en", label: "English", flag: "🇺🇸" },
                      { code: "fr", label: "Français", flag: "🇫🇷" },
                      { code: "de", label: "Deutsch", flag: "🇩🇪" },
                      { code: "pt", label: "Português", flag: "🇵🇹" },
                    ].map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => setLanguage(lang.code as any)}
                        className={`p-6 rounded-[2rem] border transition-all flex flex-col items-center gap-4 relative overflow-hidden group ${
                          language === lang.code 
                          ? "bg-blue-600/10 border-blue-600 shadow-xl" 
                          : "bg-[#080808] border-zinc-800 hover:border-zinc-600"
                        }`}
                      >
                        {language === lang.code && (
                          <div className="absolute top-0 right-0 w-8 h-8 bg-blue-600 rounded-bl-2xl flex items-center justify-center">
                            <CheckCircle2 size={12} className="text-white" />
                          </div>
                        )}
                        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">{lang.flag}</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${language === lang.code ? "text-white" : "text-zinc-500"}`}>
                          {lang.label}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="mt-16 pt-16 border-t border-white/5">
                    <div className="flex items-center gap-4 mb-10">
                      <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                        <Shield size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Región de Compra</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { code: "ES", label: "España", currency: "EUR" },
                        { code: "US", label: "Estados Unidos", currency: "USD" },
                        { code: "UK", label: "Reino Unido", currency: "GBP" },
                        { code: "FR", label: "Francia", currency: "EUR" },
                        { code: "DE", label: "Alemania", currency: "EUR" },
                      ].map((reg) => (
                        <button
                          key={reg.code}
                          onClick={() => {
                            setRegion(reg.code as any);
                            setCurrency(reg.currency as any);
                          }}
                          className={`p-6 rounded-2xl border transition-all flex justify-between items-center group ${
                            region === reg.code 
                            ? "bg-emerald-600/10 border-emerald-600 shadow-xl" 
                            : "bg-[#080808] border-zinc-800 hover:border-zinc-600"
                          }`}
                        >
                          <div className="flex flex-col items-start">
                            <span className={`text-[10px] font-black uppercase tracking-widest ${region === reg.code ? "text-emerald-500" : "text-zinc-500"}`}>
                              {reg.label}
                            </span>
                            <span className="text-white font-bold text-xs mt-1">{reg.currency}</span>
                          </div>
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${region === reg.code ? 'border-emerald-500 bg-emerald-500' : 'border-zinc-800 group-hover:border-zinc-600'}`}>
                            {region === reg.code && <CheckCircle2 size={12} className="text-white" />}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mt-12 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10">
                    <p className="text-blue-400/70 text-[10px] font-bold uppercase tracking-[0.15em] text-center leading-loose">
                      * El idioma y la región se sincronizan para ofrecerte los mejores links de Hacoo disponibles en tu zona.
                    </p>
                  </div>
                </div>

                {/* Danger Zone */}
                <div className="bg-red-500/5 border border-red-500/10 rounded-[2.5rem] p-10 md:p-14 overflow-hidden relative group">
                  <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-red-500/10 blur-[60px] rounded-full group-hover:bg-red-500/20 transition-all" />
                  
                  <div className="relative z-10">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <Trash2 size={24} />
                      </div>
                      <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">Zona Peligrosa</h3>
                    </div>
                    <p className="text-zinc-500 text-sm font-medium mb-10 max-w-md leading-relaxed">
                      Eliminar tu cuenta es una acción irreversible. Perderás todos tus favoritos y configuraciones de forma permanente.
                    </p>
                    <button className="h-14 px-8 bg-red-600/10 text-red-500 border border-red-500/20 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all active:scale-95">
                      ELIMINAR MI CUENTA DEFINITIVAMENTE
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
