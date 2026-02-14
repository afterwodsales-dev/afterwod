import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Wallet, Search, Calendar, Package, ArrowRight, DollarSign } from 'lucide-react';
import LoadingSpinner from './LoadingSpinner';
import Modal from './Modal';

const CarteraView = () => {
    const { users, sales, payments, products, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);

    // Filter only debtors (balance > 0)
    const debtors = users.filter(u =>
        (u.balance > 0) &&
        (u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.phone?.includes(searchTerm))
    ).sort((a, b) => b.balance - a.balance);

    // Get User History (Fiado Sales + Payments)
    const getUserHistory = (userId) => {
        const userSales = sales
            .filter(s => s.userId === userId && s.method === 'Fiado')
            .map(s => ({
                id: s.id,
                type: 'DEUDA',
                date: s.saleDate,
                amount: s.totalPrice,
                quantity: s.quantity,
                productName: products.find(p => p.id === s.productId)?.name || 'Producto Eliminado'
            }));

        const userPayments = payments
            .filter(p => p.userId === userId)
            .map(p => ({
                id: p.id,
                type: 'ABONO',
                date: p.paymentDate,
                amount: p.amount,
                method: p.method
            }));

        return [...userSales, ...userPayments].sort((a, b) => new Date(b.date) - new Date(a.date));
    };

    if (loading) return <LoadingSpinner message="Cargando cartera..." />;

    return (
        <div className="p-4 md:p-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="text-2xl md:text-3xl font-header uppercase flex items-center gap-2">
                        <Wallet className="text-accent-color" size={32} />
                        Cartera de Clientes
                    </h2>
                    <p className="text-text-secondary text-sm">Gestión detallada de cuentas por cobrar</p>
                </div>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                <input
                    type="text"
                    placeholder="Buscar deudor..."
                    className="afterwod-input pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Debtors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto pb-20">
                {debtors.map(u => (
                    <div
                        key={u.id}
                        onClick={() => setSelectedUser(u)}
                        className="afterwod-card hover:border-accent-color cursor-pointer transition-all group relative overflow-hidden"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent-color to-black flex items-center justify-center font-header text-black font-bold text-xl">
                                {u.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-text-secondary uppercase font-bold">Deuda Total</p>
                                <p className="text-2xl font-header text-danger-color">${u.balance.toFixed(2)}</p>
                            </div>
                        </div>

                        <h3 className="font-bold text-lg uppercase mb-1">{u.name}</h3>
                        <p className="text-xs text-text-secondary mb-4">{u.phone || 'Sin contacto'}</p>

                        <div className="bg-white/5 p-3 rounded flex items-center justify-between text-xs group-hover:bg-accent-color/10 transition-colors">
                            <span className="text-text-secondary group-hover:text-accent-color">Ver historial detallado</span>
                            <ArrowRight size={14} className="text-accent-color" />
                        </div>
                    </div>
                ))}

                {debtors.length === 0 && (
                    <div className="col-span-full text-center py-20 opacity-50">
                        <Wallet size={48} className="mx-auto mb-4" />
                        <p className="text-xl font-header uppercase">¡Todo al día!</p>
                        <p className="text-sm">No hay clientes con deuda pendiente.</p>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                title={selectedUser ? `Historial: ${selectedUser.name}` : ''}
            >
                {selectedUser && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center p-4 bg-white/5 rounded-lg border border-white/5">
                            <p className="text-sm text-text-secondary uppercase">Saldo Pendiente</p>
                            <p className="text-3xl font-header text-accent-color">${selectedUser.balance.toFixed(2)}</p>
                        </div>

                        <div className="space-y-3 max-h-[50vh] overflow-auto pr-2">
                            <h4 className="font-header uppercase text-sm border-b border-white/10 pb-2 mb-4">Movimientos Recientes</h4>
                            {getUserHistory(selectedUser.id).map((item) => (
                                <div key={item.id} className="flex gap-4 p-3 rounded hover:bg-white/5 transition-colors border-l-2 border-transparent hover:border-accent-color">
                                    <div className="mt-1">
                                        {item.type === 'DEUDA' ? (
                                            <div className="w-8 h-8 rounded bg-danger-color/20 text-danger-color flex items-center justify-center">
                                                <Package size={14} />
                                            </div>
                                        ) : (
                                            <div className="w-8 h-8 rounded bg-success-color/20 text-success-color flex items-center justify-center">
                                                <DollarSign size={14} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between mb-1">
                                            <p className="font-bold text-sm">
                                                {item.type === 'DEUDA' ? item.productName : 'Abono a Cartera'}
                                            </p>
                                            <span className={`font-mono text-sm font-bold ${item.type === 'DEUDA' ? 'text-danger-color' : 'text-success-color'}`}>
                                                {item.type === 'DEUDA' ? '-' : '+'}${item.amount.toFixed(2)}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center text-[10px] text-text-secondary">
                                            <span className="flex items-center gap-1">
                                                <Calendar size={10} />
                                                {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                            {item.type === 'DEUDA' && (
                                                <span>Cantidad: {item.quantity}</span>
                                            )}
                                            {item.type === 'ABONO' && (
                                                <span className="uppercase">{item.method}</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {getUserHistory(selectedUser.id).length === 0 && (
                                <p className="text-center text-xs text-text-secondary italic py-4">Sin registro de movimientos</p>
                            )}
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default CarteraView;
