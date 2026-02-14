import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Package } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import Modal from './Modal';
import LoadingSpinner from './LoadingSpinner';

const InventoryView = () => {
    const { products, addProduct, updateProduct, deleteProduct, recipes, addRecipeItem, deleteRecipe, loading } = useStore();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '', price: '', stock: '0', category: '',
        type: 'PRODUCTO SIMPLE', unit: 'unid'
    });
    const [ingredients, setIngredients] = useState([]);

    const openModal = (product = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                price: product.price.toString(),
                stock: product.stock.toString(),
                category: product.category || '',
                type: product.type,
                unit: product.unit
            });
            // Load recipes for this product
            const productRecipes = recipes.filter(r => r.productId === product.id);
            setIngredients(productRecipes.map(r => ({
                ingredientId: r.ingredientId,
                quantity: r.quantity,
                name: products.find(p => p.id === r.ingredientId)?.name || '?'
            })));
        } else {
            setEditingProduct(null);
            setFormData({ name: '', price: '', stock: '0', category: '', type: 'PRODUCTO SIMPLE', unit: 'unid' });
            setIngredients([]);
        }
        setModalOpen(true);
    };

    const handleSave = async (e) => {
        e.preventDefault();
        let pid;
        if (editingProduct) {
            await updateProduct(editingProduct.id, formData.name, formData.price, formData.stock, formData.category, formData.type, formData.unit);
            pid = editingProduct.id;
            // For simplicity in this migration, we delete and recreate recipes.
            // Ideally we should diff them, but this mimics the Python logic.
            await deleteRecipe(pid);
        } else {
            pid = await addProduct(formData.name, formData.price, formData.stock, formData.category, formData.type, formData.unit);
        }

        if (formData.type === 'PRODUCTO COMPUESTO') {
            // Processing ingredients in parallel or sequence
            for (const ing of ingredients) {
                await addRecipeItem(pid, ing.ingredientId, ing.quantity);
            }
        }

        setModalOpen(false);
    };

    const addIngredientRow = (ing) => {
        if (!ing) return;
        setIngredients([...ingredients, { ingredientId: ing.id, name: ing.name, quantity: 1 }]);
    };

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <LoadingSpinner message="Cargando inventario..." />;

    return (
        <div className="p-4 md:p-6 h-[calc(100vh-4rem)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 md:mb-8">
                <h2 className="text-2xl md:text-3xl font-header uppercase">Inventario</h2>
                <button
                    onClick={() => openModal()}
                    className="militar-btn flex items-center justify-center gap-2 w-full md:w-auto"
                >
                    <Plus size={20} /> NUEVO ITEM
                </button>
            </div>

            <div className="militar-card flex-1 flex flex-col overflow-hidden">
                {/* Search */}
                <div className="relative mb-4 md:mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" size={18} />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
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
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Nombre</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Precio</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs">Stock</th>
                                <th className="p-4 text-text-secondary font-semibold uppercase text-xs text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProducts.map(p => (
                                <tr key={p.id} className="border-b border-border-color hover:bg-white/5 transition-colors group">
                                    <td className="p-4 text-xs font-mono">{p.id.toString().slice(-6)}</td>
                                    <td className="p-4 font-semibold">
                                        {p.name} <br />
                                        <span className="text-[10px] text-text-secondary uppercase">{p.type}</span>
                                    </td>
                                    <td className="p-4">${(p.price || 0).toFixed(2)}</td>
                                    <td className="p-4">
                                        <span className={`w-2 h-2 inline-block rounded-full mr-2 ${p.stock > 10 ? 'bg-success-color' : 'bg-danger-color'}`}></span>
                                        {p.stock} <span className="text-xs text-text-secondary">({p.unit})</span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <button
                                                onClick={() => openModal(p)}
                                                className="p-2 hover:bg-accent-color/20 text-accent-color rounded transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(p.id)}
                                                className="p-2 hover:bg-danger-color/20 text-danger-color rounded transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredProducts.length === 0 && (
                                <tr>
                                    <td colSpan="5" className="p-10 text-center text-text-secondary">
                                        <Package className="mx-auto mb-3 opacity-20" size={48} />
                                        No se encontraron productos
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Card List */}
                <div className="md:hidden flex-1 overflow-auto space-y-3 pb-20">
                    {filteredProducts.map(p => (
                        <div key={p.id} className="bg-white/5 p-4 rounded-lg border border-border-color">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <h3 className="font-bold text-lg">{p.name}</h3>
                                    <span className="text-[10px] text-text-secondary uppercase bg-white/5 px-2 py-0.5 rounded">{p.type}</span>
                                </div>
                                <div className="text-right">
                                    <p className="font-header text-xl text-accent-color">${(p.price || 0).toFixed(2)}</p>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mt-3 pt-3 border-t border-white/5">
                                <div className="flex items-center">
                                    <span className={`w-2.5 h-2.5 inline-block rounded-full mr-2 ${p.stock > 10 ? 'bg-success-color' : 'bg-danger-color'}`}></span>
                                    <span className="text-sm font-semibold text-text-secondary">{p.stock}</span>
                                    <span className="text-[10px] text-text-secondary ml-1 uppercase">({p.unit})</span>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => openModal(p)}
                                        className="p-2 bg-accent-color/10 text-accent-color rounded"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    <button
                                        onClick={() => deleteProduct(p.id)}
                                        className="p-2 bg-danger-color/10 text-danger-color rounded"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filteredProducts.length === 0 && (
                        <div className="p-10 text-center text-text-secondary">
                            <Package className="mx-auto mb-3 opacity-20" size={48} />
                            No se encontraron productos
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
                title={editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
            >
                <form onSubmit={handleSave} className="space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Nombre</label>
                            <input
                                required
                                className="militar-input"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Categoría</label>
                            <input
                                className="militar-input"
                                value={formData.category}
                                onChange={e => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Tipo de Producto</label>
                        <select
                            className="militar-input"
                            value={formData.type}
                            onChange={e => setFormData({ ...formData, type: e.target.value })}
                        >
                            <option value="PRODUCTO SIMPLE">PRODUCTO SIMPLE</option>
                            <option value="INSUMO">INSUMO</option>
                            <option value="PRODUCTO COMPUESTO">PRODUCTO COMPUESTO (CON RECETA)</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.type !== 'INSUMO' && (
                            <div>
                                <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Precio de Venta ($)</label>
                                <input
                                    type="number" step="0.01" className="militar-input"
                                    value={formData.price}
                                    onChange={e => setFormData({ ...formData, price: e.target.value })}
                                />
                            </div>
                        )}
                        <div>
                            <label className="text-xs font-bold uppercase text-text-secondary mb-2 block">Unidad (ml, gr, unid...)</label>
                            <input
                                className="militar-input"
                                value={formData.unit}
                                onChange={e => setFormData({ ...formData, unit: e.target.value })}
                            />
                        </div>
                    </div>

                    {formData.type === 'PRODUCTO COMPUESTO' && (
                        <div className="space-y-4 pt-4 border-t border-border-color">
                            <h4 className="font-header text-accent-color uppercase italic">Receta / Composición</h4>
                            <div className="flex flex-col md:flex-row gap-2 mb-4">
                                <select
                                    className="militar-input flex-1"
                                    onChange={(e) => addIngredientRow(products.find(p => p.id === parseInt(e.target.value)))}
                                    value=""
                                >
                                    <option value="">+ Agregar Ingrediente/Insumo...</option>
                                    {products.filter(p => p.id !== editingProduct?.id).map(p => (
                                        <option key={p.id} value={p.id}>{p.name} ({p.unit})</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-2 max-h-40 overflow-auto pr-2">
                                {ingredients.map((ing, idx) => (
                                    <div key={idx} className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/5">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-semibold text-sm truncate">{ing.name}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number" step="0.01"
                                                className="militar-input w-20 py-1.5 text-center text-sm"
                                                value={ing.quantity}
                                                onChange={e => {
                                                    const newIngs = [...ingredients];
                                                    newIngs[idx].quantity = parseFloat(e.target.value);
                                                    setIngredients(newIngs);
                                                }}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setIngredients(ingredients.filter((_, i) => i !== idx))}
                                                className="text-danger-color p-2 hover:bg-danger-color/10 rounded-full transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-6 border-t border-border-color">
                        <button type="button" onClick={() => setModalOpen(false)} className="militar-btn-secondary uppercase text-xs font-bold w-full md:w-auto text-center">Cancelar</button>
                        <button type="submit" className="militar-btn uppercase font-header w-full md:w-auto px-10">Guardar Item</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default InventoryView;
