import React, { useState } from 'react';
import { ShoppingCart, User, CreditCard, Banknote, Trash2, Search, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import LoadingSpinner from './LoadingSpinner';

const SalesView = () => {
    const { products, users, recordSale, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [cart, setCart] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('Efectivo');
    const [activeTab, setActiveTab] = useState('products'); // 'products' or 'cart'

    // Only sellable products
    const sellableProducts = products.filter(p =>
        p.type !== 'INSUMO' &&
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const addToCart = (product) => {
        const existing = cart.find(item => item.id === product.id);
        if (existing) {
            setCart(cart.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
        } else {
            setCart([...cart, { ...product, qty: 1 }]);
        }
    };

    const removeFromCart = (id) => {
        setCart(cart.filter(item => item.id !== id));
    };

    const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

    const handleFinishSale = async () => {
        if (cart.length === 0) return;

        try {
            // Process all sales
            const promises = cart.map(item =>
                recordSale(item.id, item.qty, item.price * item.qty, selectedUser?.id, paymentMethod)
            );

            await Promise.all(promises);

            setCart([]);
            setSelectedUser(null);
            alert('Venta registrada con éxito');
            setActiveTab('products');
        } catch (error) {
            console.error(error);
            alert('Error al registrar la venta');
        }
    };

    if (loading) return <LoadingSpinner message="Cargando productos..." />;

    return (
        <div className="flex flex-col h-[calc(100vh-4rem)] md:h-[calc(100vh-2rem)] overflow-hidden">
            {/* Context/Tab Switcher for Mobile */}
            <div className="md:hidden flex border-b border-border-color bg-card-bg">
                <button
                    onClick={() => setActiveTab('products')}
                    className={`flex-1 p-3 text-center font-header uppercase tracking-wider text-sm ${activeTab === 'products' ? 'text-accent-color border-b-2 border-accent-color' : 'text-text-secondary'}`}
                >
                    Productos
                </button>
                <button
                    onClick={() => setActiveTab('cart')}
                    className={`flex-1 p-3 text-center font-header uppercase tracking-wider text-sm ${activeTab === 'cart' ? 'text-accent-color border-b-2 border-accent-color' : 'text-text-secondary'}`}
                >
                    Carrito ({cart.length})
                </button>
            </div>

            <div className="flex-1 overflow-hidden relative">
                <div className="absolute inset-0 p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Product Selection */}
                    <div className={`lg:col-span-2 flex flex-col gap-6 overflow-hidden h-full ${activeTab !== 'products' ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="militar-card flex-1 flex flex-col overflow-hidden">
                            <div className="flex justify-between items-center mb-4 md:mb-6">
                                <h3 className="text-lg md:text-xl font-header uppercase">Productos / Combos</h3>
                                <div className="relative w-40 md:w-64">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={16} />
                                    <input
                                        type="text"
                                        placeholder="Buscar..."
                                        className="militar-input py-2 pl-9 md:pl-10 text-sm"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 overflow-auto pb-20 md:pb-4">
                                {sellableProducts.map(p => (
                                    <button
                                        key={p.id}
                                        onClick={() => addToCart(p)}
                                        className="militar-card hover:border-accent-color p-4 text-left transition-all active:scale-95 group relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 right-0 p-1 px-2 bg-accent-color/10 text-accent-color text-[9px] font-bold">
                                            {p.type.split(' ')[1] || 'SIMPLE'}
                                        </div>
                                        <p className="font-semibold mb-1 truncate pr-6 text-sm md:text-base">{p.name}</p>
                                        <p className="text-lg font-header text-accent-color">${(p.price || 0).toFixed(2)}</p>
                                        <p className="text-xs text-text-secondary">Stock: {p.stock}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Cart & Checkout */}
                    <div className={`militar-card flex-col h-full bg-sidebar-color ${activeTab !== 'cart' ? 'hidden lg:flex' : 'flex'}`}>
                        <div className="flex items-center gap-2 mb-4 md:mb-6 border-b border-border-color pb-4">
                            <ShoppingCart className="text-accent-color" size={24} />
                            <h3 className="text-lg md:text-xl font-header uppercase">Carrito de Venta</h3>
                        </div>

                        <div className="flex-1 overflow-auto mb-6">
                            {cart.map(item => (
                                <div key={item.id} className="flex justify-between items-center mb-3 p-2 bg-white/5 rounded">
                                    <div>
                                        <p className="font-semibold text-sm">{item.name}</p>
                                        <p className="text-xs text-text-secondary">{item.qty} x ${(item.price || 0).toFixed(2)}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-header text-accent-color">${((item.price || 0) * item.qty).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            className="text-danger-color p-1 hover:bg-danger-color/10 rounded"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {cart.length === 0 && (
                                <div className="h-full flex flex-col items-center justify-center opacity-20">
                                    <ShoppingCart size={48} className="mb-2" />
                                    <p>El carrito está vacío</p>
                                </div>
                            )}
                        </div>

                        <div className="mt-auto space-y-4 pt-4 border-t border-border-color">
                            {/* User selector */}
                            <div>
                                <label className="text-xs text-text-secondary uppercase mb-2 block font-bold">Tipo de Cobro / Cliente</label>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <select
                                            className={`militar-input text-sm p-3 w-full border-2 ${selectedUser ? 'border-accent-color' : 'border-success-color'}`}
                                            onChange={(e) => {
                                                const val = e.target.value;
                                                if (val === "") {
                                                    setSelectedUser(null);
                                                } else {
                                                    setSelectedUser(users.find(u => String(u.id) === String(val)));
                                                }
                                            }}
                                            value={selectedUser?.id || ""}
                                        >
                                            <option value="">🛒 VENTA AL CONTADO (Efectivo)</option>
                                            <optgroup label="CRÉDITO A CLIENTE (FIADO)">
                                                {users.map(u => (
                                                    <option key={u.id} value={u.id}>🪖 {u.name} (Debe: ${(u.balance || 0).toFixed(2)})</option>
                                                ))}
                                            </optgroup>
                                        </select>
                                    </div>

                                    {selectedUser && (
                                        <div className="bg-accent-color/10 p-3 rounded-lg border border-accent-color/30 animate-fade-in">
                                            <p className="text-[10px] text-accent-color uppercase font-bold mb-1">Registro de Deuda</p>
                                            <p className="text-xs text-text-secondary">Esta venta se sumará a la cuenta de <span className="text-white font-bold">{selectedUser.name}</span>.</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-text-secondary font-bold uppercase text-xs">Total</span>
                                <span className="text-3xl font-header text-accent-color">${(cartTotal || 0).toFixed(2)}</span>
                            </div>

                            <button
                                onClick={handleFinishSale}
                                className="militar-btn w-full py-4 text-lg font-header flex items-center justify-center gap-2"
                            >
                                {selectedUser ? <CreditCard size={20} /> : <Banknote size={20} />}
                                FINALIZAR {selectedUser ? 'FIADO' : 'COBRO'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Floating Action Button for Mobile: Go to Cart */}
                {activeTab === 'products' && cart.length > 0 && (
                    <div className="lg:hidden absolute bottom-6 right-6 z-10">
                        <button
                            onClick={() => setActiveTab('cart')}
                            className="bg-accent-color text-black w-14 h-14 rounded-full shadow-lg flex items-center justify-center animate-bounce"
                        >
                            <ShoppingCart size={24} />
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-6 h-6 rounded-full flex items-center justify-center border-2 border-[var(--bg-color)]">
                                {cart.length}
                            </span>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesView;
