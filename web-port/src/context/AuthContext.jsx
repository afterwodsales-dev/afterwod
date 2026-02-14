import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { seedDatabase } from '../services/seedDatabase';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initialize/Seed Database and Check Session
    useEffect(() => {
        async function initAuth() {
            // 1. Check if database needs seeding (check if users collection exists)
            try {
                const userRef = doc(db, 'users', 'alejandro');
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                    console.log('🌱 Base de datos vacía, ejecutando seed...');
                    const result = await seedDatabase();
                    if (result.success) {
                        console.log('✅ Seed completado');
                    } else {
                        console.error('❌ Error en seed:', result.error);
                    }
                }
            } catch (error) {
                console.error("Error checking/seeding database:", error);
            }

            // 2. Recover Session from LocalStorage (Simple Persistence)
            const storedUser = localStorage.getItem('militar_user');
            if (storedUser) {
                setCurrentUser(JSON.parse(storedUser));
            }
            setLoading(false);
        }

        initAuth();
    }, []);

    async function login(username, password) {
        // Simple User/Pass check against Firestore
        try {
            const userRef = doc(db, 'users', username); // Doc ID is the username
            const userSnap = await getDoc(userRef);

            if (userSnap.exists()) {
                const userData = userSnap.data();
                if (userData.password === password) {
                    // Success
                    const userObj = { username, ...userData };
                    setCurrentUser(userObj);
                    localStorage.setItem('militar_user', JSON.stringify(userObj));
                    return userObj;
                }
            }
            throw new Error('Credenciales incorrectas');
        } catch (error) {
            console.error("Login error:", error);
            throw error;
        }
    }

    function logout() {
        setCurrentUser(null);
        localStorage.removeItem('militar_user');
    }

    const value = {
        currentUser,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}
