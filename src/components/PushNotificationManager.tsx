"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X, CheckCircle2 } from "lucide-react";
import { requestForToken } from "@/lib/firebase-client";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

export default function PushNotificationManager() {
  const { t } = useLanguage();
  const [showPopup, setShowPopup] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    // Solo mostramos el popup si no ha tomado una decisión y no hemos preguntado antes (lo guardamos en localStorage)
    if (typeof window !== "undefined" && "Notification" in window) {
      setPermission(Notification.permission);
      
      const hasAsked = localStorage.getItem("hacoo_push_asked");
      if (Notification.permission === "default" && !hasAsked) {
        // Retrasamos un poco el popup para no asustar al usuario nada más entrar
        const timer = setTimeout(() => setShowPopup(true), 3000);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  useEffect(() => {
    // Escuchar evento personalizado desde el Footer u otros componentes
    const handleShowPush = () => {
      setShowPopup(true);
      // Reiniciamos localStorage para asegurar que permita el flujo
      localStorage.removeItem("hacoo_push_asked");
    };

    window.addEventListener("show-push-manager", handleShowPush);
    return () => window.removeEventListener("show-push-manager", handleShowPush);
  }, []);

  const handleSubscribe = async () => {
    try {
      const token = await requestForToken();
      if (token) {
        setPermission("granted");
        setIsSubscribed(true);
        localStorage.setItem("hacoo_push_asked", "true");
        
        // Guardar token en Supabase en una tabla "fcm_tokens" o similar
        await saveTokenToDatabase(token);
        
        setTimeout(() => setShowPopup(false), 2000);
      } else {
        setPermission("denied");
        localStorage.setItem("hacoo_push_asked", "true");
        setShowPopup(false);
      }
    } catch (error) {
      console.error("Error al suscribirse:", error);
    }
  };

  const handleDecline = () => {
    localStorage.setItem("hacoo_push_asked", "true");
    setShowPopup(false);
  };

  const saveTokenToDatabase = async (token: string) => {
    // Si tienes un usuario logueado, puedes enlazarlo, si no, guardarlo anónimamente
    const { data: { session } } = await supabase.auth.getSession();
    
    // Asume que has creado una tabla "push_subscriptions" en Supabase:
    // (id, token (unique), user_id (nullable), created_at)
    await supabase.from("push_subscriptions").upsert(
      { 
        token: token, 
        user_id: session?.user?.id || null 
      },
      { onConflict: 'token' }
    );
  };

  return (
    <AnimatePresence>
      {showPopup && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
          className="fixed bottom-6 right-6 z-[9999] w-[calc(100%-3rem)] md:w-96 bg-[#0d0d0d] border border-zinc-800 shadow-2xl rounded-2xl overflow-hidden"
        >
          <div className="p-5 relative">
            <button 
              onClick={handleDecline}
              className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
            
            <div className="flex gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-blue-600/20 text-blue-500 flex items-center justify-center shrink-0">
                <BellRing size={20} className="sm:w-6 sm:h-6" />
              </div>
              <div>
                <h3 className="text-white font-bold text-xs sm:text-sm mb-1">{t("push.title")}</h3>
                <p className="text-zinc-400 text-[10px] sm:text-xs leading-relaxed mb-4">
                  {t("push.desc")}
                </p>
                
                {isSubscribed ? (
                  <div className="flex items-center gap-2 text-green-500 text-[10px] sm:text-xs font-bold bg-green-500/10 px-3 py-2 rounded-lg">
                    <CheckCircle2 size={14} />
                    {t("push.subscribed")}
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row gap-2">
                    <button 
                      onClick={handleSubscribe}
                      className="bg-blue-600 hover:bg-blue-500 text-white text-[10px] sm:text-xs font-bold px-4 py-2 sm:py-2.5 rounded-xl transition-colors w-full"
                    >
                      {t("push.activate")}
                    </button>
                    <button 
                      onClick={handleDecline}
                      className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-[10px] sm:text-xs font-bold px-4 py-2 sm:py-2.5 rounded-xl transition-colors w-full"
                    >
                      {t("push.later")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
