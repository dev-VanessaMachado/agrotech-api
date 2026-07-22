import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Tractor, Cpu, Activity, AlertTriangle } from 'lucide-react';

/**
 * Componente de barra de navegação lateral (Sidebar) do sistema Agrotech.
 * Provê links diretos com indicação de rota ativa para navegação entre as telas.
 */
export const Sidebar: React.FC = () => {
    const location = useLocation();

    const menuItems = [
        { label: 'Dashboard', path: '/', icon: LayoutDashboard },
        { label: 'Fazendas', path: '/fazendas', icon: Tractor },
        { label: 'Dispositivos', path: '/dispositivos', icon: Cpu },
        { label: 'Telemetria', path: '/leituras', icon: Activity },
        { label: 'Alertas', path: '/alertas', icon: AlertTriangle },
    ];

    return (
        <aside className="w-64 bg-emerald-900 text-white min-h-screen flex flex-col shadow-xl">
            <div className="p-6 border-b border-emerald-800 flex items-center space-x-3">
                <Tractor className="w-8 h-8 text-emerald-400" />
                <div>
                    <h1 className="text-xl font-bold tracking-wider">Agrotech</h1>
                    <p className="text-xs text-emerald-300">Gestão & Monitoramento</p>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors font-medium text-sm ${
                                isActive
                                    ? 'bg-emerald-700 text-white shadow-md'
                                    : 'text-emerald-100 hover:bg-emerald-800 hover:text-white'
                            }`}
                        >
                            <Icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t border-emerald-800 text-xs text-center text-emerald-400">
                Agrotech Platform &copy; 2026
            </div>
        </aside>
    );
};