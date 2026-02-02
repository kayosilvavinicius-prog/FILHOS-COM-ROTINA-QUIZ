
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight, CheckCircle2, Hand, Gift, Play, ShieldCheck, Lock } from 'lucide-react';
import { funnelTracker, FunnelStep } from '../services/funnelTracker';

const VSL_VIDEO_URL = "https://res.cloudinary.com/dafhibb8s/video/upload/v1767185181/MINI_VSL_40MB_-_FILHOS_COM_ROTINA_jgqf44.mp4";
const CONCLUDE_TIMESTAMP = 206.5; 

interface Question {
  id: string;
  time: number;
  text: string;
  options: string[];
  trackKey: FunnelStep;
}

const QUESTIONS: Question[] = [
  { id: 'reconhecimento', time: 30, text: "Em qual dessas situações você mais se reconhece?", options: ["Falo várias vezes até virar grito", "Aviso, mas ele parece não ouvir", "O dia começa bem e termina em caos", "Cada mudança de atividade vira uma luta"], trackKey: "VSL_RESPOSTA_RECONHECIMENTO" },
  { id: 'rotina', time: 52, text: "Como é a rotina do seu filho hoje?", options: ["Tem horários, mas vive dando conflito", "É organizada, mas com muitos conflitos no dia a dia", "Bastante bagunçada e cansativa", "Não temos uma rotina definida"], trackKey: "VSL_RESPOSTA_ROTINA" },
  { id: 'reacao', time: 74, text: "Quando seu filho resiste, o que mais acontece?", options: ["Chora, grita ou se joga no chão", "Explode em birra", "Discute e tenta negociar como adulto", "Finge que não escuta"], trackKey: "VSL_RESPOSTA_REACAO" },
  { id: 'sentimento', time: 96, text: "Como você costuma se sentir com essa situação?", options: ["Cansada", "Irritada", "Culpada", "Sem saber o que fazer", "Tudo isso"], trackKey: "VSL_RESPOSTA_SENTIMENTO" },
  { id: 'clima', time: 118, text: "Como costuma ficar o clima na sua casa?", options: ["Estressante", "Imprevisível", "Muito cansativo", "Parece um campo de batalha"], trackKey: "VSL_RESPOSTA_CLIMA" },
  { id: 'futuro', time: 140, text: "Se nada mudar, como você imagina isso daqui a alguns meses?", options: ["Mais desgaste", "Mais conflitos", "Criança cada vez mais resistente", "Não quero nem pensar nisso"], trackKey: "VSL_RESPOSTA_FUTURO" },
  { id: 'aprendizado', time: 162, text: "Seu filho entende melhor quando você mostra ou apenas explica?", options: ["Quando vê", "Quando escuta", "Um pouco dos dois"], trackKey: "VSL_RESPOSTA_APRENDIZADO" },
  { id: 'crenca', time: 186, text: "Você acredita que se ele entendesse melhor o dia, ele cooperaria mais?", options: ["Sim, faz sentido", "Talvez", "Nunca pensei nisso"], trackKey: "VSL_RESPOSTA_CRENCA" }
];

const ScratchCardHeader: React.FC<{ onUnlock: () => void }> = ({ onUnlock }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isScratched, setIsScratched] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#E2E8F0';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE PARA LIBERAR SEU PRESENTE', canvas.width / 2, canvas.height / 2 + 5);

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
      const timer = setTimeout(() => setIsRevealed(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [isScratched]);

  return (
    <div className="relative w-full h-[220px] rounded-[2.5rem] overflow-hidden bg-white shadow-2xl border-4 border-white mb-8">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes vigorous-scratch {
          0% { transform: translate(0, 0) rotate(0); }
          20% { transform: translate(-80px, -20px) rotate(-15deg); }
          40% { transform: translate(80px, 10px) rotate(15deg); }
          60% { transform: translate(-70px, 20px) rotate(-10deg); }
          80% { transform: translate(70px, -10px) rotate(10deg); }
          100% { transform: translate(0, 0) rotate(0); }
        }
        .animate-hand-vivid { animation: vigorous-scratch 1.2s infinite ease-in-out; }
      `}} />
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
        <div className="text-[#FE2C55] mb-2"><Gift size={32} fill="currentColor" /></div>
        <p className="font-black text-[#0F172A] text-[15px] leading-tight mb-2 uppercase">
          VOCÊ ACABOU DE GANHAR O GUIA FILHOS COM ROTINA EM PDF DE FORMA GRATUITA! 🎁
        </p>
        <p className="text-[11px] text-gray-500 font-bold mb-4 leading-tight">
          ASSISTA O VÍDEO ABAIXO E RESPONDA O QUIZ PARA LIBERAR, LEVA APENAS 3 MINUTINHOS.
        </p>
        <button 
          onClick={onUnlock}
          className="bg-[#FE2C55] text-white text-[13px] font-black py-4 px-8 rounded-full shadow-xl active:scale-95 transition-all flex items-center gap-2 border-b-4 border-red-800 uppercase tracking-tight"
        >
          SEGUIR PARA LIBERAR MEU PRESENTE <ArrowRight size={16} />
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={220} className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      {!isScratched && (
        <div className="absolute bottom-10 right-10 pointer-events-none animate-hand-vivid">
          <Hand size={56} className="text-[#FE2C55]/60 drop-shadow-md" />
        </div>
      )}
    </div>
  );
};

const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [videoEnded, setVideoEnded] = useState(false);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    funnelTracker.track("ENTROU_PAGINA_VENDAS");
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    if (duration > 0) setProgress((time / duration) * 100);

    if (time >= CONCLUDE_TIMESTAMP && !videoEnded) {
      videoRef.current.pause();
      setVideoEnded(true);
      funnelTracker.track("VSL_VIDEO_CONCLUIDO");
    }

    const q = QUESTIONS.find(q => Math.floor(time) === q.time && !answeredIds.has(q.id));
    if (q && !activeQuestion) {
      setActiveQuestion(q);
      console.log(`[SalesPage] Exibindo pergunta: ${q.id}`);
    }
  };

  const handleAnswer = (option: string) => {
    if (!activeQuestion) return;
    
    // Disparo imediato do rastreamento
    funnelTracker.track(activeQuestion.trackKey, option);
    
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: option }));
    setAnsweredIds(prev => new Set(prev).add(activeQuestion.id));
    setActiveQuestion(null);
  };

  const unlockVideo = () => {
    setVideoUnlocked(true);
    funnelTracker.track("DIAGNOSTICO_RASPADINHA_REVELADA");
    setTimeout(() => {
      const container = document.getElementById('video-container');
      if (container) {
        container.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (videoRef.current) {
        videoRef.current.play().catch(() => {
          videoRef.current!.muted = true;
          setIsMuted(true);
          videoRef.current!.play();
        });
      }
    }, 150);
  };

  const goToCapture = () => {
    funnelTracker.track("VSL_CLICOU_VER_DIAGNOSTICO");
    navigate('/captura', { state: { answers } });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col items-center justify-start overflow-x-hidden relative text-[#0F172A] pb-20">
      <header className="w-full bg-white px-6 py-10 text-center shadow-sm relative z-50">
        <div className="max-w-[550px] mx-auto space-y-6">
          <h2 className="text-[#FE2C55] font-black text-[14px] sm:text-[16px] uppercase tracking-tight leading-tight px-4">
            OI, MÃE! QUERO TE PARABENIZAR POR CHEGAR ATÉ AQUI. 🌟
          </h2>
          <div className="px-2">
            <ScratchCardHeader onUnlock={unlockVideo} />
          </div>
        </div>
      </header>

      <div id="video-container" className={`relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl overflow-hidden mt-6 mb-10 sm:rounded-[3rem] border-4 border-white ring-8 ring-white/10 transition-all duration-1000 origin-top ${videoUnlocked ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95 pointer-events-none absolute'}`}>
        <video
          ref={videoRef}
          src={VSL_VIDEO_URL}
          className="w-full h-full object-cover"
          playsInline
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
          <div className="h-full bg-[#FE2C55] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={(e) => { e.stopPropagation(); setIsMuted(!isMuted); }} className="absolute top-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        {activeQuestion && (
          <div className="absolute inset-0 z-40 bg-black/40 flex items-center justify-center p-6 backdrop-blur-[4px]">
            <div className="bg-white/95 w-full rounded-[2.5rem] p-8 shadow-2xl animate-fade-in">
              <h3 className="text-lg font-black text-center mb-6">{activeQuestion.text}</h3>
              <div className="grid gap-3">
                {activeQuestion.options.map((opt, i) => (
                  <button key={i} onClick={() => handleAnswer(opt)} className="w-full bg-white text-[#0F172A] font-bold py-4 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all text-sm px-4">
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {videoEnded && (
          <div className="absolute inset-0 z-[60] bg-[#FAF9F6] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-4 tracking-tighter uppercase leading-tight">
              Você não vai ganhar apenas o Guia...
            </h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4 text-sm italic">
              "Como você respondeu todas as perguntas, também vai receber um <span className="text-[#FE2C55] font-bold">Diagnóstico Exclusivo</span> da sua rotina atual."
            </p>
            <button 
              onClick={goToCapture}
              className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all border-b-[6px] border-red-800 uppercase tracking-tight"
            >
              CLIQUE PARA LIBERAR <ArrowRight size={20} />
            </button>
          </div>
        )}
      </div>
      
      {!videoUnlocked && (
        <div className="py-20 flex flex-col items-center gap-4 text-gray-300">
          <Play size={48} className="opacity-20" />
          <p className="text-[10px] font-black uppercase tracking-widest">Vídeo Bloqueado até liberar o presente</p>
        </div>
      )}

      {/* Footer Institucional Polido */}
      <footer className="w-full max-w-[450px] mx-auto px-6 py-12 mt-10 border-t border-gray-100 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <div className="text-[13px] font-black text-gray-600 uppercase tracking-[0.2em] mb-1">
            D4K MATERNIDADE
          </div>
          <div className="text-[11px] text-gray-400 font-bold uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
            CNPJ: 50.321.456/0001-90
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 w-full">
          <div className="flex items-center gap-4 justify-center">
            <button 
              onClick={() => navigate('/privacidade')}
              className="text-[11px] text-gray-500 font-bold underline decoration-gray-200 underline-offset-4 hover:text-[#FE2C55] transition-colors uppercase tracking-tight"
            >
              Política de Privacidade
            </button>
            <div className="w-1 h-1 bg-gray-200 rounded-full" />
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500 font-bold uppercase">
              <ShieldCheck size={14} className="text-[#34C759]" /> Site Seguro
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tighter">
            <Lock size={12} className="text-gray-300" /> Seus dados estão protegidos pela LGPD
          </div>
        </div>

        <p className="text-[10px] text-gray-400 font-medium text-center leading-relaxed mt-2 max-w-[320px] opacity-80">
          © 2025 Todos os direitos reservados. Este site não faz parte do Google ou do Facebook. Além disso, este site não é endossado pelo Google ou pelo Facebook de nenhuma maneira.
        </p>
      </footer>
    </div>
  );
};

export default SalesPage;
