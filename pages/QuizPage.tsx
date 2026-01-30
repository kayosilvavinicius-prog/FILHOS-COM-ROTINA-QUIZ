import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Loader2, 
  ChevronDown,
  Quote,
  Tv,
  LayoutGrid,
  MapPin,
  Lock
} from 'lucide-react';
import { funnelTracker, FunnelStep } from '../services/funnelTracker';

type QuizStepOption = {
  label: string;
  image?: string;
};

type QuizStep = {
  id: number;
  title?: string;
  subtitle?: string;
  type: 'intro' | 'single' | 'multi' | 'info' | 'processing' | 'result';
  options?: string[] | QuizStepOption[];
  image?: string;
  buttonText?: string;
  trackStep?: FunnelStep;
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isExiting, setIsExiting] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const STEPS: QuizStep[] = [
    {
      id: 0,
      title: "Descubra como está a rotina do seu filho",
      subtitle: "e receba um Guia Personalizado de Rotina do Seu Filho. Leva menos de 2 minutos.",
      type: 'intro',
      buttonText: "Iniciar Jornada",
      trackStep: "ETAPA_1_INICIOU_JORNADA"
    },
    {
      id: 1,
      title: "Qual a idade do seu filho?",
      type: 'single',
      trackStep: "ETAPA_2_IDADE",
      options: [
        { label: "2 a 4 anos", image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/2%20a%204%20anos.png" },
        { label: "5 a 7 anos", image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/5%20a%207%20anos.png" },
        { label: "8 a 10 anos", image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/8%20a%2010%20anos.png" }
      ]
    },
    {
      id: 2,
      title: "Como é a rotina do seu filho hoje?",
      type: 'single',
      trackStep: "ETAPA_3_ROTINA_ATUAL",
      options: ["Tem horários, mas vive dando conflito", "É organizada, mas com muitos conflitos no dia a dia", "Bastante bagunçada e cansativa", "Não temos uma rotina definida"]
    },
    {
      id: 3,
      title: "Em quais momentos surgem mais conflitos?",
      type: 'multi',
      trackStep: "ETAPA_4_CONFLITOS",
      options: ["Quando precisa desligar telas", "Quando precisa mudar de uma atividade para outra", "Na hora de dormir", "Na hora das refeições", "Na hora do banho"],
      buttonText: "Continuar"
    },
    {
      id: 4,
      title: "Quando seu filho resiste, o que mais acontece?",
      type: 'single',
      trackStep: "ETAPA_5_REACAO",
      options: ["Chora, grita ou se joga no chão", "Explode em birra", "Discute e tenta negociar como adulto", "Finge que não escuta"]
    },
    {
      id: 5,
      title: "Quando isso se repete no dia a dia, como você costuma se sentir?",
      type: 'single',
      trackStep: "ETAPA_6_SENTIMENTO_MAE",
      options: ["Cansada", "Irritada", "Culpada", "Sem saber o que fazer", "Tudo isso"]
    },
    {
      id: 6,
      title: "Quando isso se repete, como costuma ficar o clima na sua casa?",
      type: 'single',
      trackStep: "ETAPA_7_CLIMA_DA_CASA",
      options: ["Estressante", "Imprevisível", "Muito cansativo", "Parece um campo de batalha"]
    },
    {
      id: 7,
      title: "Se nada mudar, como você imagina isso daqui a alguns meses?",
      type: 'single',
      trackStep: "ETAPA_8_FUTURO",
      options: ["Mais desgaste", "Mais conflitos", "Criança cada vez mais resistente", "Não quero nem pensar nisso"]
    },
    {
      id: 8,
      title: "Criança calma não é sorte.\nÉ previsibilidade.",
      subtitle: "A maioria das birras acontece porque a criança não consegue entender a sequência do dia.",
      type: 'info',
      trackStep: "ETAPA_9_PREVISIBILIDADE",
      image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/25ea3c03a78fb758ada36f9f68ed5ed31957f3e9/Gemini_Generated_Image_bwp8yubwp8yubwp8.png",
      buttonText: "Continuar"
    },
    {
      id: 9,
      title: "No dia a dia, seu filho costuma entender qual é o momento de cada atividade?",
      type: 'single',
      trackStep: "ETAPA_10_TRANSICOES",
      options: ["Sim, na maior parte do tempo", "Em alguns momentos", "Raramente", "Quase nunca"]
    },
    {
      id: 10,
      title: "E quando chega a hora de mudar de uma atividade para outra, o que costuma acontecer?",
      type: 'single',
      trackStep: "ETAPA_11_CRENCIA",
      options: ["Ele coopera", "Reclama um pouco", "Sempre resiste", "Vira conflito"]
    },
    {
      id: 11,
      title: "Você acredita que, se seu filho entendesse melhor como o dia funciona, ele cooperaria mais?",
      type: 'single',
      trackStep: "ETAPA_11_CRENCIA",
      options: ["Sim, faz sentido", "Talvez", "Nunca pensei nisso"]
    },
    {
      id: 12,
      title: "No dia a dia, seu filho entende melhor quando você mostra ou quando apenas explica?",
      type: 'single',
      trackStep: "ETAPA_13_SOLUCAO_VISUAL",
      options: ["Quando vê", "Quando escuta", "Um pouco dos dois"]
    },
    {
      id: 14,
      title: "Processando seu diagnóstico...",
      subtitle: "Aguarde enquanto analisamos sua rotina.",
      type: 'processing',
      image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/f3a64c152a91eb1ab2000ecf39405c8686bd54c9/Expert%20aline.png",
      trackStep: "ETAPA_14_PROCESSAMENTO",
    },
    {
      id: 15,
      title: "Seu Guia Personalizado de Rotina do Seu Filho está pronto",
      subtitle: "Com base nas suas respostas, reunimos os ajustes certos para reduzir conflitos e trazer mais cooperação para o dia a dia da sua casa.",
      type: 'result',
      trackStep: "ETAPA_15_DIAGNOSTICO"
    }
  ];

  useEffect(() => {
    if (STEPS[currentStepIndex].type === 'processing') {
      const timer = setTimeout(() => handleNext(), 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  const handleNext = (answer?: any) => {
    const currentStep = STEPS[currentStepIndex];
    if (currentStep.trackStep) {
      funnelTracker.track(currentStep.trackStep);
    }

    if (answer !== undefined) {
      setAnswers(prev => ({ ...prev, [currentStepIndex]: answer }));
    }

    if (currentStepIndex < STEPS.length - 1) {
      setIsExiting(true);
      setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setIsExiting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 300);
    } else {
      funnelTracker.track("ETAPA_16_CTA_PAGINA_VENDAS");
      navigate('/sales');
    }
  };

  const handleMultiSelect = (option: string) => {
    const current = answers[currentStepIndex] || [];
    const updated = current.includes(option)
      ? current.filter((i: string) => i !== option)
      : [...current, option];
    setAnswers(prev => ({ ...prev, [currentStepIndex]: updated }));
  };

  const progress = ((currentStepIndex + 1) / STEPS.length) * 100;
  const step = STEPS[currentStepIndex];

  return (
    <div className="min-h-[100dvh] bg-[#FAF9F6] flex flex-col font-sans select-none overflow-x-hidden">
      <header className="pt-10 pb-6 text-center">
        <span className="text-[22px] font-black tracking-tighter text-[#0F172A] uppercase">
          Filhos com <span className="text-[#FE2C55]">Rotina</span>
        </span>
      </header>

      <div className="px-6">
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden shadow-sm">
          <div 
            className="h-full bg-[#FE2C55] transition-all duration-500 ease-out" 
            style={{ width: `${progress}%` }} 
          />
        </div>
      </div>

      <main ref={containerRef} className={`flex-1 flex flex-col px-6 py-10 transition-all duration-300 transform ${isExiting ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
        <div className="max-w-[500px] mx-auto w-full flex flex-col h-full">
          
          {step.type !== 'result' && (
            <div className="mb-10 text-center">
              {step.title && <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0F172A] mb-4 tracking-tight">{step.title}</h1>}
              {step.subtitle && <p className="text-gray-500 font-medium leading-relaxed">{step.subtitle}</p>}
            </div>
          )}

          {step.type === 'single' && step.options && (
            <div className="grid grid-cols-1 gap-4">
              {step.options.map((option, idx) => {
                const label = typeof option === 'string' ? option : option.label;
                const optImage = typeof option === 'object' ? option.image : null;
                return (
                  <button key={idx} onClick={() => handleNext(label)} className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 text-left font-bold shadow-sm active:scale-[0.98] transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      {optImage && <img src={optImage} className="w-12 h-12 rounded-lg object-cover" alt={label} />}
                      <span className="text-[17px] leading-tight text-[#0F172A]">{label}</span>
                    </div>
                    <ChevronRight size={20} className="text-gray-300 group-active:text-[#FE2C55]" />
                  </button>
                );
              })}
            </div>
          )}

          {step.type === 'multi' && step.options && (
            <div className="space-y-3 mb-8">
              {(step.options as string[]).map((option, idx) => {
                const isSelected = (answers[currentStepIndex] || []).includes(option);
                return (
                  <button key={idx} onClick={() => handleMultiSelect(option)} className={`w-full p-6 rounded-[2rem] text-left font-bold text-[17px] shadow-sm transition-all flex justify-between items-center border ${isSelected ? 'bg-red-50 border-[#FE2C55] text-[#FE2C55]' : 'bg-white border-gray-100 text-[#0F172A]'}`}>
                    {option}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#FE2C55] border-[#FE2C55]' : 'border-gray-200'}`}>{isSelected && <Check size={14} className="text-white" />}</div>
                  </button>
                );
              })}
              <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] mt-6 shadow-lg active:scale-95 transition-all">Continuar</button>
            </div>
          )}

          {step.type === 'intro' && (
            <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all">
              {step.buttonText} <ArrowRight size={20} />
            </button>
          )}

          {step.type === 'info' && (
            <div className="flex flex-col flex-1 gap-8 animate-fade-in">
              {step.image && (
                <div className="w-full aspect-square rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img src={step.image} alt="Informação" className="w-full h-full object-cover" />
                </div>
              )}
              <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-xl flex items-center justify-center gap-3 active:scale-95 transition-all mt-auto">
                {step.buttonText || "Continuar"} <ArrowRight size={20} />
              </button>
            </div>
          )}

          {step.type === 'processing' && (
            <div className="flex flex-col flex-1 gap-8 items-center justify-center animate-fade-in">
              {step.image && (
                <div className="w-full aspect-square rounded-[3.5rem] overflow-hidden shadow-2xl border-[6px] border-white ring-8 ring-white/50">
                  <img src={step.image} alt="Processando" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col items-center gap-4 py-8">
                <Loader2 size={48} className="text-[#FE2C55] animate-spin" />
                <p className="font-bold text-[#FE2C55] text-lg tracking-tight animate-pulse uppercase">Cruzando seus dados...</p>
              </div>
            </div>
          )}

          {step.type === 'result' && (
            <div className="flex flex-col gap-10 animate-fade-in pb-24">
              <div className="text-center pt-2">
                <h1 className="text-[28px] sm:text-[36px] font-black leading-[1.1] text-[#0F172A] mb-5 tracking-tight px-4">
                  {step.title}
                </h1>
                <p className="text-gray-500 font-medium leading-relaxed px-6 text-sm sm:text-base">
                  {step.subtitle}
                </p>
              </div>

              <div className="space-y-4 px-2">
                <div className="flex items-center gap-2">
                   <MapPin size={16} className="text-[#FE2C55]" />
                   <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">SITUAÇÃO ATUAL DA SUA ROTINA</span>
                </div>
                <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-red-50/50 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#FE2C55]/10" />
                  <p className="text-[#0F172A] text-[17px] sm:text-[19px] font-bold leading-relaxed italic text-center px-2">
                    "Hoje seu filho entende a rotina apenas em alguns momentos, o que gera resistência quando o dia muda."
                  </p>
                </div>
              </div>

              <div className="space-y-8 px-2">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">MAPA DE PROGRESSO VISUAL</span>
                <div className="relative pt-6 pb-12 px-2">
                  <div className="h-[10px] w-full flex rounded-full overflow-hidden shadow-inner bg-gray-100">
                    <div className="w-1/3 h-full bg-[#FF6B6B]" />
                    <div className="w-1/3 h-full bg-[#FFD93D]" />
                    <div className="w-1/3 h-full bg-[#34C759]" />
                  </div>
                  <div className="absolute top-[16px] left-[40%] -translate-x-1/2 flex flex-col items-center">
                    <div className="w-[36px] h-[36px] rounded-full border-[5px] border-white bg-[#FE2C55] shadow-[0_5px_20px_rgba(254,44,85,0.4)] flex items-center justify-center relative ring-4 ring-[#FE2C55]/10">
                      <div className="w-2.5 h-2.5 bg-white rounded-full" />
                    </div>
                    <div className="w-[2.5px] h-10 bg-gradient-to-b from-red-100/50 to-transparent" />
                  </div>
                  <div className="flex justify-between mt-10 text-[9px] font-black text-gray-500 uppercase tracking-tight">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FF6B6B] border-2 border-white shadow-sm" />
                      VOCÊ HOJE
                    </div>
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#FFD93D] border-2 border-white shadow-sm" />
                      EM AJUSTE
                    </div>
                    <div className="flex flex-col items-center gap-2 text-[#34C759]">
                      <div className="w-2.5 h-2.5 rounded-full bg-[#34C759] border-2 border-white shadow-sm" />
                      ROTINA PREVISÍVEL (IDEAL)
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6 px-2 text-center">
                <h3 className="font-black text-gray-400 uppercase tracking-widest text-[11px]">TRANSFORMAÇÃO ESPERADA</h3>
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-white shadow-lg bg-gray-200">
                      <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ANTES.png" className="w-full h-full object-cover grayscale" alt="Antes" />
                    </div>
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-tight leading-tight px-2">VOCÊ HOJE (SEM ROTINA)</span>
                  </div>
                  <div className="flex flex-col gap-4">
                    <div className="aspect-[4/5] rounded-[2.5rem] overflow-hidden border-2 border-[#34C759]/30 shadow-2xl ring-4 ring-[#34C759]/10">
                      <img src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/DEPOIS.png" className="w-full h-full object-cover" alt="Depois" />
                    </div>
                    <span className="text-[10px] font-black text-[#34C759] uppercase tracking-tight leading-tight px-2">VOCÊ COM ROTINA</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 px-2">
                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#FE2C55]">
                       <Tv size={28} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-black text-[#0F172A] text-base leading-tight">Rotina visual clara</h4>
                      <p className="text-[12px] text-gray-400 font-medium leading-tight mt-1">Seu filho coopera mais quando conse...</p>
                    </div>
                  </div>
                  <ChevronDown size={22} className="text-gray-300" />
                </div>

                <div className="bg-white p-6 rounded-[2rem] shadow-sm border border-gray-100 flex items-center justify-between group transition-all">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center text-[#FE2C55]">
                       <LayoutGrid size={28} />
                    </div>
                    <div className="flex flex-col">
                      <h4 className="font-black text-[#0F172A] text-base leading-tight">Transições bem definidas</h4>
                      <p className="text-[12px] text-gray-400 font-medium leading-tight mt-1">Quando a criança entende o moment...</p>
                    </div>
                  </div>
                  <ChevronDown size={22} className="text-gray-300" />
                </div>
              </div>

              <div className="pt-10 space-y-10 px-2">
                <h3 className="text-center font-black text-gray-300 uppercase tracking-[0.2em] text-[11px]">RESULTADOS REAIS</h3>
                <div className="space-y-8">
                  <div className="bg-white p-10 rounded-[3rem] shadow-md border border-gray-50 relative">
                    <div className="absolute top-6 left-6 text-[#FE2C55]/10"><Quote size={48} fill="currentColor" /></div>
                    <p className="text-[#0F172A] text-[15px] font-bold leading-relaxed italic relative z-10 text-center">
                      "Depois de 3 dias usando o guia, as manhãs pararam de ser um campo de batalha. Ver ele se arrumando sozinho me deu um alívio imenso."
                    </p>
                    <p className="mt-6 text-[11px] font-black text-center text-[#FE2C55] uppercase tracking-widest">— ANA, MÃE DO BENTO (4 ANOS)</p>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] shadow-md border border-gray-50 relative">
                    <div className="absolute top-6 left-6 text-[#FE2C55]/10"><Quote size={48} fill="currentColor" /></div>
                    <p className="text-[#0F172A] text-[15px] font-bold leading-relaxed italic relative z-10 text-center">
                      "Eu achava que precisava de pulso firme, mas precisava de método. A rotina visual mudou o comportamento dele da água pro vinho."
                    </p>
                    <p className="mt-6 text-[11px] font-black text-center text-[#FE2C55] uppercase tracking-widest">— CARLA, MÃE DA SOFIA (7 ANOS)</p>
                  </div>
                </div>
              </div>

              <div className="pt-12 px-2 sticky bottom-6 z-[90]">
                <button 
                  onClick={() => handleNext()} 
                  className="w-full bg-[#FE2C55] text-white font-black py-7 rounded-[2.5rem] shadow-[0_20px_60px_rgba(254,44,85,0.5)] transition-all active:scale-[0.98] text-[17px] sm:text-[19px] uppercase tracking-tight text-center leading-tight px-8 border-b-[6px] border-red-700 hover:brightness-110 flex items-center justify-center gap-3"
                >
                  Ver a maneira mais fácil de aplicar isso na prática <ArrowRight size={22} />
                </button>
                <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                  <Lock size={12} /> Diagnóstico Seguro e Privado
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;