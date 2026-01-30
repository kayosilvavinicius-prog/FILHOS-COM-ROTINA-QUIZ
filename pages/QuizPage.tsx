import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Check, 
  ArrowRight, 
  Loader2, 
  ShieldCheck, 
  Heart
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
      trackStep: "ETAPA_12_APRENDIZADO",
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
      trackStep: "ETAPA_14_PROCESSAMENTO",
    },
    {
      id: 15,
      title: "Seu Guia está pronto!",
      subtitle: "Baseado no perfil do seu filho, aqui estão as recomendações.",
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
        <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
          <div className="h-full bg-[#FE2C55] transition-all duration-500 ease-out" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <main ref={containerRef} className={`flex-1 flex flex-col px-6 py-10 transition-all duration-300 transform ${isExiting ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
        <div className="max-w-[500px] mx-auto w-full flex flex-col h-full">
          <div className="mb-10 text-center">
            {step.title && <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0F172A] mb-4">{step.title}</h1>}
            {step.subtitle && <p className="text-gray-500 font-medium leading-relaxed">{step.subtitle}</p>}
          </div>

          {step.type === 'single' && step.options && (
            <div className="grid grid-cols-1 gap-4">
              {step.options.map((option, idx) => {
                const label = typeof option === 'string' ? option : option.label;
                const optImage = typeof option === 'object' ? option.image : null;
                return (
                  <button key={idx} onClick={() => handleNext(label)} className="w-full bg-white border border-gray-100 rounded-[2rem] p-6 text-left font-bold shadow-sm active:scale-[0.98] transition-all flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      {optImage && <img src={optImage} className="w-12 h-12 rounded-lg object-cover" alt={label} />}
                      <span className="text-[17px] leading-tight">{label}</span>
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
              <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] mt-6 shadow-lg">Continuar</button>
            </div>
          )}

          {step.type === 'intro' && (
            <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-lg flex items-center justify-center gap-3">
              {step.buttonText} <ArrowRight size={20} />
            </button>
          )}

          {step.type === 'processing' && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={60} className="text-[#FE2C55] animate-spin mb-4" />
              <p className="font-bold text-[#FE2C55] animate-pulse">Cruzando dados...</p>
            </div>
          )}

          {step.type === 'result' && (
            <div className="text-center space-y-8 animate-fade-in">
              <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-red-50">
                <p className="italic text-lg font-medium">"Sua rotina hoje gera ansiedade no seu filho porque ele não consegue prever o que acontecerá em seguida."</p>
              </div>
              <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-[2rem] shadow-xl animate-pulse">ACESSAR MEU GUIA PERSONALIZADO</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default QuizPage;