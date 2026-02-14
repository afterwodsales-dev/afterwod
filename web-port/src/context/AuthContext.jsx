import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Initial Users Data for Auto-Seeding
    const defaultUsers = [
        { username: 'alejandro', password: 'lucy931205', role: 'admin', name: 'Alejandro' },
        { username: 'vanessa', password: 'vane12345', role: 'admin', name: 'Vanessa' }
    ];

    // Initialize/Seed Users and Check Session
    useEffect(() => {
        async function initAuth() {
            // 1. Seed Users (Create if not exist in Firestore)
            for (const u of defaultUsers) {
                try {
                    const userRef = doc(db, 'users', u.username);
                    const userSnap = await getDoc(userRef);
                    if (!userSnap.exists()) {
                        await setDoc(userRef, u);
                        console.log(`User ${u.username} seeded.`);
                    }
                } catch (error) {
                    console.error("Error seeding user:", error);
                }
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
