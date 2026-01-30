
import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import SalesPage from './pages/SalesPage';
import PrivacyPage from './pages/PrivacyPage';
import IntroWhatsAppMission from './pages/IntroWhatsAppMission';
import CallMission from './pages/CallMission';
import WhatsAppMission from './pages/WhatsAppMission';
import VideoMission from './pages/VideoMission';
import { funnelTracker } from './services/funnelTracker';
import { preloadFunnelImages } from './services/imagePreloader';

const InitialTracker = () => {
  useEffect(() => {
    // REGRA CRÍTICA: Registrar imediatamente o carregamento da página
    funnelTracker.track("ETAPA_1_CARREGOU_PAGINA");
    
    // Inicia o pré-carregamento de todas as imagens do funil para evitar delays
    preloadFunnelImages();
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

// Added missing routes for the interactive mission-based funnel flow
const App: React.FC = () => {
  return (
    <HashRouter>
      <InitialTracker />
      <AnalyticsTracker />
      <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] selection:bg-[#FE2C55]/20">
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/intro-whatsapp" element={<IntroWhatsAppMission />} />
          <Route path="/missao-1-ligacao" element={<CallMission />} />
          <Route path="/missao-2-whatsapp" element={<WhatsAppMission />} />
          <Route path="/missao-3-video" element={<VideoMission />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;
