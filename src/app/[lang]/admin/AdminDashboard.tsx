"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { 
  Users, 
  ShoppingBag, 
  TrendingUp, 
  ShieldCheck, 
  AlertTriangle,
  ChevronRight,
  Search,
  ExternalLink,
  Database,
  Activity,
  History,
  Clock,
  Filter,
  MoreVertical,
  Mail,
  Calendar,
  Lock,
  Globe,
  Settings,
  Cpu,
  BarChart3,
  Star,
  Bell,
  Send
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/lib/supabase";
import { products } from "@/data/products";

export default function AdminDashboard() {
  const { profile } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: products.length,
    totalClicks: 1240,
    activeAdmins: 0,
    systemHealth: 98.4
  });
  const [allUsers, setAllUsers] = useState<any[]>([]);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [pushForm, setPushForm] = useState({ title: "", body: "", url: "" });
  const [isSendingPush, setIsSendingPush] = useState(false);
  const [pushResult, setPushResult] = useState<{success?: boolean, message?: string} | null>(null);

  const fetchUsers = async () => {
    try {
      const { data, count, error } = await supabase
        .from("profiles")
        .select("*", { count: 'exact' })
        .order('id', { ascending: false });

      if (data && !error) {
        setAllUsers(data);
        setStats(prev => ({ 
          ...prev, 
          totalUsers: count || 0,
          activeAdmins: data.filter(u => u.role === 'admin').length
        }));
      }
    } catch (err) {
      console.error("Error fetching admin stats", err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleAdminRole = async (userId: string, currentRole: string) => {
    setIsUpdating(userId);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ role: newRole })
        .eq("id", userId);

      if (error) throw error;
      await fetchUsers();
    } catch (err: any) {
      alert("Error al actualizar rol: " + err.message);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleSendPush = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.uid) return;
    
    setIsSendingPush(true);
    setPushResult(null);

    try {
      const res = await fetch('/api/admin/send-push', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: pushForm.title,
          body: pushForm.body,
          url: pushForm.url,
          adminUserId: profile.uid
        })
      });

      const data = await res.json();
      if (data.success) {
        setPushResult({ success: true, message: `Enviadas ${data.sent} notificaciones exitosamente.` });
        setPushForm({ title: "", body: "", url: "" });
      } else {
        setPushResult({ success: false, message: data.error || data.message || "Error desconocido" });
      }
    } catch (err: any) {
      setPushResult({ success: false, message: err.message });
    } finally {
      setIsSendingPush(false);
    }
  };

  if (profile?.role !== "admin") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-zinc-900/50 border border-white/[0.05] p-10 sm:p-14 rounded-[2.5rem] text-center max-w-lg backdrop-blur-3xl shadow-2xl shadow-black/40"
        >
          <div className="w-20 h-20 bg-red-500/5 rounded-2xl flex items-center justify-center mx-auto mb-10 border border-red-500/10">
            <AlertTriangle className="text-red-500/80" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight mb-4">Acceso Restringido</h1>
          <p className="text-zinc-400 mb-10 leading-relaxed text-sm font-medium">
            Esta sección está reservada exclusivamente para el personal autorizado. 
            Si crees que deberías tener acceso, solicita una promoción de rol a un administrador de <span className="text-white">Hacoo Ultra</span>.
          </p>
          <a 
            href="/" 
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-600/20"
          >
            Volver al Inicio
            <ChevronRight size={14} />
          </a>
        </motion.div>
      </div>
    );
  }

  const filteredUsers = allUsers.filter(u => 
    u.display_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const topProducts = [...products]
    .sort((a, b) => (b.reviews || 0) - (a.reviews || 0))
    .slice(0, 5);

  const systemLogs = [
    { id: 1, event: "Backup automático completado", time: "Hace 2 horas", type: "success" },
    { id: 2, event: "Nuevo usuario registrado: Maria G.", time: "Hace 3 horas", type: "info" },
    { id: 3, event: "Actualización de catálogo exitosa", time: "Hace 5 horas", type: "success" },
    { id: 4, event: "Intento de login fallido (IP: 192.168.1.1)", time: "Hace 12 horas", type: "warning" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 rounded-xl bg-blue-500 animate-pulse" />
            <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
              Panel de Control Administrativo
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white tracking-tight">
            Admin <span className="text-blue-500 font-extrabold">Core</span>
          </h1>
          <p className="text-zinc-400 text-sm max-w-xl">
            Gestiona usuarios, analiza el rendimiento y supervisa la infraestructura de <span className="text-white font-semibold">Hacoo Ultra</span>.
          </p>
        </div>
        
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none px-5 py-2.5 bg-zinc-900 border border-white/5 hover:border-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all">
            <Database size={16} />
            Snapshot DB
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-600/10 active:scale-95">
            <Settings size={16} />
            Configuración
          </button>
        </div>
      </motion.div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 p-1 bg-zinc-900/50 border border-white/[0.03] rounded-2xl w-fit">
        {[
          { id: "overview", label: "Vista General", icon: BarChart3 },
          { id: "users", label: "Usuarios", icon: Users },
          { id: "notifications", label: "Notificaciones", icon: Bell },
          { id: "products", label: "Rendimiento", icon: ShoppingBag },
          { id: "system", label: "Sistema", icon: Cpu },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === tab.id 
                ? "bg-zinc-800 text-white shadow-sm" 
                : "text-zinc-500 hover:text-zinc-300 hover:bg-white/[0.02]"
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? "text-blue-500" : ""} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content Area */}
        <div className="lg:col-span-8 space-y-10">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                className="space-y-10"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {[
                    { label: "Usuarios Activos", value: stats.totalUsers, icon: Users, color: "blue", trend: "+12%" },
                    { label: "Catálogo Total", value: stats.totalProducts, icon: ShoppingBag, color: "emerald", trend: "Estable" },
                    { label: "Interacción 24h", value: stats.totalClicks, icon: TrendingUp, color: "orange", trend: "+8%" },
                    { label: "Salud del Sistema", value: `${stats.systemHealth}%`, icon: Activity, color: "purple", trend: "Óptimo" },
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-zinc-900/30 border border-white/[0.05] p-6 rounded-2xl group hover:border-blue-500/30 transition-all shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-500/10 flex items-center justify-center text-${stat.color}-400 border border-${stat.color}-500/10`}>
                          <stat.icon size={22} />
                        </div>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-xl bg-${stat.color}-500/5 text-${stat.color}-400 border border-${stat.color}-500/10`}>
                          {stat.trend}
                        </span>
                      </div>
                      <div>
                        <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</p>
                        <p className="text-3xl font-bold text-white tracking-tight">{stat.value}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Top Products detailed list */}
                <div className="bg-zinc-900/30 border border-white/[0.05] rounded-[2rem] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white">Rendimiento de Productos</h3>
                      <p className="text-zinc-500 text-sm mt-1">Artículos con mayor tracción en el catálogo.</p>
                    </div>
                    <button className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors text-zinc-400">
                      <MoreVertical size={16} />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {topProducts.map((product, idx) => (
                      <div key={product.id} className="group bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.03] p-4 rounded-2xl transition-all flex items-center gap-5">
                        <div className="text-zinc-600 font-bold text-lg w-6 text-center">{idx + 1}</div>
                        <div className="w-12 h-12 rounded-xl bg-zinc-800 overflow-hidden border border-white/5 shrink-0 shadow-inner">
                          <img src={product.image} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                        </div>
                        <div className="flex-grow min-w-0">
                          <h4 className="text-zinc-200 font-semibold truncate text-sm">{product.name}</h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-zinc-500 text-[10px] font-bold uppercase">{product.category}</span>
                            <span className="text-blue-500/80 text-[10px] font-bold uppercase flex items-center gap-1">
                              <Star size={10} fill="currentColor" /> {product.reviews} Reseñas
                            </span>
                          </div>
                        </div>
                        <div className="text-right hidden sm:block pr-2">
                          <p className="text-white font-bold text-base">{product.price.toFixed(2)}€</p>
                          <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-tight">Precio</p>
                        </div>
                        <a href={product.affiliateUrl} target="_blank" className="p-2.5 bg-zinc-800 text-zinc-500 hover:text-white hover:bg-blue-600 rounded-lg transition-all">
                          <ExternalLink size={14} />
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "users" && (
              <motion.div
                key="users"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="bg-zinc-900/30 border border-white/[0.05] rounded-[2rem] p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <div>
                      <h3 className="text-xl font-bold text-white">Gestión de Usuarios</h3>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-zinc-500 text-sm">Control de accesos y privilegios.</p>
                        <span className="h-4 w-px bg-white/10 hidden sm:block"></span>
                        <div className="hidden sm:flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-blue-400">
                          <ShieldCheck size={12} /> {stats.activeAdmins} Administradores
                        </div>
                      </div>
                    </div>
                    <div className="relative group">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-blue-500 transition-colors" size={14} />
                      <input 
                        type="text" 
                        placeholder="Buscar por nombre o email..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="bg-black/20 border border-white/[0.05] focus:border-blue-500/40 rounded-xl pl-11 pr-4 py-3 text-xs font-medium text-white focus:outline-none w-full md:w-72 transition-all"
                      />
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                      <thead>
                        <tr className="border-b border-white/[0.04]">
                          <th className="pb-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Usuario</th>
                          <th className="pb-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Contacto</th>
                          <th className="pb-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Rol / Estatus</th>
                          <th className="pb-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest text-right">Acciones</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.02]">
                        {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                          <tr key={u.id} className="group hover:bg-white/[0.01] transition-colors">
                            <td className="py-5">
                              <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-xl bg-zinc-800 overflow-hidden border border-white/[0.05] shrink-0">
                                  {u.photo_url ? (
                                    <img src={u.photo_url} alt="" className="w-full h-full object-cover" />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-zinc-600 font-bold uppercase">
                                      {u.display_name?.charAt(0) || "U"}
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <span className="text-zinc-200 font-semibold text-sm block">{u.display_name || "Usuario Anónimo"}</span>
                                  <span className="text-zinc-600 text-[10px] font-medium block">#{u.id.substring(0, 8)}</span>
                                </div>
                              </div>
                            </td>
                            <td className="py-5">
                              <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-2 text-zinc-400 text-xs">
                                  <Mail size={12} className="text-zinc-600" />
                                  {u.email}
                                </div>
                                <div className="text-zinc-600 text-[10px] font-medium pl-5">
                                  Unido: {new Date(u.created_at || Date.now()).toLocaleDateString('es-ES')}
                                </div>
                              </div>
                            </td>
                            <td className="py-5">
                              <div className="flex flex-col items-start gap-2">
                                <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-md border flex items-center gap-1.5 ${
                                  u.role === 'admin' 
                                    ? 'bg-blue-500/5 text-blue-400 border-blue-500/10' 
                                    : 'bg-zinc-800/50 text-zinc-500 border-white/[0.03]'
                                }`}>
                                  {u.role === 'admin' && <ShieldCheck size={10} />}
                                  {u.role}
                                </span>
                                <span className="flex items-center gap-1.5 text-emerald-500/80 text-[8px] font-bold uppercase tracking-widest ml-1">
                                  <span className="w-1.5 h-1.5 rounded-xl bg-emerald-500 animate-pulse"></span>
                                  Online
                                </span>
                              </div>
                            </td>
                            <td className="py-5 text-right">
                              <button 
                                onClick={() => toggleAdminRole(u.id, u.role)}
                                disabled={isUpdating === u.id}
                                className={`text-[10px] font-bold uppercase px-4 py-2 rounded-lg transition-all ${
                                  u.role === 'admin' 
                                    ? 'bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white' 
                                    : 'bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white'
                                } disabled:opacity-50 active:scale-95`}
                              >
                                {isUpdating === u.id ? (
                                  <div className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-xl animate-spin mx-auto"></div>
                                ) : (
                                  u.role === 'admin' ? "Degradar" : "Hacer Admin"
                                )}
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={4} className="py-16 text-center">
                              <Search size={40} className="mx-auto text-zinc-800 mb-4" />
                              <p className="text-zinc-600 font-bold uppercase tracking-widest text-xs">Sin resultados</p>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
              >
                <div className="bg-zinc-900/30 border border-white/[0.05] rounded-[2rem] p-6 sm:p-8">
                  <div className="mb-8">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                      <Bell className="text-blue-500" /> 
                      Enviar Notificación Push
                    </h3>
                    <p className="text-zinc-500 text-sm mt-2">Envía una alerta en tiempo real a todos los usuarios suscritos.</p>
                  </div>

                  <form onSubmit={handleSendPush} className="space-y-6 max-w-2xl">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Título de la Alerta</label>
                      <input 
                        type="text" 
                        required
                        value={pushForm.title}
                        onChange={e => setPushForm({...pushForm, title: e.target.value})}
                        placeholder="Ej: ¡Oferta Flash 24H! 🔥"
                        className="w-full bg-black/20 border border-white/[0.05] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Mensaje</label>
                      <textarea 
                        required
                        rows={3}
                        value={pushForm.body}
                        onChange={e => setPushForm({...pushForm, body: e.target.value})}
                        placeholder="Ej: Usa el código ULTRA14 y llévate un descuento especial hoy."
                        className="w-full bg-black/20 border border-white/[0.05] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all resize-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-zinc-500 mb-2">Enlace de Destino (Opcional)</label>
                      <input 
                        type="url" 
                        value={pushForm.url}
                        onChange={e => setPushForm({...pushForm, url: e.target.value})}
                        placeholder="https://hacoo-ultra.vercel.app/..."
                        className="w-full bg-black/20 border border-white/[0.05] focus:border-blue-500/50 rounded-xl px-4 py-3 text-sm text-white focus:outline-none transition-all"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSendingPush}
                      className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold text-sm px-8 py-4 rounded-xl flex items-center justify-center gap-3 transition-all w-full md:w-auto"
                    >
                      {isSendingPush ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Enviando...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Enviar a todos
                        </>
                      )}
                    </button>

                    {pushResult && (
                      <div className={`p-4 rounded-xl text-sm font-bold flex items-center gap-2 ${pushResult.success ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                        {pushResult.message}
                      </div>
                    )}
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar / Auxiliary Info */}
        <div className="lg:col-span-4 space-y-8">
          {/* Server Status Card */}
          <div className="bg-zinc-900/30 border border-white/[0.05] rounded-[2rem] p-6 sm:p-8">
            <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest mb-8 flex items-center gap-2">
              <Activity className="text-blue-500" size={16} />
              Infraestructura
            </h3>
            <div className="space-y-6">
              {[
                { label: "Uso de CPU", value: 24, color: "blue" },
                { label: "Memoria RAM", value: 68, color: "purple" },
                { label: "Latencia DB", value: 12, color: "emerald", suffix: "ms" },
              ].map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-zinc-500 text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                    <span className={`text-${item.color}-400 text-xs font-bold`}>{item.value}{item.suffix || "%"}</span>
                  </div>
                  <div className="h-1.5 w-full bg-black/20 rounded-xl overflow-hidden border border-white/[0.02]">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={`h-full bg-${item.color}-500/80 rounded-xl`}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-10 p-4 bg-white/[0.02] border border-white/[0.03] rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-zinc-500 text-[9px] font-bold uppercase tracking-widest">Optimización</p>
                <div className="text-white font-bold text-lg mt-0.5">04:22:15</div>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                <Clock size={18} />
              </div>
            </div>
          </div>

          {/* Activity Logs */}
          <div className="bg-zinc-900/30 border border-white/[0.05] rounded-[2rem] p-6 sm:p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-sm font-bold text-zinc-200 uppercase tracking-widest flex items-center gap-2">
                <History className="text-emerald-500" size={16} />
                Actividad
              </h3>
              <button className="text-zinc-600 hover:text-white transition-colors">
                <Filter size={14} />
              </button>
            </div>
            <div className="space-y-5">
              {systemLogs.map((log) => (
                <div key={log.id} className="flex gap-4 group">
                  <div className={`w-1.5 h-1.5 rounded-xl mt-2 shrink-0 ${
                    log.type === 'success' ? 'bg-emerald-500' : 
                    log.type === 'warning' ? 'bg-orange-500' : 'bg-blue-500'
                  }`} />
                  <div>
                    <p className="text-zinc-300 text-xs font-medium leading-relaxed group-hover:text-blue-400 transition-colors">{log.event}</p>
                    <p className="text-zinc-600 text-[10px] font-bold uppercase mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-3 bg-white/[0.02] hover:bg-white/[0.05] border border-white/[0.03] rounded-xl text-zinc-500 hover:text-zinc-300 text-[9px] font-bold uppercase tracking-widest transition-all">
              Historial de Auditoría
            </button>
          </div>

          {/* Quick Access Card */}
          <div className="bg-gradient-to-br from-blue-600/90 to-indigo-700/90 p-8 rounded-[2rem] shadow-xl shadow-blue-900/20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-xl -mr-10 -mt-10 blur-2xl" />
            
            <h3 className="text-white font-bold text-lg mb-2 relative z-10">Control Externo</h3>
            <p className="text-blue-100/60 text-xs font-medium mb-8 leading-relaxed relative z-10">
              Usa la consola de Supabase para operaciones avanzadas de base de datos.
            </p>
            
            <a 
              href="https://supabase.com/dashboard" 
              target="_blank"
              className="w-full bg-white text-blue-700 py-3 rounded-xl font-bold text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-zinc-100 transition-all active:scale-95 relative z-10"
            >
              Consola Supabase
              <ExternalLink size={12} />
            </a>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .animate-spin-slow {
          animation: spin 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
