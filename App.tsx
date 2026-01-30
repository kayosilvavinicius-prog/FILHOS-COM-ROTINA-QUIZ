import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import SalesPage from './pages/SalesPage';
import PrivacyPage from './pages/PrivacyPage';
import { funnelTracker } from './services/funnelTracker';

const InitialTracker = () => {
  useEffect(() => {
    // REGRA CRÍTICA: Registrar imediatamente o carregamento da página
    funnelTracker.track("ETAPA_1_CARREGOU_PAGINA");
  }, []);
  return null;
};

const AnalyticsTracker = () => {
  const location = useLocation();

  useEffect(() => {
    try {
      const fbq = (window as any).fbq;
      if (typeof fbq === 'function') {
        fbq('track', 'PageView');
      }

      if (location.pathname === '/sales') {
        funnelTracker.track('ENTROU_PAGINA_VENDAS');
      }
    } catch (e) {
      console.warn("Analytics error:", e);
    }
  }, [location]);

  return null;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <InitialTracker />
      <AnalyticsTracker />
      <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] selection:bg-[#FE2C55]/20">
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;