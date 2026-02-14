import { db } from './firebase';
import { collection, getDocs, query, limit } from 'firebase/firestore';

/**
 * Script de diagnóstico para verificar la conexión a Firebase
 * y el estado de la base de datos
 */

export async function diagnoseFirebase() {
    console.log('🔍 Iniciando diagnóstico de Firebase...\n');

    try {
        // 1. Verificar conexión a Firestore
        console.log('1️⃣ Verificando conexión a Firestore...');
        const testQuery = query(collection(db, 'users'), limit(1));
        const snapshot = await getDocs(testQuery);

        if (snapshot.empty) {
            console.log('⚠️  La colección "users" está vacía');
            console.log('   → Necesitas ejecutar el seed de la base de datos');
            return {
                success: false,
                issue: 'empty_users',
                message: 'La colección de usuarios está vacía. Ejecuta el seed.'
            };
        } else {
            console.log('✅ Conexión a Firestore exitosa');
            console.log(`   → Encontrados ${snapshot.size} usuario(s)`);
        }

        // 2. Listar usuarios disponibles
        console.log('\n2️⃣ Usuarios disponibles:');
        const usersQuery = query(collection(db, 'users'));
        const usersSnapshot = await getDocs(usersQuery);

        usersSnapshot.forEach((doc) => {
            const data = doc.data();
            console.log(`   ✓ Usuario: ${doc.id}`);
            console.log(`     - Nombre: ${data.name}`);
            console.log(`     - Rol: ${data.role}`);
        });

        // 3. Verificar otras colecciones
        console.log('\n3️⃣ Verificando otras colecciones:');
        const collections = ['products', 'customers', 'sales', 'recipes'];

        for (const collectionName of collections) {
            try {
                const q = query(collection(db, collectionName), limit(1));
                const snap = await getDocs(q);
                console.log(`   ${snap.empty ? '⚠️ ' : '✅'} ${collectionName}: ${snap.empty ? 'vacía' : `${snap.size} documento(s)`}`);
            } catch (error) {
                console.log(`   ❌ ${collectionName}: Error - ${error.message}`);
            }
        }

        console.log('\n✅ Diagnóstico completado exitosamente');
        return {
            success: true,
            message: 'Firebase está configurado correctamente'
        };

    } catch (error) {
        console.error('\n❌ Error durante el diagnóstico:', error);

        if (error.code === 'permission-denied') {
            console.log('\n🔒 PROBLEMA DETECTADO: Reglas de Firestore bloqueadas');
            console.log('   → Ve a Firebase Console > Firestore Database > Rules');
            console.log('   → Cambia las reglas a:');
            console.log(`
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
            `);
            return {
                success: false,
                issue: 'permission_denied',
                message: 'Las reglas de Firestore están bloqueadas. Necesitas cambiarlas en Firebase Console.'
            };
        }

        return {
            success: false,
            issue: 'connection_error',
            message: error.message,
            error: error
        };
    }
}

// Auto-ejecutar en desarrollo
if (import.meta.env.DEV) {
    console.log('🔧 Modo desarrollo detectado - ejecutando diagnóstico automático...\n');
    setTimeout(() => {
        diagnoseFirebase();
    }, 2000);
}
