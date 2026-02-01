
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight, FileText, CheckCircle2, Sparkles, MessageSquare, Hand, Gift, Play } from 'lucide-react';
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

const ScratchCardHeader: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
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
    ctx.font = 'bold 14px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.textAlign = 'center';
    ctx.fillText('RASPE PARA SEU PRESENTE 🎁', canvas.width / 2, canvas.height / 2 + 5);

    const scratch = (x: number, y: number) => {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, 20, 0, Math.PI * 2);
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
      const timer = setTimeout(() => {
        setIsRevealed(true);
        onComplete();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isScratched]);

  return (
    <div className="relative w-full h-[180px] rounded-[2rem] overflow-hidden bg-white shadow-lg border border-gray-100">
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-red-50">
        <div className="text-[#FE2C55] mb-2"><Gift size={24} fill="currentColor" /></div>
        <p className="font-black text-[#0F172A] text-sm leading-tight mb-3">
          VOCÊ ACABOU DE GANHAR O GUIA FILHOS COM ROTINA EM PDF GRATUITAMENTE! 🎁
        </p>
        <p className="text-[10px] text-gray-500 font-bold mb-4 uppercase tracking-tighter">
          Assista o vídeo abaixo e responda o quiz para liberar. Leva apenas 3 minutinhos.
        </p>
        <button 
          onClick={() => document.getElementById('video-section')?.scrollIntoView({ behavior: 'smooth' })}
          className="bg-[#FE2C55] text-white text-[11px] font-black py-3 px-6 rounded-full shadow-lg active:scale-95 transition-all flex items-center gap-2"
        >
          SEGUIR PARA LIBERAR MEU PRESENTE <ArrowRight size={14} />
        </button>
      </div>
      <canvas ref={canvasRef} width={400} height={200} className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ${isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} />
      {!isScratched && (
        <div className="absolute bottom-4 right-8 pointer-events-none animate-bounce">
          <Hand size={32} className="text-[#FE2C55]/40" />
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
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    funnelTracker.track("ENTROU_PAGINA_VENDAS");
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    setProgress((time / duration) * 100);

    if (time >= CONCLUDE_TIMESTAMP && !videoEnded) {
      videoRef.current.pause();
      setVideoEnded(true);
      funnelTracker.track("VSL_VIDEO_CONCLUIDO");
    }

    const q = QUESTIONS.find(q => Math.floor(time) === q.time && !answeredIds.has(q.id));
    if (q && !activeQuestion) {
      setActiveQuestion(q);
      videoRef.current.pause();
    }
  };

  const handleAnswer = (option: string) => {
    if (!activeQuestion) return;
    funnelTracker.track(activeQuestion.trackKey, option);
    setAnswers(prev => ({ ...prev, [activeQuestion.id]: option }));
    setAnsweredIds(prev => new Set(prev).add(activeQuestion.id));
    setActiveQuestion(null);
    if (videoRef.current && !videoEnded) videoRef.current.play().catch(() => {});
  };

  const goToCapture = () => {
    navigate('/captura', { state: { answers } });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col items-center justify-start overflow-x-hidden relative text-[#0F172A] pb-20">
      <header className="w-full bg-white px-6 py-10 text-center shadow-sm relative z-50">
        <div className="max-w-[550px] mx-auto space-y-4">
          <h2 className="text-[#FE2C55] font-black text-[11px] uppercase tracking-[0.2em] mb-2 flex items-center justify-center gap-2">
            <Sparkles size={14} /> OI, MÃE! QUERO TE PARABENIZAR POR CHEGAR ATÉ AQUI.
          </h2>
          <div className="px-2">
            <ScratchCardHeader onComplete={() => funnelTracker.track("DIAGNOSTICO_RASPADINHA_REVELADA")} />
          </div>
        </div>
      </header>

      <div id="video-section" className="relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl overflow-hidden mt-6 mb-10 sm:rounded-[3rem] border-4 border-white ring-8 ring-white/10">
        <video
          ref={videoRef}
          src={VSL_VIDEO_URL}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
        />
        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
          <div className="h-full bg-[#FE2C55] transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        <button onClick={() => setIsMuted(!isMuted)} className="absolute top-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20">
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
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4 text-sm">
              Como você respondeu todas as perguntas, também vai receber um <span className="text-[#FE2C55] font-bold">Diagnóstico Exclusivo</span> da sua rotina atual.
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
    </div>
  );
};

export default SalesPage;
