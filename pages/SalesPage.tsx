
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Volume2, VolumeX, ArrowRight, FileText, CheckCircle2, Sparkles, MessageSquare } from 'lucide-react';
import { funnelTracker, FunnelStep } from '../services/funnelTracker';

const VSL_VIDEO_URL = "https://res.cloudinary.com/dafhibb8s/video/upload/v1767185181/MINI_VSL_40MB_-_FILHOS_COM_ROTINA_jgqf44.mp4";

// Timestamps: 206.5s para encerrar e 197s para o botão flutuante
const CONCLUDE_TIMESTAMP = 206.5; 
const SHOW_CTA_TIMESTAMP = 197;

interface Question {
  id: string;
  time: number;
  text: string;
  options: string[];
  trackKey: FunnelStep;
}

// Cronograma: Início aos 30s, Fim aos 186s (20s antes de 206.5s)
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

const SalesPage: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [videoEnded, setVideoEnded] = useState(false);
  const [showFloatingCTA, setShowFloatingCTA] = useState(false);
  const [answeredIds, setAnsweredIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    funnelTracker.track("ENTROU_PAGINA_VENDAS");
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(() => setIsPlaying(false));
        }
      });
    }
  }, []);

  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    const time = videoRef.current.currentTime;
    const duration = videoRef.current.duration;
    
    setCurrentTime(time);
    if (duration > 0) {
      setProgress((time / duration) * 100);
    }

    // Encerrar o vídeo no ponto solicitado
    if (time >= CONCLUDE_TIMESTAMP && !videoEnded) {
      videoRef.current.pause();
      setVideoEnded(true);
      setShowFloatingCTA(false);
      funnelTracker.track("VSL_VIDEO_CONCLUIDO");
    }

    // Botão flutuante
    if (time >= SHOW_CTA_TIMESTAMP && time < CONCLUDE_TIMESTAMP && !videoEnded) {
      if (!showFloatingCTA) setShowFloatingCTA(true);
    }

    // Lógica de disparo de perguntas
    const q = QUESTIONS.find(q => Math.floor(time) === q.time && !answeredIds.has(q.id));
    if (q && !activeQuestion) {
      setActiveQuestion(q);
      videoRef.current.pause(); // PAUSA O VÍDEO PARA A RESPOSTA
      setIsPlaying(false);
    }
  };

  const handleAnswer = (option: string) => {
    if (!activeQuestion) return;
    
    // RASTREIO DA PERGUNTA RESPONDIDA - Enviando opção para a planilha
    funnelTracker.track(activeQuestion.trackKey, option);

    setAnswers(prev => ({ ...prev, [activeQuestion.id]: option }));
    setAnsweredIds(prev => new Set(prev).add(activeQuestion.id));
    setActiveQuestion(null);
    
    // RETOMA O VÍDEO APÓS A RESPOSTA
    if (videoRef.current && !videoEnded) {
      videoRef.current.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const goToDiagnosis = () => {
    funnelTracker.track("VSL_CLICOU_VER_DIAGNOSTICO");
    navigate('/diagnostico', { state: { answers } });
  };

  return (
    <div className="bg-[#FAF9F6] min-h-screen flex flex-col items-center justify-start overflow-x-hidden relative text-[#0F172A]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slide-up { animation: slideUp 0.4s ease-out forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fade-in { animation: fadeIn 0.6s ease-out forwards; }
      `}} />

      <header className="w-full bg-white px-6 py-8 text-center shadow-sm relative z-50">
        <div className="max-w-[550px] mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 bg-red-50 text-[#FE2C55] px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] mb-2">
            <span className="flex items-center gap-2"><Sparkles size={14} /> DIAGNÓSTICO GRATUITO</span>
          </div>
          <p className="text-[#0F172A] text-[15px] sm:text-[16px] font-bold leading-relaxed tracking-tight">
            Se você sente que está sempre repetindo a mesma coisa e seu filho não coopera, fique até o final.<br/>
            Em poucos minutos, você vai entender o que está confundindo <span className="text-[#FE2C55]">o cérebro do seu filho</span><br/>
            e como organizar o dia dele de um jeito tão simples que a cooperação <span className="text-[#FE2C55]">começa ainda hoje</span>.
          </p>
        </div>
      </header>

      <div className="relative w-full max-w-[450px] aspect-[9/16] bg-black shadow-2xl overflow-hidden mt-4 mb-10 sm:rounded-[3rem] border-4 border-white ring-8 ring-white/10">
        <video
          ref={videoRef}
          src={VSL_VIDEO_URL}
          className="w-full h-full object-cover"
          playsInline
          autoPlay
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        />

        <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-30">
          <div 
            className="h-full bg-[#FE2C55] transition-all duration-300 shadow-[0_0_10px_rgba(254,44,85,0.8)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <button 
          onClick={toggleMute}
          className="absolute top-6 right-6 z-30 p-3 bg-black/40 backdrop-blur-md rounded-full text-white border border-white/20 active:scale-90 transition-all"
        >
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>

        {showFloatingCTA && (
          <div className="absolute bottom-10 left-0 right-0 px-6 z-50 animate-slide-up">
            <button 
              onClick={goToDiagnosis}
              className="w-full bg-[#FE2C55] text-white font-black py-5 rounded-[2rem] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all text-sm uppercase tracking-widest border-2 border-white/20"
            >
              <FileText size={20} />
              VER MEU DIAGNÓSTICO
            </button>
          </div>
        )}

        {activeQuestion && (
          <div className="absolute inset-0 z-40 bg-black/30 flex items-center justify-center p-6 backdrop-blur-[4px]">
            <div className="bg-white/95 backdrop-blur-xl w-full rounded-[2.5rem] p-8 shadow-2xl animate-slide-up border border-white/50">
              <div className="flex justify-center mb-5 text-[#FE2C55]">
                <MessageSquare size={24} fill="currentColor" />
              </div>
              <h3 className="text-lg font-black text-center text-[#0F172A] mb-8 leading-tight tracking-tight">
                {activeQuestion.text}
              </h3>
              <div className="grid gap-3">
                {activeQuestion.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(opt)}
                    className="w-full bg-white hover:bg-gray-50 text-[#0F172A] font-bold py-4 rounded-2xl border border-gray-100 shadow-sm active:scale-95 transition-all text-sm px-4 text-center leading-tight"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {videoEnded && (
          <div className="absolute inset-0 z-[60] bg-[#FAF9F6] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 mb-6 border border-green-100 shadow-sm">
              <CheckCircle2 size={40} />
            </div>
            <h2 className="text-2xl font-black text-[#0F172A] mb-4 tracking-tighter uppercase">Vídeo Concluído!</h2>
            <p className="text-gray-500 font-medium mb-10 leading-relaxed px-4 text-sm">
              Seu diagnóstico personalizado está pronto. Toque no botão abaixo para acessar o resultado completo.
            </p>
            
            <div className="w-full space-y-4 max-w-[320px]">
              <button 
                onClick={goToDiagnosis}
                className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-xl shadow-red-500/30 flex items-center justify-center gap-3 active:scale-95 transition-all border-b-[6px] border-red-800 uppercase tracking-tight"
              >
                <FileText size={18} />
                VER MEU DIAGNÓSTICO
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SalesPage;
