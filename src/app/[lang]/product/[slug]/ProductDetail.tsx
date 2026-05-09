"use client";

import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Star,
  ExternalLink,
  Tag,
  ShieldCheck,
  Truck,
  Copy,
  Check,
  Clock,
  ChevronRight,
} from "lucide-react";
import { Product } from "@/types";
import { useState } from "react";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";
import DeviceWarningModal from "@/components/DeviceWarningModal";


interface ProductDetailProps {
  product: Product;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice } = useLanguage();
  const [copied, setCopied] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleCopyCoupon = () => {
    navigator.clipboard.writeText("ULTRA14");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-24 pb-16 bg-[#080808]">
      <div className="container mx-auto px-6">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-xs md:text-sm text-zinc-500 mb-8 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-white transition-colors">Inicio</Link>
          <ChevronRight size={14} />
          <Link href="/products" className="hover:text-white transition-colors">Catálogo</Link>
          <ChevronRight size={14} />
          <span className="text-zinc-300 font-medium">{product.category}</span>
          <ChevronRight size={14} />
          <span className="text-blue-500 font-bold truncate">Estilo similar {product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Image Section */}
          <div className="lg:col-span-7 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-square rounded-[2rem] overflow-hidden bg-[#111111] border border-zinc-800 shadow-2xl group"
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover transition-transform duration-700 group-hover:scale-110"
                priority
              />
              <div className="absolute top-6 left-6 flex flex-col gap-3">
                <span className="bg-blue-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow-xl backdrop-blur-md">
                  -{discount}% OFF
                </span>
                {product.isExclusive && (
                  <span className="bg-white text-black text-xs font-black px-4 py-2 rounded-xl shadow-xl flex items-center gap-2">
                    <Tag size={14} />
                    EXCLUSIVE
                  </span>
                )}
              </div>
            </motion.div>
          </div>

          {/* Right: Info Section */}
          <div className="lg:col-span-5 flex flex-col">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <span className="text-blue-500 font-black text-sm tracking-[0.2em] uppercase mb-4 block">
                {product.category}
              </span>
              <div className="mb-4">
                <span className="text-blue-500 font-black text-sm tracking-[0.2em] uppercase block mb-2">
                  Estilo similar a
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white leading-[0.9] tracking-tighter">
                  {product.name}
                </h1>
              </div>

              <div className="flex items-center gap-6 mb-8">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.floor(product.rating) ? "fill-yellow-500 text-yellow-500" : "text-zinc-700"}
                    />
                  ))}
                  <span className="ml-2 text-white font-bold">{product.rating}</span>
                </div>
                <div className="h-4 w-[1px] bg-zinc-800" />
                <span className="text-zinc-500 font-medium text-sm underline underline-offset-4 decoration-zinc-700 cursor-pointer hover:text-white transition-colors">
                  {product.reviews} reseñas verificadas
                </span>
              </div>

              <div className="flex items-baseline gap-4 mb-8">
                <span className="text-5xl font-black text-white">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xl text-zinc-600 line-through font-bold">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="bg-green-500/10 text-green-500 text-xs font-black px-3 py-1 rounded-lg border border-green-500/20">
                  ¡OFERTA TOP!
                </span>
              </div>

              <p className="text-zinc-400 text-lg leading-relaxed mb-10 pb-8 border-b border-zinc-800">
                {product.description}
              </p>

              {/* Coupon Box */}
              <div className="bg-[#141416] border-2 border-dashed border-zinc-800 rounded-2xl p-6 mb-10 group hover:border-blue-500/50 transition-colors relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                      <Tag size={20} />
                    </div>
                    <div>
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">Código Descuento</span>
                      <p className="text-white font-bold">Extra 15% OFF</p>
                    </div>
                  </div>
                  <button
                    onClick={handleCopyCoupon}
                    className="flex items-center gap-2 bg-zinc-800 hover:bg-white hover:text-black text-white px-4 py-2 rounded-xl text-sm font-bold transition-all"
                  >
                    {copied ? <Check size={16} /> : <Copy size={16} />}
                    {copied ? "COPIADO" : "ULTRA14"}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                  <Clock size={12} />
                  <span>VÁLIDO SOLO POR TIEMPO LIMITADO</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="flex flex-col gap-4 mb-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    onClick={() => addToCart(product)}
                    disabled={!user}
                    className={`w-full py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all ${user
                        ? "bg-zinc-800 hover:bg-zinc-700 text-white cursor-pointer"
                        : "bg-zinc-900 text-zinc-700 cursor-not-allowed opacity-50"
                      }`}
                  >
                    <Truck size={24} />
                    AÑADIR CESTA
                  </button>
                  <button
                    onClick={(e) => {
                      if (window.innerWidth >= 1024) {
                        e.preventDefault();
                        setIsModalOpen(true);
                      } else {
                        window.open(product.affiliateUrl, '_blank');
                      }
                    }}
                    className="w-full bg-blue-600 hover:bg-blue-500 text-white py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/20 transition-all active:scale-[0.98]"
                  >
                    <ExternalLink size={24} />
                    COMPRAR
                  </button>
                </div>
                {!user && (
                  <p className="text-center text-blue-500 text-xs font-bold bg-blue-500/10 py-2 rounded-lg">
                    Debes iniciar sesión para usar la cesta
                  </p>
                )}
                <p className="text-center text-zinc-500 text-[10px] font-bold uppercase tracking-widest mt-2">
                  Enlace directo a la oferta oficial verificada
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <DeviceWarningModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
}
