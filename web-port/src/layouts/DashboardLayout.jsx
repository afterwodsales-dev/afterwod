import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Calculator,
    Package,
    Users as UsersIcon,
    History,
    BarChart3,
    Menu,
    X,
    LogOut
} from 'lucide-react';

export default function DashboardLayout() {
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error("Failed to log out", error);
        }
    };

    const navItems = [
        { path: '/', label: 'Dashboard', icon: BarChart3 },
        { path: '/sales', label: 'Ventas', icon: Calculator },
        { path: '/inventory', label: 'Inventario', icon: Package },
        { path: '/users', label: 'Usuarios', icon: UsersIcon },
        { path: '/history', label: 'Historial', icon: History },
    ];

    return (
        <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-color)]">
            {/* Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-[var(--sidebar-color)] transition-all duration-300 border-r border-[var(--border-color)] flex flex-col shrink-0`}>
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between">
                    <div className={`flex items-center gap-3 ${!isSidebarOpen && 'hidden'}`}>
                        <img src="/logo.png" alt="Militar Box" className="h-10" />
                        <span className="font-[var(--font-header)] text-xl text-[var(--accent-color)] truncate">MILITAR BOX</span>
                    </div>
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-white/5 rounded text-[var(--text-secondary)]">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
                    {navItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                w-full flex items-center gap-4 px-6 py-4 hover:bg-white/5 transition-colors whitespace-nowrap
                ${isActive ? 'text-[var(--accent-color)] border-r-4 border-[var(--accent-color)] bg-[var(--accent-color)]/5' : 'text-[var(--text-secondary)]'}
              `}
                        >
                            <item.icon size={22} className="shrink-0" />
                            {isSidebarOpen && <span className="font-semibold">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-2 py-2 text-[var(--danger-color)] hover:bg-white/5 rounded transition-colors whitespace-nowrap"
                    >
                        <LogOut size={22} className="shrink-0" />
                        {isSidebarOpen && <span className="font-bold">Cerrar Sesión</span>}
                    </button>
                </div>

                <div className="p-6 text-[10px] text-[var(--text-secondary)] text-center">
                    {isSidebarOpen ? 'v2.0 Afterword Edition' : 'v2.0'}
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    );
}
