
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Layout, 
  Trophy, 
  AlertCircle, 
  ChevronRight,
  Quote,
  Timer,
  Lock,
  X,
  Brain,
  Lightbulb
} from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

const CHECKOUT_URL = "https://pay.cakto.com.br/8orm8zt_705304";

const SalesPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(900); // 15 min
  const [scrolled, setScrolled] = useState(false);
  const offerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    funnelTracker.track("ENTROU_PAGINA_VENDAS");
    window.scrollTo(0, 0);
    
    return () => {
      clearInterval(timer);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const scrollToOffer = () => {
    offerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handlePurchase = () => {
    funnelTracker.track("CTA_COMPRA_CLICADO");
    funnelTracker.track("CHECKOUT_INICIADO");
    window.location.href = CHECKOUT_URL;
  };

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] min-h-screen font-sans selection:bg-[#FE2C55]/10 overflow-x-hidden pb-10">
      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes shine { 0% { left: -100%; } 20% { left: 100%; } 100% { left: 100%; } }
        .animate-shine { position: relative; overflow: hidden; }
        .animate-shine::after { content: ''; position: absolute; top: -50%; left: -100%; width: 50%; height: 200%; background: rgba(255, 255, 255, 0.3); transform: rotate(30deg); animation: shine 4s infinite; }
      `}} />

      {/* Sticky Timer Banner */}
      <div className="bg-[#FE2C55] text-white py-2 text-[10px] font-black uppercase tracking-[0.2em] sticky top-0 z-[100] flex items-center justify-center gap-2 px-4 shadow-lg">
        <Timer size={14} /> Oferta expira em: {formatTimer(timeLeft)}
      </div>

      {/* 1. HERO SECTION */}
      <section className="px-6 pt-12 pb-16 text-center max-w-[800px] mx-auto">
        <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full mb-8 shadow-sm border border-gray-100">
          <Star className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Mais de 5.400 mães transformadas</span>
        </div>

        <h1 className="text-[42px] sm:text-[64px] font-[900] leading-[1.05] mb-6 tracking-tight">
          Pare de gritar.<br />
          Comece a <span className="text-[#FE2C55] italic">guiar.</span>
        </h1>

        <p className="text-gray-500 text-lg sm:text-xl font-medium leading-relaxed mb-10 px-4">
          O Sistema Filhos com Rotina não é apenas um guia. É o método visual que ajuda seu filho a cooperar mais e devolve paz para a sua casa.
        </p>

        <button 
          onClick={scrollToOffer}
          className="w-full max-w-[400px] bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] text-[15px] sm:text-[17px] shadow-[0_20px_40px_rgba(254,44,85,0.4)] transition-all active:scale-95 border-b-[6px] border-red-700 uppercase tracking-tight animate-shine"
        >
          Quero a paz de volta na minha casa
        </button>

        <div className="mt-12 rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white bg-white aspect-[16/10] relative group">
          <img 
            src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ChatGPT%20Image%20Jan%2030%2C%202026%2C%2001_13_07%20AM.png" 
            className="w-full h-full object-cover" 
            alt="Mãe e filho felizes com rotina visual" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        </div>
      </section>

      {/* 2. SEÇÃO "VOCÊ SABIA DISSO?" (BLOCO TELAS) */}
      <section className="bg-white py-20 px-6 sm:px-12 border-y border-gray-50">
        <div className="max-w-[1100px] mx-auto bg-white rounded-[3rem] p-8 sm:p-16 shadow-[0_10px_60px_rgba(0,0,0,0.03)] border border-gray-50">
          <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-start">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-[#E9F2FF] text-[#3B82F6] px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest">
                <Lightbulb size={14} /> Você sabia disso?
              </div>
              
              <div className="space-y-6">
                <h2 className="text-[32px] sm:text-[44px] font-black leading-[1.1] text-[#0F172A] tracking-tight">
                  A Sociedade Brasileira de Pediatria <span className="text-[#3B82F6] underline decoration-4 underline-offset-4">não proíbe</span> o uso de telas.
                </h2>
                <p className="text-gray-500 text-lg leading-relaxed">
                  Isso mesmo. O segredo não está na proibição total, mas no <strong>equilíbrio e no limite adequado</strong> de exposição para cada fase do desenvolvimento.
                </p>
              </div>

              <div className="space-y-4">
                <div className="bg-white border border-red-50 p-6 rounded-3xl flex items-center gap-5 shadow-[0_5px_15px_rgba(254,44,85,0.02)]">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                    <X size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    <span className="font-black text-[#0F172A]">Menores de 2 anos:</span> Exposição zero, nem mesmo passivamente.
                  </p>
                </div>
                <div className="bg-white border border-red-50 p-6 rounded-3xl flex items-center gap-5 shadow-[0_5px_15px_rgba(254,44,85,0.02)]">
                  <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center text-red-400 shrink-0">
                    <X size={20} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 leading-tight">
                    <span className="font-black text-[#0F172A]">2 a 5 anos:</span> Máximo de 1 hora/dia, sempre com supervisão.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-[#F8FBFF] rounded-[3rem] p-10 sm:p-12 relative overflow-hidden border border-blue-50/50 shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                  <Brain size={24} />
                </div>
                <h3 className="text-xl font-black text-[#0F172A]">O Problema Real</h3>
              </div>

              <div className="space-y-6">
                <p className="text-gray-500 leading-relaxed font-medium">
                  Seu filho não briga pela tela porque é "viciado", ele briga porque <strong>não consegue enxergar o que vem depois</strong> daquele prazer imediato.
                </p>
                
                <div className="pt-6 border-t border-blue-100/50">
                  <p className="text-[#0F172A] font-bold leading-relaxed text-[15px]">
                    O Filhos com Rotina ensina a criança a ter o "GPS Visual" do dia. Quando ela sabe exatamente a hora de brincar, comer e sim, o momento da tela, a ansiedade acaba e a cooperação começa.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PROVA SOCIAL */}
      <section className="py-20 bg-[#FAF9F6]">
        <div className="text-center mb-10 px-6">
          <h2 className="text-2xl font-black mb-4 tracking-tight">O que as mães estão dizendo</h2>
          <div className="flex justify-center gap-1 text-yellow-400">
            <Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" /><Star size={16} fill="currentColor" />
          </div>
        </div>

        <div className="flex overflow-x-auto gap-5 px-6 pb-8 hide-scrollbar snap-x snap-mandatory">
          {[
            { name: "Juliana Santos", child: "Mãe do Pedro (4 anos)", text: "Meu filho de 4 anos não queria escovar os dentes por nada. Com o quadro visual, ele mesmo vai e faz sem eu precisar gritar." },
            { name: "Renata Lima", child: "Mãe da Bia (6 anos)", text: "A hora de desligar o tablet era um pesadelo. Agora ela olha pro cronômetro visual e aceita a próxima atividade numa boa." },
            { name: "Camila M.", child: "Mãe do Leo (3 anos)", text: "O manual de emergência me salvou hoje no shopping. Consegui acalmar ele sem stress em menos de 5 minutos." },
            { name: "Patrícia V.", child: "Mãe do Lucas (7 anos)", text: "Eu achava que rotina era prender a criança, mas descobri que é o que dá liberdade pra eles se sentirem seguros." }
          ].map((item, i) => (
            <div key={i} className="min-w-[280px] sm:min-w-[320px] bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 snap-center flex flex-col justify-between">
              <div>
                <Quote className="text-[#FE2C55] opacity-20 mb-4" size={32} fill="currentColor" />
                <p className="text-[#0F172A] font-bold text-[15px] leading-relaxed mb-6 italic">"{item.text}"</p>
              </div>
              <div>
                <p className="font-black text-[13px]">{item.name}</p>
                <p className="text-[11px] text-gray-400 font-medium">{item.child}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. OFERTA FINAL - LAYOUT ATUALIZADO CONFORME IMAGEM */}
      <section ref={offerRef} className="py-24 px-6 bg-[#FAF9F6]">
        <div className="max-w-[600px] mx-auto text-center">
          <div className="bg-white border-2 border-gray-50 rounded-[3.5rem] p-10 sm:p-16 shadow-[0_20px_60px_rgba(0,0,0,0.05)] relative">
            <p className="text-gray-400 font-bold line-through mb-4 text-sm sm:text-lg">Valor regular do sistema: R$ 358,80 / ano</p>
            
            <h3 className="text-[32px] sm:text-[48px] font-black text-[#FE2C55] mb-10 leading-[1.1]">
              Por uma <span className="italic underline decoration-[#FE2C55] underline-offset-8 decoration-2">fração</span> deste valor
            </h3>

            <div className="relative group">
              <button 
                onClick={handlePurchase}
                className="w-full bg-[#FE2C55] text-white font-[900] py-6 rounded-3xl text-sm sm:text-base shadow-[0_15px_40px_rgba(254,44,85,0.3)] transition-all active:scale-[0.97] uppercase tracking-wider flex items-center justify-center gap-3 animate-shine group"
              >
                Quero garantir meu acesso agora
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            <div className="mt-8">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest leading-relaxed">
                ACESSO IMEDIATO • VAGAS LIMITADAS • GARANTIA DE 30 DIAS
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Atualizado */}
      <footer className="py-20 px-6 text-center text-gray-400 text-[10px] font-medium max-w-[1000px] mx-auto space-y-8">
        <div className="flex justify-center gap-8">
          <Link to="/privacidade" className="hover:text-[#FE2C55] transition-colors font-bold uppercase tracking-widest">Política de Privacidade</Link>
        </div>
        <p className="leading-relaxed opacity-60">
          ESTE SITE NÃO É DO FACEBOOK: Este site não faz parte do site do Facebook ou do Facebook Inc. Além disso, este site não é endossado pelo Facebook de forma alguma. FACEBOOK é uma marca comercial da FACEBOOK, Inc.
        </p>
        <p className="font-black opacity-40 uppercase tracking-[0.1em]">© 2025 Filhos com Rotina • Todos os Direitos Reservados</p>
      </footer>

      {/* Floating Sticky CTA */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 z-[200] transition-all duration-700 transform ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="max-w-[500px] mx-auto">
          <button 
            onClick={scrollToOffer} 
            className="w-full bg-[#FE2C55] text-white font-[900] py-5 rounded-[2rem] shadow-[0_10px_40px_rgba(254,44,85,0.4)] border-2 border-white/20 uppercase tracking-wider text-sm flex items-center justify-center gap-2"
          >
            Quero Garantir Meu Acesso Agora
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesPage;
