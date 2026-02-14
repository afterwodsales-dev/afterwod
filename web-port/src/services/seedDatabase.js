import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

/**
 * Script para sembrar datos iniciales en Firebase Firestore
 * Ejecutar una sola vez para poblar la base de datos con datos de ejemplo
 */

export async function seedDatabase() {
    console.log('🌱 Iniciando seed de base de datos...');

    try {
        // 1. Crear usuarios
        const users = [
            { username: 'alejandro', password: 'lucy931205', role: 'admin', name: 'Alejandro' },
            { username: 'vanessa', password: 'vane12345', role: 'admin', name: 'Vanessa' }
        ];

        for (const user of users) {
            await setDoc(doc(db, 'users', user.username), user);
            console.log(`✅ Usuario creado: ${user.username}`);
        }

        // 2. Crear productos de ejemplo
        const products = [
            { id: 'prod1', name: 'Proteína Whey 2kg', price: 45000, stock: 15, category: 'Suplementos', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod2', name: 'Creatina 300g', price: 25000, stock: 20, category: 'Suplementos', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod3', name: 'Pre-Workout', price: 35000, stock: 10, category: 'Suplementos', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod4', name: 'Aminoácidos BCAA', price: 28000, stock: 12, category: 'Suplementos', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod5', name: 'Barra Proteica', price: 3500, stock: 50, category: 'Snacks', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod6', name: 'Shaker 700ml', price: 8000, stock: 25, category: 'Accesorios', type: 'PRODUCTO SIMPLE', unit: 'unid' },
            { id: 'prod7', name: 'Guantes Gym', price: 15000, stock: 18, category: 'Accesorios', type: 'PRODUCTO SIMPLE', unit: 'par' },
            { id: 'prod8', name: 'Batido Energético', price: 5000, stock: 30, category: 'Bebidas', type: 'PRODUCTO COMPUESTO', unit: 'unid' },
        ];

        for (const product of products) {
            await setDoc(doc(db, 'products', product.id), product);
            console.log(`✅ Producto creado: ${product.name}`);
        }

        // 3. Crear clientes de ejemplo
        const customers = [
            { id: 'cust1', name: 'Juan Pérez', email: 'juan@example.com', phone: '3001234567', membershipExpiry: '2024-12-31' },
            { id: 'cust2', name: 'María García', email: 'maria@example.com', phone: '3007654321', membershipExpiry: '2024-11-30' },
            { id: 'cust3', name: 'Carlos Rodríguez', email: 'carlos@example.com', phone: '3009876543', membershipExpiry: '2025-01-15' },
            { id: 'cust4', name: 'Ana Martínez', email: 'ana@example.com', phone: '3005551234', membershipExpiry: '2024-10-20' },
        ];

        for (const customer of customers) {
            await setDoc(doc(db, 'customers', customer.id), customer);
            console.log(`✅ Cliente creado: ${customer.name}`);
        }

        // 4. Crear ventas de ejemplo
        const sales = [
            {
                id: 'sale1',
                date: new Date('2024-02-10').toISOString(),
                customerId: 'cust1',
                customerName: 'Juan Pérez',
                items: [
                    { productId: 'prod1', productName: 'Proteína Whey 2kg', quantity: 1, price: 45000 },
                    { productId: 'prod5', productName: 'Barra Proteica', quantity: 5, price: 3500 }
                ],
                total: 62500,
                paymentMethod: 'Efectivo'
            },
            {
                id: 'sale2',
                date: new Date('2024-02-11').toISOString(),
                customerId: 'cust2',
                customerName: 'María García',
                items: [
                    { productId: 'prod2', productName: 'Creatina 300g', quantity: 1, price: 25000 },
                ],
                total: 25000,
                paymentMethod: 'Tarjeta'
            },
            {
                id: 'sale3',
                date: new Date('2024-02-12').toISOString(),
                customerId: 'cust3',
                customerName: 'Carlos Rodríguez',
                items: [
                    { productId: 'prod3', productName: 'Pre-Workout', quantity: 1, price: 35000 },
                    { productId: 'prod6', productName: 'Shaker 700ml', quantity: 1, price: 8000 }
                ],
                total: 43000,
                paymentMethod: 'Transferencia'
            }
        ];

        for (const sale of sales) {
            await setDoc(doc(db, 'sales', sale.id), sale);
            console.log(`✅ Venta creada: ${sale.id}`);
        }

        // 5. Crear recetas de ejemplo (para productos compuestos)
        const recipes = [
            { id: 'rec1', productId: 'prod8', ingredientId: 'prod1', quantity: 0.05 }, // Batido usa 50g de proteína
            { id: 'rec2', productId: 'prod8', ingredientId: 'prod2', quantity: 0.01 }, // Batido usa 10g de creatina
        ];

        for (const recipe of recipes) {
            await setDoc(doc(db, 'recipes', recipe.id), recipe);
            console.log(`✅ Receta creada: ${recipe.id}`);
        }

        console.log('🎉 ¡Seed completado exitosamente!');
        return { success: true, message: 'Base de datos poblada con datos de ejemplo' };

    } catch (error) {
        console.error('❌ Error durante el seed:', error);
        return { success: false, error: error.message };
    }
}
