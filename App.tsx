import React, { useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import QuizPage from './pages/QuizPage';
import SalesPage from './pages/SalesPage';
import TestHome from './pages/TestHome';
import PrivacyPage from './pages/PrivacyPage';
import { Settings } from 'lucide-react';
import { funnelTracker, FunnelStep } from './services/funnelTracker';

const CRITICAL_ASSETS = [
  // Expert & Mockups
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/2e88443c33f9150b3ac0649a37043d6ff25a5844/Expert%20aline.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ChatGPT%20Image%20Jan%2030%2C%202026%2C%2001_13_07%20AM.png",
  
  // Quiz Step 1 - Idades
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/2%20a%204%20anos.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/5%20a%207%20anos.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/8%20a%2010%20anos.png",
  
  // Quiz Step 8 - Previsibilidade
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/25ea3c03a78fb758ada36f9f68ed5ed31957f3e9/Gemini_Generated_Image_bwp8yubwp8yubwp8.png",
  
  // Diagnóstico - Antes e Depois
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/c65cf9f2d3ed2b48d1d32d3cb5167d89f8e9edd6/ANTES.png",
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/c65cf9f2d3ed2b48d1d32d3cb5167d89f8e9edd6/DEPOIS.png",
  
  // WhatsApp & Outros
  "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg"
];

const AssetPreloader = () => {
  useEffect(() => {
    CRITICAL_ASSETS.forEach(url => {
      const img = new Image();
      img.src = url;
    });
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

      const routeToStep: Record<string, FunnelStep> = {
        '/': 'ETAPA_0_ENTROU_FUNIL',
        '/sales': 'ETAPA_4_PAGINA_VENDAS'
      };

      const step = routeToStep[location.pathname];
      if (step) {
        funnelTracker.track(step);
      }
    } catch (e) {
      console.warn("Analytics error:", e);
    }
  }, [location]);

  return null;
};

const DevMenuTrigger = () => {
  const navigate = useNavigate();
  const location = useLocation();
  if (location.pathname === '/dev') return null;
  return (
    <button 
      onClick={() => navigate('/dev')}
      className="fixed bottom-4 right-4 z-[9999] p-3 bg-black/5 hover:bg-black/20 backdrop-blur-sm text-black/10 hover:text-black/50 rounded-full transition-all active:scale-90"
      title="Painel de Missões"
    >
      <Settings size={20} />
    </button>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AssetPreloader />
      <AnalyticsTracker />
      <DevMenuTrigger />
      <div className="min-h-screen bg-[#FAF9F6] text-[#0F172A] selection:bg-[#FE2C55]/20">
        <Routes>
          <Route path="/" element={<QuizPage />} />
          <Route path="/sales" element={<SalesPage />} />
          <Route path="/dev" element={<TestHome />} />
          <Route path="/privacidade" element={<PrivacyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </HashRouter>
  );
};

export default App;