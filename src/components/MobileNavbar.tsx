"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingBag, User, Send } from "lucide-react";
import { motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";

import { useLanguage } from "@/context/LanguageContext";

export default function MobileNavbar() {
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { user } = useAuth();
  const { language } = useLanguage();

  const getPath = (path: string) => `/${language}${path === '/' ? '' : path}`;

  const navItems = [
    { icon: Home, label: "Inicio", href: "/" },
    { icon: Search, label: "Catálogo", href: "/products" },
    { icon: ShoppingBag, label: "Cesta", href: "/cart", count: cartCount },
    { icon: Send, label: "Telegram", href: "https://t.me/hacoolinkssigma", external: true },
    { icon: User, label: user ? "Perfil" : "Entrar", href: user ? "/profile" : "/auth" },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-[1000] px-4 pb-4 pt-2 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none">
      <nav className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-800 rounded-2xl flex items-center justify-around p-2 shadow-2xl pointer-events-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const href = item.external ? item.href : getPath(item.href);
          const isActive = pathname === href;
          
          const content = (
            <div className="relative flex flex-col items-center gap-1 p-2">
              <Icon 
                size={22} 
                className={`transition-colors ${isActive ? "text-blue-500" : "text-zinc-500"}`} 
              />
              <span className={`text-[10px] font-bold uppercase tracking-tight transition-colors ${isActive ? "text-blue-500" : "text-zinc-500"}`}>
                {item.label}
              </span>
              
              {item.count !== undefined && item.count > 0 && (
                <span className="absolute top-1 right-1 bg-blue-600 text-white text-[8px] font-black w-4 h-4 rounded-xl flex items-center justify-center border-2 border-zinc-900">
                  {item.count}
                </span>
              )}
              
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -bottom-1 w-1 h-1 bg-blue-500 rounded-xl"
                />
              )}
            </div>
          );

          if (item.external) {
            return (
              <a key={item.label} href={href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            );
          }

          return (
            <Link key={item.label} href={href}>
              {content}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
