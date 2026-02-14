import React from 'react';
import { TrendingUp, TrendingDown, Activity, Users as UsersIcon, MessageCircle, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import LoadingSpinner from './LoadingSpinner';

const Dashboard = () => {
    const { getFinancialSummary, users, loading } = useStore();
    const { totalSales, totalPurchases } = getFinancialSummary();

    const debtors = users.filter(u => (u.balance || 0) > 0).sort((a, b) => b.balance - a.balance);

    const profit = totalSales - totalPurchases;

    if (loading) return <LoadingSpinner message="Cargando panel de control..." />;

    return (
        <div className="p-4 md:p-6 space-y-6 md:space-y-8 max-w-7xl mx-auto">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl md:text-4xl font-header uppercase tracking-tighter">Panel de Control</h2>
                <p className="text-text-secondary text-sm md:text-base">Resumen consolidado de Militar Box</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="militar-card flex items-center justify-between group hover:border-success-color transition-colors p-4 md:p-6">
                    <div className="min-w-0">
                        <p className="text-text-secondary text-[10px] md:text-sm font-bold uppercase mb-1 truncate">Ingresos Hoy</p>
                        <p className="text-2xl md:text-4xl font-header text-success-color truncate">${(totalSales || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-success-color/10 p-3 md:p-4 rounded-full text-success-color shrink-0 ml-2">
                        <TrendingUp size={20} className="md:w-8 md:h-8" />
                    </div>
                </div>

                <div className="militar-card flex items-center justify-between group hover:border-danger-color transition-colors p-4 md:p-6">
                    <div className="min-w-0">
                        <p className="text-text-secondary text-[10px] md:text-sm font-bold uppercase mb-1 truncate">Inv. Stock</p>
                        <p className="text-2xl md:text-4xl font-header text-danger-color truncate">${(totalPurchases || 0).toFixed(2)}</p>
                    </div>
                    <div className="bg-danger-color/10 p-3 md:p-4 rounded-full text-danger-color shrink-0 ml-2">
                        <TrendingDown size={20} className="md:w-8 md:h-8" />
                    </div>
                </div>

                <div className="militar-card flex items-center justify-between group hover:border-accent-color transition-colors p-4 md:p-6">
                    <div className="min-w-0">
                        <p className="text-text-secondary text-[10px] md:text-sm font-bold uppercase mb-1 truncate">Balance Bruto</p>
                        <p className={`text-2xl md:text-4xl font-header truncate ${profit >= 0 ? 'text-accent-color' : 'text-danger-color'}`}>
                            ${(profit || 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="bg-accent-color/10 p-3 md:p-4 rounded-full text-accent-color shrink-0 ml-2">
                        <Activity size={20} className="md:w-8 md:h-8" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Debtors Section (Moved to Top) */}
                <div className="lg:col-span-2 militar-card bg-sidebar-color border-accent-color/30">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-header uppercase flex items-center gap-2">
                            <AlertCircle className="text-accent-color" size={24} />
                            Control de Deudores
                        </h3>
                        <span className="bg-accent-color/10 text-accent-color text-xs px-3 py-1 rounded-full border border-accent-color/20 font-bold">
                            {debtors.length} PERSONAS
                        </span>
                    </div>

                    <div className="space-y-3 max-h-[400px] overflow-auto pr-2">
                        {debtors.map(u => (
                            <div key={u.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:border-accent-color/30 transition-all group">
                                <div className="flex items-center gap-4 mb-3 md:mb-0">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent-color to-black flex items-center justify-center font-header text-black font-bold">
                                        {u.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-sm uppercase tracking-wide">{u.name}</p>
                                        <p className="text-[10px] text-text-secondary">{u.phone || 'Sin teléfono'}</p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between md:justify-end gap-6">
                                    <div className="text-right">
                                        <p className="text-[10px] text-text-secondary uppercase font-bold opacity-50">Saldo Pendiente</p>
                                        <p className="text-xl font-header text-accent-color">${(u.balance || 0).toFixed(2)}</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            const message = `*RECORDATORIO DE PAGO - MILITAR BOX* 🪖\n\nHola *${u.name}*, esperamos que estés bien.\n\nTe escribimos para recordarte que tienes un saldo pendiente en nuestra tienda por un valor de:\n\n💰 *Total Deuda: $${u.balance.toFixed(2)}*\n\nPor favor, recuerda pasar a ponerte al día. ¡Gracias por tu apoyo!\n\n_Atentamente: Gestión Militar Box_`;
                                            const encoded = encodeURIComponent(message);
                                            const url = `https://wa.me/${(u.phone || '').replace(/\D/g, '')}?text=${encoded}`;
                                            window.open(url, '_blank');
                                        }}
                                        disabled={!u.phone}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-xs transition-all ${u.phone ? 'bg-[#25D366] text-black hover:scale-105 active:scale-95 shadow-lg' : 'bg-white/5 text-text-secondary cursor-not-allowed grayscale'}`}
                                    >
                                        <MessageCircle size={16} />
                                        <span className="hidden sm:inline">RECORDAR COBRO</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                        {debtors.length === 0 && (
                            <div className="text-center py-12 opacity-20">
                                <Activity size={48} className="mx-auto mb-2" />
                                <p className="font-header uppercase">No hay deudas pendientes</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* User Stats Table */}
                <div className="militar-card overflow-hidden">
                    <div className="flex items-center gap-2 mb-6 border-b border-border-color pb-4">
                        <UsersIcon className="text-accent-color" size={20} />
                        <h3 className="text-lg md:text-xl font-header uppercase">Rendimiento por Cliente</h3>
                    </div>
                    <div className="space-y-4">
                        {userStats.slice(0, 5).map(stat => (
                            <div key={stat.id} className="flex justify-between items-center p-3 rounded bg-white/5 group hover:bg-white/10 transition-colors">
                                <span className="font-semibold text-sm md:text-base truncate max-w-[50%]">{stat.name}</span>
                                <div className="text-right">
                                    <p className="font-header text-base md:text-lg">${(stat.totalBought || 0).toFixed(2)}</p>
                                    <p className={`text-[9px] md:text-[10px] font-bold uppercase ${stat.balance > 0 ? 'text-danger-color' : 'text-success-color'}`}>
                                        {stat.balance > 0 ? `DEUDA: $${(stat.balance || 0).toFixed(2)}` : 'AL DÍA'}
                                    </p>
                                </div>
                            </div>
                        ))}
                        {userStats.length === 0 && (
                            <p className="p-8 text-center text-text-secondary text-sm italic">Sin datos de ventas por cliente aún</p>
                        )}
                    </div>
                </div>

                {/* Info Card */}
                <div className="militar-card flex flex-col justify-center items-center text-center p-8 md:p-12 bg-gradient-to-br from-card-bg to-sidebar-color border-white/5">
                    <img src="logo.png" alt="Logo" className="w-24 md:w-32 opacity-10 mb-6 grayscale" />
                    <h3 className="text-xl md:text-2xl font-header text-text-secondary opacity-50 uppercase italic tracking-widest">
                        Militar Box v2.0
                    </h3>
                    <p className="text-text-secondary text-xs md:text-sm mt-4">Edición Web Port · Afterwod</p>

                    <a
                        href="https://gualguanosky.github.io/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnn8knt5S7qhMPWxTlErytunaVVPLx5fLbv1_denbm_JoCe_NvUgSkydqVkyI_aem_ORP__D-935BHMxd94tT98w"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex items-center gap-2 text-xs font-bold text-accent-color hover:text-white transition-colors animate-pulse"
                    >
                        <span>Designed by Gualguanosky</span>
                        <span>❤️</span>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
