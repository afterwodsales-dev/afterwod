import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ChevronRight, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password);
            navigate('/');
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/configuration-not-found') {
                setError('Error de configuración: Habilita "Email/Password" en Firebase Console.');
            } else if (err.code === 'auth/invalid-credential') {
                setError('Credenciales incorrectas.');
            } else {
                setError('Error al iniciar sesión. Intenta nuevamente.');
            }
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)] relative overflow-hidden">
            {/* Background Accents */}
            <div className="absolute top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-[var(--accent-color)] opacity-5 blur-[100px] rounded-full pointing-events-none"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-[var(--accent-color)] opacity-5 blur-[100px] rounded-full pointing-events-none"></div>

            <div className="militar-card w-full max-w-md p-8 border-[var(--accent-color)] border border-opacity-30 shadow-[0_0_50px_rgba(244,162,185,0.1)] relative z-10 backdrop-blur-sm">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 mx-auto mb-6 bg-[var(--card-bg)] rounded-full flex items-center justify-center border-2 border-[var(--accent-color)] shadow-[0_0_15px_var(--accent-color)]">
                        <img src="/logo.png" alt="Logo" className="w-16 object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.5)]" />
                    </div>
                    <h2 className="text-4xl font-[var(--font-header)] text-[var(--accent-color)] tracking-widest drop-shadow-[0_0_10px_rgba(244,162,185,0.5)]">
                        MILITAR BOX
                    </h2>
                    <p className="text-[var(--text-secondary)] text-sm tracking-[0.2em] mt-2 uppercase border-b border-[var(--border-color)] pb-4 inline-block px-4">
                        System Access
                    </p>
                </div>

                {error && (
                    <div className="bg-[var(--danger-color)]/20 border border-[var(--danger-color)] text-[var(--danger-color)] p-4 rounded mb-6 text-sm font-bold flex items-center gap-3 animate-pulse">
                        <AlertCircle size={20} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" size={20} />
                        <input
                            type="email"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:border-[var(--accent-color)] focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="CORREO ELECTRÓNICO"
                        />
                    </div>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-focus-within:text-[var(--accent-color)] transition-colors" size={20} />
                        <input
                            type="password"
                            className="w-full bg-white/5 border border-white/10 rounded-lg py-4 pl-12 pr-4 text-white focus:border-[var(--accent-color)] focus:bg-white/10 focus:outline-none transition-all placeholder:text-white/20"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="CONTRASEÑA"
                        />
                    </div>

                    <button
                        disabled={loading}
                        className="militar-btn w-full mt-4 text-lg py-4 group relative overflow-hidden uppercase tracking-wider"
                        type="submit"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {loading ? 'Validando...' : 'Iniciar Sesión'}
                            {!loading && <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />}
                        </span>
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                    </button>
                </form>

                <div className="mt-8 text-center text-[10px] text-[var(--text-secondary)] uppercase tracking-widest opacity-50">
                    Propiedad Privada · Acceso Restringido
                </div>
            </div>
        </div>
    );
}
