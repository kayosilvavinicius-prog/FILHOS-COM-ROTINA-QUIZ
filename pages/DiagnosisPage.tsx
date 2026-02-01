
import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  MapPin, 
  Sparkles, 
  Tv, 
  LayoutGrid, 
  ChevronDown,
  Lock,
  CheckCircle2,
  Hand,
  Check,
  Gift,
  ArrowRight,
  AlertTriangle,
  Award
} from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

const CHECKOUT_URL = "https://pay.cakto.com.br/8orm8zt_705304";

const ScratchCardOffer: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#CBD5E1';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#64748B';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE PARA DESCOBRIR A SOLUÇÃO', canvas.width / 2, canvas.height / 2 + 5);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 25, 0, Math.PI * 2);
      ctx.fill();
      if (!isScratched) setIsScratched(true);
    };

    const handleMove = (e: any) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX || e.touches?.[0].clientX) - rect.left;
      const y = (e.clientY || e.touches?.[0].clientY) - rect.top;
      if (x && y) scratch(x, y);
    };

    canvas.addEventListener('mousemove', (e) => e.buttons === 1 && handleMove(e));
    canvas.addEventListener('touchmove', handleMove);
  }, []);

  useEffect(() => {
    if (isScratched && !isRevealed) {
      setTimeout(() => {
        setIsRevealed(true);
        onComplete();
      }, 1500);
    }
  }, [isScratched]);

  return (
    <div className="relative w-full min-h-[420px] bg-white rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vigorous-scratch-big {
          0% { transform: translate(0, 0) rotate(0); }
          20% { transform: translate(-100px, -30px) rotate(-15deg); }
          40% { transform: translate(100px, 15px) rotate(15deg); }
          60% { transform: translate(-80px, 30px) rotate(-10deg); }
          80% { transform: translate(80px, -15px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0); }
        }
        .animate-hand-vivid-big { animation: vigorous-scratch-big 1.1s infinite ease-in-out; }
      `}} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-red-50">
        <div className="text-[#FE2C55] mb-4 animate-bounce"><Sparkles size={40} fill="currentColor" /></div>
        <h4 className="font-black text-[#0F172A] text-lg leading-tight mb-4 uppercase">
          VOCÊ GANHOU ACESSO AO APLICATIVO FILHOS COM ROTINA + PLANNER SEMANAL PARA IMPRESSÃO - POR 19,90. 🚀
        </h4>
        <div className="bg-white/60 p-4 rounded-2xl mb-6 text-left w-full max-w-[280px]">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700 mb-1">
            <Check size={14} className="text-green-500" /> App Rotina Visual (Acesso Imediato)
          </div>
          <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
            <Check size={14} className="text-green-500" /> Planner Semanal em PDF (Para Imprimir)
          </div>
        </div>
        <div className="flex items-baseline gap-2 mb-6">
          <span className="text-gray-400 line-through text-sm font-bold">R$ 97,00</span>
          <span className="text-4xl font-black text-[#FE2C55]">R$ 19,90</span>
        </div>
        <button 
          onClick={() => {
            funnelTracker.track("DIAGNOSTICO_CLICOU_CHECKOUT");
            window.location.href = CHECKOUT_URL;
          }}
          className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-full shadow-lg active:scale-95 transition-all border-b-6 border-red-800 flex items-center justify-center gap-2 uppercase tracking-tighter"
        >
          LIBERAR TUDO AGORA <ArrowRight size={18} />
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={420} className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      {!isScratched && (
        <div className="absolute bottom-20 right-10 pointer-events-none animate-hand-vivid-big">
          <Hand size={72} className="text-[#FE2C55] drop-shadow-xl" />
        </div>
      )}
    </div>
  );
};

const DiagnosisPage: React.FC = () => {
  const location = useLocation();
  const [openAccordion, setOpenAccordion] = useState<number | null>(null);
  const answers = location.state?.answers || {};

  useEffect(() => {
    funnelTracker.track("DIAGNOSTICO_ACESSO");
  }, []);

  const getDiagnostic = () => {
    const rotina = answers.rotina || "";
    if (rotina.includes("Sem horários")) return "Hoje seu filho vive em um estado de alerta constante, pois a falta de previsibilidade torna cada mudança de atividade uma ameaça ao controle dele.";
    if (rotina.includes("cansativa")) return "O cansaço que você sente hoje é o reflexo de uma rotina onde a criança resiste por não visualizar o fim das tarefas.";
    return "Sua casa já tem uma base, mas a falta de clareza visual faz com que a criança ainda dependa de você para lembrar cada passo, gerando exaustão mental materna.";
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans pb-24 overflow-x-hidden">
      <header className="px-6 pt-16 pb-8 text-center max-w-[600px] mx-auto space-y-4">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center text-green-500 shadow-sm">
            <CheckCircle2 size={32} />
          </div>
        </div>
        <h1 className="text-3xl font-[900] text-[#0F172A] tracking-tighter leading-tight uppercase">
          Seu Diagnóstico de Rotina
        </h1>
        <p className="text-gray-500 font-medium px-4 leading-relaxed text-sm">
          Com base no que você nos contou, este é o caminho para recuperar a paz na sua casa.
        </p>
      </header>

      <main className="max-w-[500px] mx-auto px-6 space-y-12">
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-[#FE2C55]">
            <MapPin size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Análise do momento atual</span>
          </div>
          <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-red-50 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FE2C55]/10" />
            <p className="text-[#0F172A] text-[17px] font-bold leading-relaxed italic text-center">
              "{getDiagnostic()}"
            </p>
          </div>
        </div>

        <div className="space-y-6 text-center pt-4">
          <h3 className="font-black text-gray-400 uppercase tracking-widest text-[11px]">Transformação Visual Desejada</h3>
          <div className="grid grid-cols-2 gap-5">
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-white shadow-lg bg-gray-200">
                <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ANTES.png" className="w-full h-full object-cover grayscale" alt="Antes" />
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight">SEM CLAREZA</span>
            </div>
            <div className="flex flex-col gap-4">
              <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-[#34C759]/30 shadow-2xl ring-4 ring-[#34C759]/10">
                <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/DEPOIS.png" className="w-full h-full object-cover" alt="Depois" />
              </div>
              <span className="text-[10px] font-black text-[#34C759] uppercase tracking-tight">COM MÉTODO</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div onClick={() => setOpenAccordion(openAccordion === 1 ? null : 1)} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 transition-all cursor-pointer">
            <div className="p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center text-[#FE2C55]"><Tv size={20} /></div>
                <h4 className="font-black text-[#0F172A] text-sm">O Cérebro Visual</h4>
              </div>
              <ChevronDown size={20} className={`text-gray-300 transition-transform ${openAccordion === 1 ? 'rotate-180' : ''}`} />
            </div>
            {openAccordion === 1 && <div className="px-6 pb-6 text-xs text-gray-500 font-medium leading-relaxed">Crianças não entendem conceitos abstratos como "daqui a pouco". Elas precisam VER para cooperar. O método transforma ordens em imagens.</div>}
          </div>
        </div>

        <div className="pt-10 space-y-8">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#FE2C55] text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest mb-6 shadow-lg shadow-red-500/20">
              <Gift size={14} /> PRESENTE DE ATIVAÇÃO
            </div>
            <h3 className="text-2xl font-black text-[#0F172A] mb-3 tracking-tighter uppercase">RASPE PARA DESCOBRIR COMO COMEÇAR A RESOLVER SUA ROTINA AINDA HOJE:</h3>
            <p className="text-gray-500 text-sm font-medium mb-10 leading-relaxed italic">"Libere agora a solução tecnológica que vai dar autonomia para seu filho e descanso para você."</p>
          </div>
          
          <ScratchCardOffer onComplete={() => funnelTracker.track("DIAGNOSTICO_RASPADINHA_REVELADA")} />

          <div className="pt-8 space-y-8">
            <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] flex items-start gap-4 shadow-sm">
              <AlertTriangle className="text-amber-500 shrink-0" size={32} />
              <div>
                <p className="text-[14px] font-black text-amber-900 leading-snug uppercase tracking-tight">
                  ESSA É A UNICA FORMA DE ADQUIRIR O APP E SE SAIR DA TELA VAI PERDER A CHANCE. 🚨
                </p>
                <p className="text-[12px] text-amber-700 mt-2 font-medium">Este cupom de desconto exclusivo é temporário e vinculado ao seu diagnóstico.</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-6 bg-gray-50 p-10 rounded-[3rem] border border-gray-100">
               <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-[#34C759] shadow-md border border-gray-100">
                 <Award size={48} />
               </div>
               <div className="text-center">
                 <h4 className="font-black text-[#0F172A] text-lg mb-2 uppercase">GARANTIA INCONDICIONAL DE 30 DIAS</h4>
                 <p className="text-[12px] text-gray-500 font-bold leading-relaxed px-4">
                   Teste o aplicativo e o planner por 30 dias inteiros. Se a rotina da sua casa não mudar completamente, nós devolvemos cada centavo do seu investimento imediatamente.
                 </p>
               </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 opacity-30 py-10">
          <Lock size={24} />
          <span className="text-[10px] font-black uppercase tracking-widest">Pagamento Seguro e Processamento Criptografado</span>
        </div>
      </main>

      <footer className="text-center py-10 opacity-20 text-[9px] font-bold uppercase tracking-widest">
        © 2025 Filhos com Rotina • Todos os Direitos Reservados
      </footer>
    </div>
  );
};

export default DiagnosisPage;
