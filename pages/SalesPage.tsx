import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Star,
  Quote,
  ShieldAlert,
  ChevronDown,
  Lightbulb,
  Brain
} from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

const CHECKOUT_URL = "https://pay.cakto.com.br/8orm8zt_705304";

const SalesPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const finalCtaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFinal = () => {
    finalCtaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const openCheckoutProcess = () => {
    // RASTREAMENTO OBRIGATÓRIO
    funnelTracker.track("CTA_COMPRA_CLICADO");
    funnelTracker.track("CHECKOUT_INICIADO");

    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: 'Filhos com Rotina',
        value: 19.90,
        currency: 'BRL'
      });
    }

    // Redirect
    window.location.href = CHECKOUT_URL;
  };

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] min-h-screen font-sans pb-32 overflow-x-hidden selection:bg-[#FE2C55]/20 text-[16px]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
        .animate-shine { position: relative; overflow: hidden; }
        .animate-shine::after { content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%; background: rgba(255, 255, 255, 0.4); transform: rotate(30deg); animation: shine 3s infinite; }
      `}} />

      <div className="bg-[#FE2C55] text-white text-[10px] sm:text-xs font-black py-2.5 text-center uppercase tracking-[0.2em] sticky top-0 z-[100] shadow-md px-4">
        ACESSO IMEDIATO
      </div>

      <section className="px-6 pt-12 pb-20 max-w-[1100px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-red-100 px-4 py-2 rounded-full mb-8 shadow-sm">
          <Star className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FE2C55]">Mais de 5.400 mães transformadas</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black leading-[1.05] mb-8 tracking-tight text-[#0F172A]">
          Pare de gritar. <br/>Comece a <span className="text-[#FE2C55] italic">guiar</span>.
        </h1>
        
        <p className="text-gray-500 mb-12 text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto font-medium">
          O Sistema Filhos com Rotina usa previsibilidade visual para ajudar seu filho a cooperar sem gritos.
        </p>

        <button 
          onClick={scrollToFinal} 
          className="w-full max-w-[550px] bg-[#FE2C55] text-white font-black py-7 rounded-[2.5rem] text-xl shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-red-700"
        >
          QUERO A PAZ DE VOLTA NA MINHA CASA <ChevronDown />
        </button>
      </section>

      {/* CTA Final */}
      <section ref={finalCtaRef} className="py-32 px-6 text-center">
        <div className="max-w-[700px] mx-auto">
          <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl text-left border border-gray-100">
            <h2 className="text-3xl font-black mb-8">Tudo o que você recebe:</h2>
            <div className="space-y-4 mb-12">
              <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-[1.5rem] border border-gray-100"><CheckCircle2 className="text-[#FE2C55]" size={18}/><span className="font-black text-[13px]">Sistema Visual Filhos com Rotina</span></div>
              <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-[1.5rem] border border-gray-100"><Sparkles className="text-[#FE2C55]" size={18}/><span className="font-black text-[13px]">Rotinas prontas por idade</span></div>
              <div className="flex items-center gap-4 bg-red-50/30 p-4 rounded-[1.5rem] border border-red-100/50">
                <ShieldAlert className="text-red-600 shrink-0" size={18}/>
                <span className="font-black text-[13px]">Manual de Emergência para Crises</span>
              </div>
            </div>

            <button 
              onClick={openCheckoutProcess} 
              className="w-full bg-[#FE2C55] text-white font-black py-7 rounded-[2rem] text-xl shadow-[0_20px_50px_rgba(254,44,85,0.4)] animate-shine border-b-4 border-red-700"
            >
              GARANTIR MEU ACESSO <ArrowRight size={24} />
            </button>
          </div>
        </div>
      </section>

      <div className={`fixed bottom-0 left-0 right-0 p-4 z-[200] transition-all duration-700 transform ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="max-w-[500px] mx-auto">
          <button 
            onClick={openCheckoutProcess} 
            className="w-full bg-[#FE2C55] text-white font-black py-5 rounded-[2rem] shadow-xl border-2 border-white/20 uppercase tracking-tight text-sm animate-shine"
          >
            Aproveitar Preço Especial
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;