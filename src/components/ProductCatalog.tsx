"use client";

import { useState, useMemo } from "react";
import { products } from "@/data/products";
import ProductCard from "./ProductCard";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "@/context/LanguageContext";
import { Search, Filter, ChevronDown, ChevronUp, X } from "lucide-react";


export default function ProductCatalog() {
  const { t } = useLanguage();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Todos");
  const [activeBrand, setActiveBrand] = useState("Todas");
  const [showFilters, setShowFilters] = useState(false);

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map((p) => p.category)));
    return ["Todos", ...cats];
  }, []);

  const brands = useMemo(() => {
    const brs = Array.from(new Set(products.map((p) => p.brand)));
    return ["Todas", ...brs];
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const searchLower = search.toLowerCase();
      const matchesSearch =
        p.name.toLowerCase().includes(searchLower) ||
        p.brand.toLowerCase().includes(searchLower) ||
        p.category.toLowerCase().includes(searchLower);

      const matchesCategory =
        activeCategory === "Todos" || p.category === activeCategory;

      const matchesBrand =
        activeBrand === "Todas" || p.brand === activeBrand;

      return matchesSearch && matchesCategory && matchesBrand;
    });
  }, [search, activeCategory, activeBrand]);

  return (
    <section id="catalogo" className="py-20">
      <div className="mb-16">
        <h2 className="text-3xl md:text-5xl font-black mb-6 tracking-tighter uppercase italic">
          {t("catalog.title")} <span className="text-blue-500">Ultra</span>
        </h2>
        <p className="text-zinc-400 text-lg max-w-3xl leading-relaxed">
          {t("catalog.subtitle")}
        </p>
      </div>

      {/* Search & Filter Toggle Row */}
      <div className="flex flex-col md:flex-row gap-4 mb-12">
        <div className="relative flex-grow flex items-center gap-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl px-6 py-1 group focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all shadow-inner">
          <Search size={24} className="text-zinc-500 group-focus-within:text-blue-500 transition-colors flex-shrink-0" />
          <input
            type="text"
            placeholder={t("catalog.search")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none text-white py-4 focus:outline-none text-lg"
          />
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center justify-center gap-3 px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm transition-all border ${showFilters
              ? "bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20"
              : "bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
            }`}
        >
          <Filter size={18} />
          {t("catalog.filters")}
          {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>

      {/* Collapsible Filters Section */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden mb-12"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 p-8 bg-zinc-900/30 border border-zinc-800/50 rounded-2xl">
              {/* Category Filter */}
              <div>
                <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-zinc-800"></span>
                  {t("catalog.categories")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeCategory === cat
                          ? "bg-white text-black shadow-lg"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        }`}
                    >
                      {cat === "Todos" ? t("catalog.all") : cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Brand Filter */}
              <div>
                <h3 className="text-zinc-500 text-xs font-black uppercase tracking-widest mb-6 flex items-center gap-2">
                  <span className="w-8 h-[1px] bg-zinc-800"></span>
                  {t("catalog.brands")}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {brands.map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setActiveBrand(brand)}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all ${activeBrand === brand
                          ? "bg-white text-black shadow-lg"
                          : "bg-zinc-900 border border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-white"
                        }`}
                    >
                      {brand === "Todas" ? t("catalog.allBrands") : brand}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Info */}
      <div className="flex justify-between items-center mb-12">
        <p className="text-zinc-500 text-sm font-bold uppercase tracking-widest">
          {t("catalog.showing")} <span className="text-white text-base">{filtered.length}</span> {t("catalog.products")}
        </p>
        {(activeCategory !== "Todos" || activeBrand !== "Todas" || search !== "") && (
          <button
            onClick={() => {
              setActiveCategory("Todos");
              setActiveBrand("Todas");
              setSearch("");
            }}
            className="flex items-center gap-2 text-red-500 text-xs font-black uppercase tracking-widest hover:text-red-400 transition-colors group"
          >
            <X size={14} className="group-hover:rotate-90 transition-transform" />
            {t("catalog.clear")}
          </button>
        )}
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          <AnimatePresence mode="popLayout">
            {filtered.map((product, index) => (
              <div key={product.id || index} className="contents">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <ProductCard product={product} />
                </motion.div>
                

              </div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="py-40 text-center bg-zinc-900/20 border border-dashed border-zinc-800 rounded-[40px]">
          <div className="mb-6 inline-flex items-center justify-center w-24 h-24 rounded-xl bg-zinc-900 text-zinc-700">
            <Search size={40} />
          </div>
          <p className="text-white text-2xl font-black mb-3">{t("catalog.empty")}</p>
          <p className="text-zinc-500 max-w-sm mx-auto">{t("catalog.empty_desc")}</p>
        </div>
      )}
      

    </section>
  );
}
