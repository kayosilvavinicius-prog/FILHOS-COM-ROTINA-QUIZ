
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Quote, 
  Gift, 
  ArrowRight, 
  Sparkles, 
  Tv, 
  LayoutGrid, 
  ChevronDown,
  Lock,
  CheckCircle2,
  Hand,
  Check
} from 'lucide-react';
import IOSStatusBar from '../components/iOSStatusBar';
import { funnelTracker } from '../services/funnelTracker';

const CHECKOUT_URL = "https://pay.cakto.com.br/8orm8zt_705304";

const ScratchCard: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScratched, setIsScratched] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#CBD5E1'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 16px Inter';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE AQUI PARA O PRESENTE', canvas.width / 2, canvas.height / 2 + 6);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      if (!isScratched) setIsScratched(true);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (e.buttons !== 1) return;
      const rect = canvas.getBoundingClientRect();
      scratch(e.clientX - rect.left, e.clientY - rect.top);
    };

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      const touch = e.touches[0];
      scratch(touch.clientX - rect.left, touch.clientY - rect.top);
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('touchmove', handleTouchMove);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  useEffect(() => {
    if (isScratched && !isRevealed) {
      const timer = setTimeout(() => {
        setIsRevealed(true);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isScratched]);

  const handleCheckoutClick = () => {
    // RASTREIO CLIQUE CHECKOUT
    funnelTracker.track("DIAGNOSTICO_CLICOU_CHECKOUT");
    window.location.href = CHECKOUT_URL;
  };

  return (
    <div className="relative w-full min-h-[340px] bg-white rounded-[2.5rem] border-4 border-white shadow-2xl overflow-hidden group">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes handScratch {
          0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
          25% { transform: translateX(-40px) translateY(-10px) rotate(-15deg); }
          50% { transform: translateX(0) translateY(0) rotate(0deg); }
          75% { transform: translateX(-40px) translateY(-10px) rotate(-15deg); }
        }
        .animate-hand-scratch {
          animation: handScratch 1.5s infinite ease-in-out;
        }
      `}} />

      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50 overflow-y-auto">
        <div className="text-[#FE2C55] mb-2 animate-bounce shrink-0">
          <Sparkles size={32} fill="currentColor" />
        </div>
        <h4 className="font-black text-[#0F172A] text-[15px] sm:text-lg leading-tight mb-4 uppercase tracking-tighter">
          Você ganhou o acesso ao sistema Filhos com Rotina por apenas 19,90!
        </h4>
        
        <div className="space-y-1.5 mb-6 text-left w-full max-w-[280px] mx-auto">
          {[
            "Sistema de Rotina Visual Digital (aplicativo)",
            "Guia de Transições Sem Birras",
            "Bônus: Tabela de Recompensas",
            "Bônus: Ritual do Sono Perfeito"
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2 text-[11px] font-bold text-gray-600">
              <Check size={14} className="text-green-500 shrink-0" strokeWidth={3} />
              {item}
            </div>
          ))}
        </div>

        <button 
          onClick={handleCheckoutClick}
          className="bg-[#FE2C55] text-white text-[13px] font-black py-4 px-8 rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2 border-b-4 border-red-700 shrink-0"
        >
          APROVEITAR AGORA <ArrowRight size={16} />
        </button>
      </div>

      <canvas 
        ref={canvasRef} 
        width={400} 
        height={400} 
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      />
      
      {!isScratched && (
        <div className="absolute bottom-8 right-12 pointer-events-none animate-hand-scratch">
          <div className="relative">
             <Hand size={48} className="text-[#FE2C55] fill-[#FE2C55]/20 drop-shadow-[0_10px_10px_rgba(0,0,0,0.2)]" strokeWidth={1.5} />
             <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm border border-gray-100">
                <Sparkles size={12} className="text-[#FFD700] animate-pulse" fill="currentColor" />
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

const DiagnosisPage: React.FC = () => {
  const location = useLocation();
  const [showBonus, setShowBonus] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const answers = location.state?.answers || {};

  useEffect(() => {
    // RASTREIO ACESSO DIAGNÓSTICO
    funnelTracker.track("DIAGNOSTICO_ACESSO");
  }, []);

  const getDiagnostic = () => {
    const rotina = answers.rotina || "";
    if (rotina.includes("Sem horários")) return "Hoje seu filho vive em um estado de alerta constante, pois a falta de previsibilidade torna cada mudança de atividade uma ameaça ao controle dele.";
    if (rotina.includes("cansativa")) return "O cansaço que você sente hoje é o reflexo de uma rotina onde a criança resiste por não visualizar o fim das tarefas.";
    return "Você já tem uma base, mas a falta de clareza visual faz com que a criança ainda dependa de você para lembrar cada passo, gerando cansaço mental.";
  };

  const toggleAccordion = (index: number) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  const handleScratchComplete = () => {
    setShowBonus(true);
    // RASTREIO RASPADINHA REVELADA
    funnelTracker.track("DIAGNOSTICO_RASPADINHA_REVELADA");
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-24 overflow-x-hidden">
      <IOSStatusBar dark />
      
      <header className="px-6 pt-10 pb-8 text-center max-w-[600px] mx-auto space-y-4">
        <div className="flex justify-center mb-4">
          <CheckCircle2 size={48} className="text-green-500" />
        </div>
        <h1 className="text-3xl font-[900] text-[#0F172A] tracking-tighter leading-tight uppercase">
          Seu Guia de Rotina
        </h1>
        <p className="text-gray-500 font-medium px-4 leading-relaxed text-sm">
          Analisamos as suas respostas e preparamos os ajustes certos para o seu filho.
        </p>
      </header>

      <main className="max-w-[500px] mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#FE2C55]">
            <MapPin size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Ponto de partida atual</span>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-red-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FE2C55]/10" />
            <p className="text-[#0F172A] text-[17px] font-bold leading-relaxed italic text-center">
              "{getDiagnostic()}"
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Sua trilha de evolução</span>
          <div className="relative pt-6 pb-12 px-2">
            <div className="h-[10px] w-full flex rounded-full overflow-hidden shadow-inner bg-gray-100">
              <div className="w-1/3 h-full bg-[#FF6B6B]" />
              <div className="w-1/3 h-full bg-[#FFD93D]" />
              <div className="w-1/3 h-full bg-[#34C759]" />
            </div>
            <div className="absolute top-[16px] left-[35%] -translate-x-1/2 flex flex-col items-center">
               <div className="w-[36px] h-[36px] rounded-full border-[5px] border-white bg-[#FE2C55] shadow-[0_5px_20px_rgba(254,44,85,0.4)] ring-4 ring-red-50" />
               <div className="w-0.5 h-10 bg-red-100" />
            </div>
            <div className="flex justify-between mt-10 text-[9px] font-black text-gray-400 uppercase tracking-tight">
              <span>VOCÊ HOJE</span>
              <span>EM AJUSTE</span>
              <span className="text-[#34C759]">IDEAL</span>
            </div>
          </div>
        </div>

        <div className="space-y-6 text-center pt-4">
          <h3 className="font-black text-gray-400 uppercase tracking-widest text-[11px]">Meta de Transformação</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-white shadow-lg bg-gray-200">
                <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ANTES.png" className="w-full h-full object-cover grayscale" alt="Antes" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">SEM SISTEMA</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-[#34C759]/30 shadow-2xl ring-4 ring-[#34C759]/10">
                <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/DEPOIS.png" className="w-full h-full object-cover" alt="Depois" />
              </div>
              <span className="text-[10px] font-black text-[#34C759] uppercase tracking-tight">ROTINA VISUAL</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div 
            onClick={() => toggleAccordion(1)}
            className={`bg-white rounded-[2rem] shadow-sm border ${openAccordion === 1 ? 'border-red-100' : 'border-gray-100'} transition-all cursor-pointer overflow-hidden`}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FE2C55]">
                  <Tv size={24} />
                </div>
                <h4 className="font-black text-[#0F172A] text-sm">Clareza Visual</h4>
              </div>
              <ChevronDown size={20} className={`text-gray-300 transition-transform ${openAccordion === 1 ? 'rotate-180' : ''}`} />
            </div>
            {openAccordion === 1 && (
              <div className="px-6 pb-8 pt-0 animate-fade-in">
                <p className="text-[#0F172A] text-[13px] font-medium leading-relaxed opacity-70">
                  O cérebro infantil processa imagens 60 mil vezes mais rápido que palavras. Ao mostrar o que ele deve fazer em vez de apenas falar, você reduz a resistência imediata.
                </p>
              </div>
            )}
          </div>

          <div 
            onClick={() => toggleAccordion(2)}
            className={`bg-white rounded-[2rem] shadow-sm border ${openAccordion === 2 ? 'border-red-100' : 'border-gray-100'} transition-all cursor-pointer overflow-hidden`}
          >
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-[#FE2C55]">
                  <LayoutGrid size={24} />
                </div>
                <h4 className="font-black text-[#0F172A] text-sm">Poder de Escolha</h4>
              </div>
              <ChevronDown size={20} className={`text-gray-300 transition-transform ${openAccordion === 2 ? 'rotate-180' : ''}`} />
            </div>
            {openAccordion === 2 && (
              <div className="px-6 pb-8 pt-0 animate-fade-in">
                <p className="text-[#0F172A] text-[13px] font-medium leading-relaxed opacity-70">
                  Transições deixam de ser uma "ordem da mãe" e passam a ser "o que o quadro diz". Isso dá à criança uma sensação de autonomia, diminuindo o desejo de negociar tudo.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="pt-10 pb-10 space-y-6">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#FE2C55] text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
              <Gift size={14} /> PRESENTE PARA VOCÊ
            </div>
            <h3 className="text-xl font-black text-[#0F172A] mb-2 tracking-tighter">Uma chance extra de começar hoje</h3>
            <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">Raspe abaixo e libere seu bônus de ativação imediata.</p>
          </div>
          
          <ScratchCard onComplete={handleScratchComplete} />

          {showBonus && (
            <div className="animate-fade-in text-center pt-4">
              <p className="text-[11px] text-[#FE2C55] font-black uppercase tracking-[0.2em] animate-pulse">Bônus de Ativação Liberado!</p>
            </div>
          )}
        </div>

        <div className="flex flex-col items-center gap-4 opacity-40 py-10 border-t border-gray-100">
          <Lock size={28} />
          <span className="text-[10px] font-black uppercase tracking-widest">Diagnóstico Pessoal e Protegido</span>
        </div>
      </main>

      <footer className="text-center py-10 opacity-20 text-[9px] font-bold uppercase tracking-widest">
        © 2025 Filhos com Rotina • Todos os Direitos Reservados
      </footer>
    </div>
  );
};

export default DiagnosisPage;
