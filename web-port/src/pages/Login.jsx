import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
            setError('Error al iniciar sesión: ' + err.message);
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[var(--bg-color)]">
            <div className="militar-card w-full max-w-md p-8 border-[var(--border-color)] border-2">
                <div className="text-center mb-8">
                    <img src="/logo.png" alt="Logo" className="h-24 mx-auto mb-4 object-contain" />
                    <h2 className="text-3xl font-[var(--font-header)] text-[var(--accent-color)] tracking-wider">
                        MILITAR BOX
                    </h2>
                    <p className="text-[var(--text-secondary)] mt-2">Afterword Edition</p>
                </div>

                {error && <div className="bg-[var(--danger-color)] text-white p-3 rounded mb-4 text-sm font-bold text-center">{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-bold mb-2 text-[var(--text-color)]">Email</label>
                        <input
                            type="email"
                            className="militar-input focus:ring-2 focus:ring-[var(--accent-color)]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="admin@militarbox.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2 text-[var(--text-color)]">Contraseña</label>
                        <input
                            type="password"
                            className="militar-input focus:ring-2 focus:ring-[var(--accent-color)]"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        disabled={loading}
                        className="militar-btn w-full mt-4 text-lg hover:brightness-110 transition-all"
                        type="submit"
                    >
                        {loading ? 'Entrando...' : 'INGRESAR AL SISTEMA'}
                    </button>
                </form>
            </div>
        </div>
    );
}
