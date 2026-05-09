"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthContext";
import { supabase } from "@/lib/supabase";

interface FavoritesContextType {
  favorites: string[];
  toggleFavorite: (slug: string) => void;
  isFavorite: (slug: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage initially
  useEffect(() => {
    const saved = localStorage.getItem("hacoo-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Error parsing favorites", e);
      }
    }
  }, []);

  // Sync with Supabase if logged in
  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("favorites")
      .select("product_slug")
      .eq("user_id", user.id);
    
    if (!error && data) {
      const slugs = data.map(f => f.product_slug);
      setFavorites(slugs);
      localStorage.setItem("hacoo-favorites", JSON.stringify(slugs));
    }
  };

  const toggleFavorite = async (slug: string) => {
    const newFavorites = favorites.includes(slug)
      ? favorites.filter(f => f !== slug)
      : [...favorites, slug];
    
    setFavorites(newFavorites);
    localStorage.setItem("hacoo-favorites", JSON.stringify(newFavorites));

    if (user) {
      if (favorites.includes(slug)) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_slug", slug);
      } else {
        await supabase
          .from("favorites")
          .insert([{ user_id: user.id, product_slug: slug }]);
      }
    }
  };

  const isFavorite = (slug: string) => favorites.includes(slug);

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
}
