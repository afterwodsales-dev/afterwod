import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError('');
            setLoading(true);
            await login(email, password); // 'email' state actually holds the username now
            navigate('/');
        } catch (err) {
            console.error(err);
            setError('Credenciales incorrectas. Verifique usuario y contraseña.');
        }
        setLoading(false);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-[#0a0e14] relative overflow-hidden font-sans">
            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[var(--accent-color)] opacity-[0.03] blur-[120px] rounded-full pointer-events-none"></div>

            <div className="w-full max-w-[420px] p-8 rounded-[20px] bg-[#11161d] border border-[#1f2633] shadow-2xl relative z-10">

                {/* Header Icon */}
                <div className="flex justify-center mb-6 relative">
                    <div className="absolute top-0 w-20 h-20 bg-[var(--accent-color)] blur-[40px] opacity-20 rounded-full"></div>
                    <div className="relative bg-[#0d4f9e00] p-4 rounded-2xl">
                        {/* Using the Logo or a Shield as requested by style, adapted to brand */}
                        <div className="w-20 h-20 bg-gradient-to-b from-[#1c2333] to-[#0d1117] rounded-xl flex items-center justify-center border border-[#2d3545] shadow-inner overflow-hidden">
                            <img src="/afterwod/logo.png" alt="Logo" className="w-14 h-14 object-contain" />
                        </div>
                    </div>
                </div>

                {/* Title */}
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase">
                        AFTERWOD <span className="text-[var(--accent-color)]">APP</span>
                    </h2>
                    <p className="text-[#64748b] text-sm mt-2 font-medium">Panel de Gestión Administrativa</p>
                </div>

                {error && (
                    <div className="mb-6 bg-red-500/10 border border-red-500/20 rounded-lg p-3 flex items-center gap-3 text-red-400 text-sm">
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* User/Email Input */}
                    <div className="space-y-2">
                        <label className="text-[#94a3b8] text-xs font-bold uppercase tracking-wide ml-1">Usuario</label>
                        <input
                            type="text"
                            className="w-full bg-[#0d1117] border border-[#1e293b] text-white rounded-lg px-4 py-3 placeholder:text-[#334155] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="Usuario (ej: admin)"
                        />
                    </div>

                    {/* Password Input */}
                    <div className="space-y-2">
                        <label className="text-[#94a3b8] text-xs font-bold uppercase tracking-wide ml-1">Contraseña</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full bg-[#0d1117] border border-[#1e293b] text-white rounded-lg px-4 py-3 placeholder:text-[#334155] focus:outline-none focus:border-[var(--accent-color)] focus:ring-1 focus:ring-[var(--accent-color)] transition-all pr-12"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="Ingrese su contraseña"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#64748b] hover:text-white transition-colors"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    {/* Button */}
                    <button
                        disabled={loading}
                        className="w-full bg-[var(--accent-color)] hover:bg-[var(--accent-hover)] text-[#0f172a] font-bold rounded-lg py-3.5 mt-2 transition-all flex items-center justify-center gap-2 group"
                        type="submit"
                    >
                        {loading ? 'Accediendo...' : 'Acceder al Sistema'}
                        {!loading && <LogIn size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </form>

                {/* Footer */}
                <div className="mt-8 text-center space-y-4">
                    <p className="text-[#475569] text-xs leading-relaxed max-w-[280px] mx-auto">
                        Sistema sincronizado en tiempo real.
                    </p>
                    <div className="pt-4 border-t border-[#1e293b]">
                        <p className="text-[#475569] text-[10px]">
                            Developed by Afterword · Secure Access
                        </p>
                        <a
                            href="https://gualguanosky.github.io/?utm_source=ig&utm_medium=social&utm_content=link_in_bio&fbclid=PAZXh0bgNhZW0CMTEAc3J0YwZhcHBfaWQMMjU2MjgxMDQwNTU4AAGnn8knt5S7qhMPWxTlErytunaVVPLx5fLbv1_denbm_JoCe_NvUgSkydqVkyI_aem_ORP__D-935BHMxd94tT98w"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold text-[var(--accent-color)] hover:text-white transition-colors animate-pulse"
                        >
                            <span>Designed with ❤️ by Gualguanosky</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
