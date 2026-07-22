import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { FazendasPage } from './pages/FazendasPage';
import { DispositivosPage } from './pages/DispositivosPage';
import { LeiturasPage } from './pages/LeiturasPage';
import { AlertasPage } from './pages/AlertasPage';

/**
 * Componente raiz da aplicação React Agrotech-Front.
 * Integra a barra de navegação lateral com as rotas principais.
 */
export const App: React.FC = () => {
  return (
      <Router>
        <div className="flex min-h-screen bg-gray-100">
          <Sidebar />
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/fazendas" element={<FazendasPage />} />
              <Route path="/dispositivos" element={<DispositivosPage />} />
              <Route path="/leituras" element={<LeiturasPage />} />
              <Route path="/alertas" element={<AlertasPage />} />
            </Routes>
          </main>
        </div>
      </Router>
  );
};

export default App;