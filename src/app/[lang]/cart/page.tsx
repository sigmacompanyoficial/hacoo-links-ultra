"use client";

import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import Image from "next/image";
import { useLanguage } from "@/context/LanguageContext";
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowLeft, 
  ExternalLink,
  ShieldCheck,
  Zap,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AdBanner from "@/components/AdBanner";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQuantity, cartCount, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();

  if (!user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-zinc-900 rounded-xl flex items-center justify-center mx-auto mb-8 border border-zinc-800 shadow-2xl">
            <ShoppingBag size={40} className="text-zinc-600" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">Acceso Restringido</h1>
          <p className="text-zinc-500 mb-8 font-medium">
            Inicia sesión para guardar tus productos favoritos y verlos más tarde.
          </p>
          <Link href="/auth" className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg flex items-center justify-center hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20">
            Iniciar Sesión
          </Link>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-blue-500/10 rounded-xl flex items-center justify-center mx-auto mb-8 border border-blue-500/20">
            <ShoppingBag size={40} className="text-blue-500" />
          </div>
          <h1 className="text-3xl font-black text-white mb-4 tracking-tighter uppercase italic">{t("cart.empty")}</h1>
          <p className="text-zinc-500 mb-8 font-medium leading-relaxed">
            Explora nuestro catálogo y añade los productos que más te gusten a tu lista personal.
          </p>
          <Link href="/products" className="w-full bg-zinc-900 text-white py-5 rounded-2xl font-black text-lg border border-zinc-800 flex items-center justify-center hover:bg-zinc-800 transition-all">
            {t("hero.cta")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-12 pb-20 bg-[#080808]">
      <div className="container">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter uppercase italic mb-4">
              Mis <span className="text-blue-500">Favoritos</span>
            </h1>
            <p className="text-zinc-500 text-lg font-bold">
              Tienes <span className="text-white">{cartCount}</span> {cartCount === 1 ? "artículo guardado" : "artículos guardados"}
            </p>
          </div>
          <button 
            onClick={() => clearCart()}
            className="w-fit flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500/10 text-red-500 border border-red-500/20 text-xs font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
          >
            <Trash2 size={14} />
            Vaciar lista
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Saved Items List */}
          <div className="lg:col-span-8 space-y-6">
            <AnimatePresence mode="popLayout">
              {cartItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-8 hover:border-zinc-700 transition-all hover:shadow-2xl hover:shadow-black/50"
                >
                  <div className="relative w-full sm:w-40 aspect-square rounded-2xl overflow-hidden bg-zinc-800 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-110 duration-500"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white text-[8px] font-black uppercase px-2 py-1 rounded shadow-lg flex items-center gap-1">
                        <Tag size={8} />
                        Hacoo
                      </span>
                    </div>
                  </div>

                  <div className="flex-grow flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <span className="text-blue-500 text-[10px] font-black uppercase tracking-widest mb-1 block">
                            {item.category}
                          </span>
                          <h3 className="text-white font-bold text-2xl leading-tight group-hover:text-blue-400 transition-colors italic">
                            {item.name}
                          </h3>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-zinc-700 hover:text-red-500 transition-colors p-2 bg-zinc-800/50 rounded-lg"
                          title="Eliminar de favoritos"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4 mb-6">
                        <div className="flex items-center bg-zinc-950 border border-zinc-800 rounded-xl p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="w-10 text-center text-white font-black text-base">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-2 text-zinc-500 hover:text-white transition-colors"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <div className="h-8 w-[1px] bg-zinc-800" />
                        <div>
                          <p className="text-white font-black text-2xl">{(item.price * item.quantity).toFixed(2)}€</p>
                          <p className="text-zinc-600 text-xs font-bold uppercase tracking-widest">{item.price.toFixed(2)}€ / UD</p>
                        </div>
                      </div>
                    </div>

                    <a 
                      href={item.affiliateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white text-black py-4 rounded-xl font-black text-sm flex items-center justify-center gap-3 hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5 active:scale-[0.98]"
                    >
                      <ExternalLink size={18} />
                      COMPRAR EN HACOO
                    </a>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link 
              href="/products" 
              className="inline-flex items-center gap-3 text-zinc-500 hover:text-white transition-all font-black uppercase tracking-widest text-xs mt-8 group"
            >
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
              Volver al catálogo
            </Link>
          </div>

          {/* Summary Section */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
              {/* Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 blur-[60px] -z-10" />
              
              <h2 className="text-2xl font-black text-white tracking-tight mb-8 flex items-center gap-3">
                <ShoppingBag size={24} className="text-blue-500" />
                Resumen Lista
              </h2>
              
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Total Aproximado</span>
                  <span className="text-zinc-500 font-black text-xl line-through decoration-red-500/50">{(totalPrice * 1.5).toFixed(2)}€</span>
                </div>
                <div className="flex justify-between items-end">
                  <span className="text-white font-black text-sm uppercase tracking-widest">Ahorro Estimado</span>
                  <span className="text-green-500 font-black text-2xl">-{((totalPrice * 1.5) - totalPrice).toFixed(2)}€</span>
                </div>
                <div className="h-[2px] bg-zinc-800 my-6" />
                <div className="flex flex-col gap-1">
                  <span className="text-zinc-500 font-bold uppercase tracking-widest text-[10px]">Precio Total con Hacoo Ultra</span>
                  <span className="text-blue-500 text-5xl font-black tracking-tighter italic">{totalPrice.toFixed(2)}€</span>
                </div>
              </div>

              <div className="space-y-5 pt-8 border-t border-zinc-800">
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <ShieldCheck size={20} />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium leading-relaxed">Todos los enlaces son verificados para mayor seguridad</span>
                </div>
                <div className="flex items-center gap-4 group">
                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Zap size={20} />
                  </div>
                  <span className="text-xs text-zinc-400 font-medium leading-relaxed">Accede a precios de fábrica directos desde Hacoo</span>
                </div>
              </div>
              
              {/* Cart Page Ad */}
              <div className="mt-8">
                <AdBanner />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
