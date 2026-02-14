import React, { useState } from 'react';
import { UserPlus, Search, Trash2, Wallet, ExternalLink, Phone } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const UsersView = () => {
    const { users, addUser, deleteUser, recordPayment, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isUserModalOpen, setUserModalOpen] = useState(false);
    const [isPaymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // Form States
    const [userFormData, setUserFormData] = useState({ name: '', phone: '' });
    const [paymentData, setPaymentData] = useState({ amount: '', method: 'Efectivo' });

    const handleAddUser = async (e) => {
        e.preventDefault();
        try {
            await addUser(userFormData.name, userFormData.phone);
            setUserModalOpen(false);
            setUserFormData({ name: '', phone: '' });
        } catch (error) {
            alert("Error al crear usuario");
        }
    };

    const handlePayment = async (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        try {
            await recordPayment(selectedUser.id, paymentData.amount, paymentData.method);
            setPaymentModalOpen(false);
            setPaymentData({ amount: '', method: 'Efectivo' });
            alert(`Abono de $${paymentData.amount} registrado para ${selectedUser.name}`);
        } catch (error) {
            alert("Error al registrar abono");
        }
    };

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner message="Cargando usuarios..." />;

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-header uppercase">Usuarios y Cartera</h2>
                <button
                    onClick={() => setUserModalOpen(true)}
                    className="militar-btn flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <UserPlus size={20} /> NUEVO CLIENTE
                </button>
            </div>

            <div className="militar-card flex-1 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="relative mb-4 md:mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o teléfono..."
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
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">ID</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Nombre / Contacto</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Saldo (Cartera)</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map(u => (
                                <tr key={u.id} className="border-b border-border-color hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-xs font-mono text-text-secondary">{u.id.toString().slice(-6)}</td>
                                    <td className="p-4">
                                        <p className="font-semibold">{u.name}</p>
                                        <p className="text-xs text-text-secondary flex items-center gap-1">
                                            <Phone size={10} /> {u.phone || '-'}
                                        </p>
                                    </td>
                                    <td className={`p-4 font-header text-2xl ${u.balance > 0 ? 'text-accent-color' : 'text-success-color'}`}>
                                        ${(u.balance || 0).toFixed(2)}
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                title="Registrar Abono"
                                                onClick={() => { setSelectedUser(u); setPaymentModalOpen(true); }}
                                                className="p-3 bg-success-color text-black rounded font-bold hover:scale-105 transition-transform flex items-center gap-2"
                                            >
                                                <Wallet size={16} /> ABONAR
                                            </button>
                                            <button
                                                onClick={async () => {
                                                    if (window.confirm('¿Eliminar usuario?')) {
                                                        await deleteUser(u.id);
                                                    }
                                                }}
                                                className="p-3 hover:bg-danger-color/20 text-danger-color rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="p-10 text-center text-text-secondary italic">
                                        No se encontraron usuarios registrados
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden flex-1 overflow-auto space-y-3 pb-20">
                    {filteredUsers.map(u => (
                        <div key={u.id} className="bg-white/5 p-4 rounded-lg border border-border-color">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-lg">{u.name}</h3>
                                    <p className="text-xs text-text-secondary flex items-center gap-1">
                                        <Phone size={12} /> {u.phone || 'Sin teléfono'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] text-text-secondary uppercase">Saldo</p>
                                    <p className={`font-header text-2xl ${u.balance > 0 ? 'text-accent-color' : 'text-success-color'}`}>
                                        ${(u.balance || 0).toFixed(2)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-white/5">
                                <button
                                    onClick={() => { setSelectedUser(u); setPaymentModalOpen(true); }}
                                    className="flex-1 py-2 bg-success-color/90 text-black rounded font-bold text-sm flex items-center justify-center gap-2"
                                >
                                    <Wallet size={16} /> ABONAR
                                </button>
                                <button
                                    onClick={async () => {
                                        if (window.confirm('¿Eliminar usuario?')) {
                                            await deleteUser(u.id);
                                        }
                                    }}
                                    className="p-2 bg-danger-color/10 text-danger-color rounded"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    ))}
                    {filteredUsers.length === 0 && (
                        <div className="p-10 text-center text-text-secondary italic">
                            No se encontraron usuarios registrados
                        </div>
                    )}
                </div>
            </div>

            {/* User Modal */}
            <Modal isOpen={isUserModalOpen} onClose={() => setUserModalOpen(false)} title="Nuevo Cliente">
                <form onSubmit={handleAddUser} className="space-y-6">
                    <div>
                        <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Nombre Completo</label>
                        <input
                            required
                            className="militar-input text-lg"
                            value={userFormData.name}
                            onChange={e => setUserFormData({ ...userFormData, name: e.target.value })}
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Teléfono / WhatsApp</label>
                        <input
                            className="militar-input"
                            value={userFormData.phone}
                            onChange={e => setUserFormData({ ...userFormData, phone: e.target.value })}
                        />
                    </div>
                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-border-color">
                        <button type="button" onClick={() => setUserModalOpen(false)} className="militar-btn-secondary uppercase text-xs font-bold w-full md:w-auto text-center">Cancelar</button>
                        <button type="submit" className="militar-btn uppercase font-header w-full md:w-auto px-10">Registrar Cliente</button>
                    </div>
                </form>
            </Modal>

            {/* Payment Modal */}
            <Modal
                isOpen={isPaymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                title={`Abonar a: ${selectedUser?.name}`}
            >
                <form onSubmit={handlePayment} className="space-y-6 text-center">
                    <div className="mb-8">
                        <p className="text-text-secondary uppercase text-xs font-bold mb-2">Deuda Actual</p>
                        <p className="text-5xl font-header text-accent-color">${(selectedUser?.balance || 0).toFixed(2)}</p>
                    </div>

                    <div className="text-left space-y-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Monto del Abono ($)</label>
                            <input
                                type="number" step="0.01" required
                                className="militar-input text-2xl text-center"
                                value={paymentData.amount}
                                onChange={e => setPaymentData({ ...paymentData, amount: e.target.value })}
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Método de Pago</label>
                            <div className="grid grid-cols-2 gap-4">
                                {['Efectivo', 'Nequi'].map(m => (
                                    <button
                                        key={m}
                                        type="button"
                                        onClick={() => setPaymentData({ ...paymentData, method: m })}
                                        className={`p-4 rounded border font-header uppercase tracking-widest ${paymentData.method === m ? 'bg-accent-color text-black border-accent-color' : 'border-border-color hover:bg-white/5'}`}
                                    >
                                        {m}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-10 border-t border-border-color">
                        <button type="button" onClick={() => setPaymentModalOpen(false)} className="militar-btn-secondary uppercase text-xs font-bold w-full md:w-auto text-center">Cancelar</button>
                        <button type="submit" className="militar-btn uppercase font-header w-full md:w-auto px-10">Confirmar Abono</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default UsersView;
