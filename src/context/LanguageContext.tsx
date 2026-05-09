"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "es" | "en" | "fr" | "de" | "pt";
type Currency = "EUR" | "USD" | "GBP";
type Region = "ES" | "US" | "UK" | "FR" | "DE";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  currency: Currency;
  setCurrency: (curr: Currency) => void;
  region: Region;
  setRegion: (reg: Region) => void;
  t: (key: string) => string;
  formatPrice: (price: number) => string;
}

const translations = {
  es: {
    "nav.start": "Inicio",
    "nav.catalog": "Catálogo",
    "nav.cart": "Favoritos",
    "hero.title": "Ofertas Exclusivas de",
    "hero.subtitle": "Descubre los mejores productos de Hacoo con hasta un 90% de descuento. Calidad verificada por nuestra comunidad.",
    "hero.cta": "Explorar Catálogo",
    "hero.telegram": "Unirse al Telegram",
    "catalog.title": "Catálogo",
    "catalog.subtitle": "Explora nuestra selección curada de los mejores productos. Filtra para encontrar lo que buscas.",
    "catalog.search": "Buscar por nombre, marca o categoría...",
    "catalog.filters": "Filtros",
    "catalog.categories": "Categorías",
    "catalog.brands": "Marcas",
    "catalog.all": "Todos",
    "catalog.allBrands": "Todas",
    "catalog.showing": "Mostrando",
    "catalog.products": "productos",
    "catalog.clear": "Limpiar filtros",
    "catalog.empty": "No se encontraron productos",
    "catalog.empty_desc": "Intenta ajustar tus filtros o buscar términos más generales.",
    "cart.title": "Favoritos",
    "cart.empty": "Tu lista está vacía",
    "footer.desc": "La plataforma definitiva para encontrar los mejores productos de Hacoo con descuentos imbatibles.",
    "footer.explore": "Explorar",
    "footer.legal": "Legal",
    "footer.community": "Comunidad",
    "settings.success": "Perfil actualizado correctamente",
    "settings.error": "Error al actualizar",
    "settings.reset_sent": "Enlace de restablecimiento enviado",
  },
  en: {
    "nav.start": "Home",
    "nav.catalog": "Catalog",
    "nav.cart": "Favorites",
    "hero.title": "Exclusive Deals from",
    "hero.subtitle": "Discover the best Hacoo products with up to 90% discount. Quality verified by our community.",
    "hero.cta": "Explore Catalog",
    "hero.telegram": "Join Telegram",
    "catalog.title": "Catalog",
    "catalog.subtitle": "Explore our curated selection of the best products. Filter to find what you're looking for.",
    "catalog.search": "Search by name, brand or category...",
    "catalog.filters": "Filters",
    "catalog.categories": "Categories",
    "catalog.brands": "Brands",
    "catalog.all": "All",
    "catalog.allBrands": "All Brands",
    "catalog.showing": "Showing",
    "catalog.products": "products",
    "catalog.clear": "Clear filters",
    "catalog.empty": "No products found",
    "catalog.empty_desc": "Try adjusting your filters or searching for more general terms.",
    "cart.title": "Favorites",
    "cart.empty": "Your list is empty",
    "footer.desc": "The ultimate platform to find the best Hacoo products with unbeatable discounts.",
    "footer.explore": "Explore",
    "footer.legal": "Legal",
    "footer.community": "Community",
    "settings.success": "Profile updated successfully",
    "settings.error": "Error updating profile",
    "settings.reset_sent": "Reset link sent",
  },
  fr: {
    "nav.start": "Accueil",
    "nav.catalog": "Catalogue",
    "nav.cart": "Favoris",
    "hero.title": "Offres Exclusives de",
    "hero.subtitle": "Découvrez les meilleurs produits Hacoo avec jusqu'à 90% de réduction. Qualité vérifiée par notre communauté.",
    "hero.cta": "Explorer le Catalogue",
    "hero.telegram": "Rejoindre Telegram",
    "catalog.title": "Catalogue",
    "catalog.subtitle": "Explorez notre sélection organisée des meilleurs produits. Filtrez pour trouver ce que vous cherchez.",
    "catalog.search": "Rechercher par nom, marque ou catégorie...",
    "catalog.filters": "Filtres",
    "catalog.categories": "Catégories",
    "catalog.brands": "Marques",
    "catalog.all": "Tous",
    "catalog.allBrands": "Toutes",
    "catalog.showing": "Affichage de",
    "catalog.products": "produits",
    "catalog.clear": "Effacer les filtres",
    "catalog.empty": "Aucun produit trouvé",
    "catalog.empty_desc": "Essayez d'ajuster vos filtres ou de rechercher des termes plus généraux.",
    "cart.title": "Favoris",
    "cart.empty": "Votre lista est vide",
    "footer.desc": "La plateforme ultime pour trouver les meilleurs produits Hacoo avec des remises imbattables.",
    "footer.explore": "Explorer",
    "footer.legal": "Légal",
    "footer.community": "Communauté",
    "settings.success": "Profil mis à jour avec succès",
    "settings.error": "Erreur lors de la mise à jour",
    "settings.reset_sent": "Lien de réinitialisation envoyé",
  },
  de: {
    "nav.start": "Startseite",
    "nav.catalog": "Katalog",
    "nav.cart": "Favoriten",
    "hero.title": "Exklusive Angebote von",
    "hero.subtitle": "Entdecken Sie die besten Hacoo-Produkte mit bis zu 90% Rabatt. Qualität von unserer Community geprüft.",
    "hero.cta": "Katalog erkunden",
    "hero.telegram": "Telegram beitreten",
    "catalog.title": "Katalog",
    "catalog.subtitle": "Entdecken Sie unsere kuratierte Auswahl der besten Produkte. Filtern Sie, um das zu finden, was Sie suchen.",
    "catalog.search": "Suche nach Name, Marke oder Kategorie...",
    "catalog.filters": "Filter",
    "catalog.categories": "Kategorien",
    "catalog.brands": "Marken",
    "catalog.all": "Alle",
    "catalog.allBrands": "Alle Marken",
    "catalog.showing": "Anzeige von",
    "catalog.products": "Produkten",
    "catalog.clear": "Filter löschen",
    "catalog.empty": "Keine Produkte gefunden",
    "catalog.empty_desc": "Versuchen Sie, Ihre Filter anzupassen oder nach allgemeineren Begriffen zu suchen.",
    "cart.title": "Favoriten",
    "cart.empty": "Ihre Liste ist leer",
    "footer.desc": "Die ultimative Plattform, um die besten Hacoo-Produkte mit unschlagbaren Rabatten zu finden.",
    "footer.explore": "Erkunden",
    "footer.legal": "Rechtliches",
    "footer.community": "Gemeinschaft",
    "settings.success": "Profil erfolgreich aktualisiert",
    "settings.error": "Fehler beim Aktualisieren",
    "settings.reset_sent": "Reset-Link gesendet",
  },
  pt: {
    "nav.start": "Início",
    "nav.catalog": "Catálogo",
    "nav.cart": "Favoritos",
    "hero.title": "Ofertas Exclusivas da",
    "hero.subtitle": "Descubra os melhores productos Hacoo com até 90% de desconto. Qualidade verificada pela nossa comunidade.",
    "hero.cta": "Explorar Catálogo",
    "hero.telegram": "Entrar no Telegram",
    "catalog.title": "Catálogo",
    "catalog.subtitle": "Explore nossa seleção curada dos melhores produtos. Filtre para encontrar o que procura.",
    "catalog.search": "Buscar por nome, marca o categoria...",
    "catalog.filters": "Filtros",
    "catalog.categories": "Categorias",
    "catalog.brands": "Marcas",
    "catalog.all": "Todos",
    "catalog.allBrands": "Todas as Marcas",
    "catalog.showing": "Mostrando",
    "catalog.products": "produtos",
    "catalog.clear": "Limpar filtros",
    "catalog.empty": "Nenhum producto encontrado",
    "catalog.empty_desc": "Tente ajustar seus filtros ou buscar termos más gerais.",
    "cart.title": "Favoritos",
    "cart.empty": "Sua lista está vazia",
    "footer.desc": "A plataforma definitiva para encontrar os melhores produtos Hacoo com descontos imbatíveis.",
    "footer.explore": "Explorar",
    "footer.legal": "Legal",
    "footer.community": "Comunidade",
    "settings.success": "Perfil atualizado com sucesso",
    "settings.error": "Erro ao atualizar",
    "settings.reset_sent": "Link de redefinição enviado",
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ 
  children, 
  initialLang 
}: { 
  children: React.ReactNode;
  initialLang?: Language;
}) {
  const [language, setLanguageState] = useState<Language>(initialLang || "es");
  const [currency, setCurrencyState] = useState<Currency>("EUR");
  const [region, setRegionState] = useState<Region>("ES");

  useEffect(() => {
    const savedCurrency = localStorage.getItem("hacoo-currency") as Currency;
    const savedRegion = localStorage.getItem("hacoo-region") as Region;
    if (savedCurrency) setCurrencyState(savedCurrency);
    if (savedRegion) setRegionState(savedRegion);
    
    if (initialLang) {
      setLanguageState(initialLang);
      localStorage.setItem("hacoo-lang", initialLang);
      document.cookie = `hacoo-lang=${initialLang}; path=/; max-age=31536000`;
    }
  }, [initialLang]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("hacoo-lang", lang);
    document.cookie = `hacoo-lang=${lang}; path=/; max-age=31536000`;
    
    if (typeof window !== "undefined") {
      const pathname = window.location.pathname;
      const segments = pathname.split("/");
      segments[1] = lang;
      window.location.href = segments.join("/");
    }
  };

  const setCurrency = (curr: Currency) => {
    setCurrencyState(curr);
    localStorage.setItem("hacoo-currency", curr);
  };

  const setRegion = (reg: Region) => {
    setRegionState(reg);
    localStorage.setItem("hacoo-region", reg);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations["es"]] || key;
  };

  const formatPrice = (price: number): string => {
    // Conversion factors (simplified for demo)
    let convertedPrice = price;
    if (currency === "USD") convertedPrice = price * 1.08;
    if (currency === "GBP") convertedPrice = price * 0.86;

    const symbols = {
      EUR: "€",
      USD: "$",
      GBP: "£"
    };

    const isAfter = currency === "EUR" || currency === "GBP";
    const symbol = symbols[currency];

    return isAfter 
      ? `${convertedPrice.toFixed(2)}${symbol}` 
      : `${symbol}${convertedPrice.toFixed(2)}`;
  };

  return (
    <LanguageContext.Provider value={{ 
      language, 
      setLanguage, 
      currency, 
      setCurrency, 
      region, 
      setRegion, 
      t,
      formatPrice
    }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
