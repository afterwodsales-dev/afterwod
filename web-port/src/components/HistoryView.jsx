import React, { useState } from 'react';
import { Search, History as HistoryIcon, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import LoadingSpinner from './LoadingSpinner';

const HistoryView = () => {
    const { getCombinedHistory, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');

    const history = getCombinedHistory();
    const filteredHistory = history.filter(h =>
        h.detail.toLowerCase().includes(searchTerm.toLowerCase()) ||
        h.type.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner message="Cargando historial..." />;

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex justify-between items-center mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-header uppercase">Historial de Movimientos</h2>
            </div>

            <div className="militar-card flex-1 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="relative mb-4 md:mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por detalle o tipo..."
                        className="militar-input pl-10 w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block flex-1 overflow-auto">
                    <table className="w-full text-left border-collapse">
                        <thead className="sticky top-0 bg-card-bg border-b border-border-color z-10">
                            <tr>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Tipo</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Detalle</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Info/Método</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Monto</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Fecha</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHistory.map(h => (
                                <tr key={`${h.type}-${h.id}`} className="border-b border-border-color hover:bg-white/5 transition-colors">
                                    <td className="p-4">
                                        <div className="flex items-center gap-2">
                                            {h.type === 'VENTA' ?
                                                <ArrowUpRight size={16} className="text-accent-color" /> :
                                                <ArrowDownLeft size={16} className="text-success-color" />
                                            }
                                            <span className={`font-bold text-xs ${h.type === 'VENTA' ? 'text-accent-color' : 'text-success-color'}`}>
                                                {h.type}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="p-4 font-semibold">{h.detail}</td>
                                    <td className="p-4 text-text-secondary">{h.info}</td>
                                    <td className="p-4 font-header text-lg">${(h.amount || 0).toFixed(2)}</td>
                                    <td className="p-4 text-xs text-text-secondary">
                                        {new Date(h.date).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredHistory.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-text-secondary">
                                        <HistoryIcon className="mx-auto mb-3 opacity-20" size={48} />
                                        No hay movimientos registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden flex-1 overflow-auto space-y-3 pb-20">
                    {filteredHistory.map(h => (
                        <div key={`${h.type}-${h.id}`} className="bg-white/5 p-4 rounded-lg border border-border-color">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex items-center gap-2">
                                    {h.type === 'VENTA' ?
                                        <ArrowUpRight size={16} className="text-accent-color" /> :
                                        <ArrowDownLeft size={16} className="text-success-color" />
                                    }
                                    <span className={`font-bold text-xs ${h.type === 'VENTA' ? 'text-accent-color' : 'text-success-color'}`}>
                                        {h.type}
                                    </span>
                                </div>
                                <span className="text-xs text-text-secondary">
                                    {new Date(h.date).toLocaleDateString()}
                                </span>
                            </div>

                            <h3 className="font-semibold text-sm mb-1">{h.detail}</h3>
                            <p className="text-xs text-text-secondary mb-3">{h.info}</p>

                            <div className="text-right border-t border-white/5 pt-2">
                                <p className="font-header text-xl">${(h.amount || 0).toFixed(2)}</p>
                            </div>
                        </div>
                    ))}
                    {filteredHistory.length === 0 && (
                        <div className="p-10 text-center text-text-secondary">
                            <HistoryIcon className="mx-auto mb-3 opacity-20" size={48} />
                            No hay movimientos registrados
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryView;
