import React from 'react';

/**
 * Página principal de visão geral e indicadores da plataforma.
 */
export const DashboardPage: React.FC = () => {
    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-4">Visão Geral do Campo</h1>
            <p className="text-gray-600">Seja bem-vinda ao painel de monitoramento agrícola Agrotech.</p>
        </div>
    );
};