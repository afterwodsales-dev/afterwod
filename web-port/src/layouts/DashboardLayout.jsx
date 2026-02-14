import React, { useState, useEffect } from 'react';
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
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth > 768);
    const { logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (window.innerWidth < 768) {
            setSidebarOpen(false);
        }
    }, [location]);

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
        <div className="flex min-h-screen bg-[var(--bg-color)] text-[var(--text-color)] overflow-hidden">
            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-[var(--sidebar-color)] border-b border-[var(--border-color)] z-40 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3">
                    <img src="logo.png" alt="Militar Box" className="h-8" />
                    <span className="font-[var(--font-header)] text-lg text-[var(--accent-color)]">MILITAR BOX</span>
                </div>
                <button
                    onClick={() => setSidebarOpen(true)}
                    className="p-2 hover:bg-white/5 rounded text-[var(--text-secondary)]"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Overlay for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`
                    fixed md:static inset-y-0 left-0 z-50
                    ${isSidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full md:translate-x-0 md:w-20'} 
                    bg-[var(--sidebar-color)] transition-all duration-300 ease-in-out border-r border-[var(--border-color)] 
                    flex flex-col shrink-0 h-full shadow-2xl md:shadow-none
                `}
            >
                <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between h-16 shrink-0">
                    <div className="flex items-center gap-3">
                        <img src="logo.png" alt="Militar Box" className={`h-10 transition-all ${isSidebarOpen ? 'w-10' : 'w-8 ml-[-4px]'}`} />
                        {isSidebarOpen && <span className="font-[var(--font-header)] text-xl text-[var(--accent-color)] truncate animate-fade-in">MILITAR BOX</span>}
                    </div>

                    {/* Desktop Toggle */}
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="hidden md:block p-2 hover:bg-white/5 rounded text-[var(--text-secondary)]"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    {/* Mobile Close */}
                    <button
                        onClick={() => setSidebarOpen(false)}
                        className="md:hidden p-2 hover:bg-white/5 rounded text-[var(--text-secondary)] ml-auto"
                    >
                        <X size={24} />
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
                            {(isSidebarOpen || window.innerWidth < 768) && <span className="font-semibold">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-[var(--border-color)]">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-4 px-2 py-2 text-[var(--danger-color)] hover:bg-white/5 rounded transition-colors whitespace-nowrap"
                    >
                        <LogOut size={22} className="shrink-0" />
                        {(isSidebarOpen || window.innerWidth < 768) && <span className="font-bold">Cerrar Sesión</span>}
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-1 overflow-auto h-screen pt-16 md:pt-0 pointer-events-auto">
                <Outlet />
            </main>
        </div>
    );
}
