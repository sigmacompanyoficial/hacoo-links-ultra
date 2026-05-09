"use client";

import Link from "next/link";
import Image from "next/image";
import { ExternalLink, Tag, Star, Bookmark } from "lucide-react";
import { Product } from "@/types";
import { motion } from "framer-motion";

import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useLanguage } from "@/context/LanguageContext";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const { formatPrice, language } = useLanguage();
  
  const discount = Math.round(
    ((product.originalPrice - product.price) / product.originalPrice) * 100
  );

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (user) {
      addToCart(product);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative bg-[#0a0a0a] border border-white/[0.05] hover:border-blue-500/30 rounded-2xl overflow-hidden transition-all shadow-lg hover:shadow-blue-500/10 flex flex-col"
    >
      <Link href={`/${language}/product/${product.slug}`} className="flex flex-col h-full flex-grow">
        {/* Image Container */}
        <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#111111]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority={priority}
          />
          
          {/* Overlay Gradient for readability if needed */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
            {product.isExclusive && (
              <span className="bg-white/95 backdrop-blur-md text-black text-[9px] font-black uppercase px-2.5 py-1.5 rounded-md flex items-center gap-1.5 shadow-xl">
                <Tag size={10} className="fill-current" />
                Exclusivo
              </span>
            )}
            <span className="bg-blue-600 text-white text-[10px] font-black uppercase px-2.5 py-1.5 rounded-md shadow-xl w-max">
              -{discount}%
            </span>
          </div>

          {/* Quick Action (Bookmark) Overlay */}
          <div className="absolute top-4 right-4 z-10 translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
            <button
              onClick={handleAddToCart}
              className={`w-10 h-10 rounded-xl flex items-center justify-center backdrop-blur-md shadow-xl transition-all ${
                user ? "bg-white/10 text-white hover:bg-blue-600 hover:text-white" : "bg-black/40 text-zinc-400 cursor-not-allowed"
              }`}
              title={user ? "Guardar favorito" : "Inicia sesión para guardar"}
            >
              <Bookmark size={18} className={user ? "fill-current/20" : ""} />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow bg-gradient-to-b from-transparent to-[#050505]">
          
          <div className="flex justify-between items-start mb-3 gap-2">
            <div className="flex flex-col min-w-0">
              <span className="text-blue-500 text-[9px] font-black uppercase tracking-[0.2em] mb-1 truncate">
                {product.category}
              </span>
              <h3 className="text-white font-bold text-[15px] leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                {product.name}
              </h3>
            </div>
          </div>

          <div className="mt-auto pt-4 flex items-end justify-between border-t border-white/[0.03]">
            <div className="flex flex-col">
              <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">Precio Ultra</span>
              <div className="flex items-baseline gap-2">
                <span className="text-white text-xl font-black">{formatPrice(product.price)}</span>
                <span className="text-zinc-600 text-xs line-through font-medium">{formatPrice(product.originalPrice)}</span>
              </div>
            </div>
            
            <div className="flex items-center gap-1.5 bg-white/5 px-2 py-1 rounded-lg">
              <Star size={12} className="fill-yellow-500 text-yellow-500" />
              <span className="text-[11px] text-zinc-300 font-bold">{product.rating}</span>
            </div>
          </div>
          
        </div>
      </Link>
    </motion.div>
  );
}
