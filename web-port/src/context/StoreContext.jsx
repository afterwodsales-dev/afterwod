import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  orderBy,
  where,
  getDocs,
  writeBatch,
  increment
} from 'firebase/firestore';
import { db } from '../services/firebase';

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [sales, setSales] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [payments, setPayments] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- Real-time Listeners ---
  useEffect(() => {
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const p = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setProducts(p);
    });

    const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
      const u = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setUsers(u);
    });

    const itemsQuery = query(collection(db, 'sales'), orderBy('saleDate', 'desc'));
    const unsubSales = onSnapshot(itemsQuery, (snapshot) => {
      const s = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setSales(s);
    });

    const purQuery = query(collection(db, 'purchases'), orderBy('date', 'desc'));
    const unsubPurchases = onSnapshot(purQuery, (snapshot) => {
      const p = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPurchases(p);
    });

    const payQuery = query(collection(db, 'payments'), orderBy('paymentDate', 'desc'));
    const unsubPayments = onSnapshot(payQuery, (snapshot) => {
      const p = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setPayments(p);
    });

    const unsubRecipes = onSnapshot(collection(db, 'recipes'), (snapshot) => {
      const r = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRecipes(r);
    });

    // Cleanup
    return () => {
      unsubProducts();
      unsubUsers();
      unsubSales();
      unsubPurchases();
      unsubPayments();
      unsubRecipes();
    };
  }, []);

  useEffect(() => {
    if (products.length || users.length) setLoading(false);
    // Timeout fallback in case DB is empty initially
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, [products, users]);

  // --- Product Logic ---
  const addProduct = async (name, price, stock, category = "", type = "PRODUCTO SIMPLE", unit = "unid") => {
    try {
      const docRef = await addDoc(collection(db, 'products'), {
        name,
        price: parseFloat(price) || 0,
        stock: parseFloat(stock) || 0,
        category,
        type,
        unit
      });
      return docRef.id;
    } catch (e) {
      console.error("Error adding product: ", e);
    }
  };

  const updateProduct = async (id, name, price, stock, category = "", type = "PRODUCTO SIMPLE", unit = "unid") => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        name,
        price: parseFloat(price),
        stock: parseFloat(stock),
        category,
        type,
        unit
      });
    } catch (e) {
      console.error("Error updating product: ", e);
    }
  };

  const deleteProduct = async (id) => {
    try {
      await deleteDoc(doc(db, 'products', id));

      // Also delete associated recipes
      // Note: This is client-side filtering; better done with a cloud function for consistency, but works here.
      const associatedRecipes = recipes.filter(r => r.productId === id);
      for (const r of associatedRecipes) {
        await deleteDoc(doc(db, 'recipes', r.id));
      }
    } catch (e) {
      console.error("Error deleting product: ", e);
    }
  };

  // --- User Logic ---
  const addUser = async (name, phone) => {
    await addDoc(collection(db, 'users'), {
      name,
      phone,
      balance: 0
    });
  };

  const deleteUser = async (id) => {
    await deleteDoc(doc(db, 'users', id));
  };

  // --- Recipe Logic ---
  const addRecipeItem = async (productId, ingredientId, quantity) => {
    await addDoc(collection(db, 'recipes'), {
      productId,
      ingredientId,
      quantity: parseFloat(quantity)
    });
  };

  const deleteRecipe = async (productId) => {
    const toDelete = recipes.filter(r => r.productId === productId);
    const batch = writeBatch(db);
    toDelete.forEach(r => {
      batch.delete(doc(db, 'recipes', r.id));
    });
    await batch.commit();
  };

  // --- Purchase Logic ---
  const recordPurchase = async (productId, quantity, costPrice) => {
    const qty = parseFloat(quantity);
    const cost = parseFloat(costPrice);

    // Update Stock
    const product = products.find(p => p.id === productId);
    if (product) {
      const productRef = doc(db, 'products', productId);
      let newPrice = product.price;

      // If INSUMO, update unit/price average
      if (product.type === "INSUMO" && qty > 0) {
        newPrice = cost / qty; // Python logic: unit_cost = total_cost / quantity
      }

      await updateDoc(productRef, {
        stock: (product.stock || 0) + qty,
        price: newPrice
      });
    }

    // Record Purchase
    await addDoc(collection(db, 'purchases'), {
      productId,
      quantity: qty,
      costPrice: cost,
      date: new Date().toISOString()
    });
  };


  // --- Sale Logic ---
  const recordSale = async (productId, quantity, totalPrice, userId = null, method = "Efectivo") => {
    const qty = parseFloat(quantity);
    const total = parseFloat(totalPrice);
    const batch = writeBatch(db);

    const deductions = new Map();

    const traverse = (pid, q) => {
      // Find recipes for this specific product ID (ensuring both are cast to String)
      const productRecipes = recipes.filter(r => String(r.productId) === String(pid));

      if (productRecipes.length > 0) {
        // It's a compound product: traverse children
        productRecipes.forEach(item => {
          const itemMultiplier = Number(item.quantity) || 1;
          traverse(String(item.ingredientId), itemMultiplier * q);
        });
      } else {
        // Base case: it's a leaf/simple product, record the final deduction
        const current = deductions.get(String(pid)) || 0;
        deductions.set(String(pid), current + q);
      }
    };

    traverse(productId, qty);

    deductions.forEach((dQty, pid) => {
      const pRef = doc(db, 'products', pid);
      batch.update(pRef, { stock: increment(-dQty) });
    });

    const saleRef = doc(collection(db, 'sales'));
    batch.set(saleRef, {
      productId,
      quantity: qty,
      totalPrice: total,
      userId,
      method,
      saleDate: new Date().toISOString()
    });

    if (userId) {
      const user = users.find(u => String(u.id) === String(userId));
      if (user) {
        const uRef = doc(db, 'users', userId);
        batch.update(uRef, { balance: (user.balance || 0) + total });
      }
    }

    await batch.commit();
  };

  const deleteSale = async (id) => {
    const sale = sales.find(s => String(s.id) === String(id));
    if (!sale) return;

    const batch = writeBatch(db);

    const traverseRevert = (pid, q) => {
      const productRecipes = recipes.filter(r => String(r.productId) === String(pid));
      if (productRecipes.length > 0) {
        productRecipes.forEach(item => {
          const multiplier = Number(item.quantity) || 1;
          traverseRevert(item.ingredientId, multiplier * q);
        });
      } else {
        const pRef = doc(db, 'products', String(pid));
        batch.update(pRef, { stock: increment(q) });
      }
    };
    traverseRevert(sale.productId, sale.quantity);

    if (sale.userId) {
      const user = users.find(u => String(u.id) === String(sale.userId));
      if (user) {
        const uRef = doc(db, 'users', sale.userId);
        batch.update(uRef, { balance: (user.balance || 0) - (sale.totalPrice || 0) });
      }
    }

    batch.delete(doc(db, 'sales', id));
    await batch.commit();
  };

  // --- Payment Logic ---
  const recordPayment = async (userId, amount, method) => {
    const val = parseFloat(amount);
    const batch = writeBatch(db);

    const user = users.find(u => String(u.id) === String(userId));
    if (user) {
      const uRef = doc(db, 'users', userId);
      batch.update(uRef, { balance: (user.balance || 0) - val });
    }

    const payRef = doc(collection(db, 'payments'));
    batch.set(payRef, {
      userId,
      amount: val,
      method,
      paymentDate: new Date().toISOString()
    });

    await batch.commit();
  };

  const deletePayment = async (id) => {
    const payment = payments.find(p => String(p.id) === String(id));
    if (!payment) return;

    const batch = writeBatch(db);

    if (payment.userId) {
      const user = users.find(u => String(u.id) === String(payment.userId));
      if (user) {
        const uRef = doc(db, 'users', payment.userId);
        batch.update(uRef, { balance: (user.balance || 0) + (payment.amount || 0) });
      }
    }

    batch.delete(doc(db, 'payments', id));
    await batch.commit();
  };

  // --- Aggregate Logic ---
  const getFinancialSummary = () => {
    const totalSales = sales.reduce((acc, s) => acc + (s.totalPrice || 0), 0);
    const totalPurchases = purchases.reduce((acc, p) => acc + (p.costPrice || 0), 0);
    const userStats = users.map(u => {
      const userSales = sales.filter(s => String(s.userId) === String(u.id)).reduce((acc, s) => acc + (s.totalPrice || 0), 0);
      return { id: u.id, name: u.name, totalBought: userSales, balance: u.balance };
    });
    return { totalSales, totalPurchases, userStats };
  };

  const getCombinedHistory = () => {
    const sMapped = sales.map(s => ({
      id: s.id,
      type: 'VENTA',
      detail: products.find(p => String(p.id) === String(s.productId))?.name || 'Desconocido',
      info: s.quantity.toString(),
      amount: s.totalPrice,
      date: s.saleDate
    }));

    const pMapped = payments.map(p => ({
      id: p.id,
      type: 'PAGO',
      detail: users.find(u => String(u.id) === String(p.userId))?.name || 'Desconocido',
      info: p.method,
      amount: p.amount,
      date: p.paymentDate
    }));

    return [...sMapped, ...pMapped].sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  return (
    <StoreContext.Provider value={{
      loading,
      products, addProduct, updateProduct, deleteProduct,
      users, addUser, deleteUser,
      recipes, addRecipeItem, deleteRecipe,
      sales, recordSale, deleteSale,
      purchases, recordPurchase,
      payments, recordPayment, deletePayment,
      getFinancialSummary, getCombinedHistory
    }}>
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => useContext(StoreContext);
