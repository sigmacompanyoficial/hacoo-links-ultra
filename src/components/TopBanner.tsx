"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import { supabase } from "@/lib/supabase";

const fakeUsers = [
  "ayo***03@gmail.com",
  "mar***89@hotmail.com",
  "car***22@yahoo.es",
  "lau***91@gmail.com",
  "ped***45@outlook.com",
  "sof***77@gmail.com",
  "dav***12@hotmail.com",
  "ana***55@yahoo.com",
  "mig***88@gmail.com",
  "luc***34@outlook.es"
];

const actions = [
  "se ha unido!!! 🎉",
  "ha usado el código ULTRA14 🚀",
  "acaba de comprar 🛍️",
  "ha ahorrado un 14% extra 💸",
  "se ha registrado 🎊"
];

export default function TopBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayUsers, setDisplayUsers] = useState<string[]>(fakeUsers);

  useEffect(() => {
    const fetchRealUsers = async () => {
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("email")
          .limit(30);

        if (data && !error && data.length > 0) {
          const realMails = data
            .map((p) => p.email)
            .filter((e) => e && typeof e === "string")
            .map((email) => {
              const parts = email.split("@");
              if (parts.length === 2) {
                const name = parts[0];
                const domain = parts[1];
                if (name.length >= 3) {
                  // Mask email properly to protect privacy
                  return `${name.substring(0, 3)}***@${domain}`;
                }
              }
              return email;
            });

          if (realMails.length > 0) {
            // Mix real ones at the front
            setDisplayUsers((prev) => Array.from(new Set([...realMails, ...prev])));
          }
        }
      } catch (err) {
        // Ignore errors if RLS blocks it, fallback to fakeUsers
        console.error("Error fetching recent users:", err);
      }
    };

    fetchRealUsers();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % displayUsers.length);
    }, 4500); // Change every 4.5 seconds
    return () => clearInterval(interval);
  }, [displayUsers.length]);

  const user = displayUsers[currentIndex] || fakeUsers[0];
  // Pseudo-random action based on the user index
  const action = actions[currentIndex % actions.length];

  return (
    <div className="bg-blue-600 text-white text-[10px] md:text-xs font-bold px-4 flex items-center justify-center gap-2 overflow-hidden w-full relative z-[1001] h-[32px]">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="flex items-center gap-2 text-center whitespace-nowrap"
        >
          <span className="opacity-90">{user} {action}</span>
          <span className="hidden md:inline mx-2 opacity-50">|</span>
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded text-[10px] md:text-xs font-black uppercase tracking-widest border border-yellow-300 hidden sm:inline-block shadow-[0_0_15px_rgba(250,204,21,0.6)] animate-pulse">
            CÓDIGO: ULTRA14
          </span>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
