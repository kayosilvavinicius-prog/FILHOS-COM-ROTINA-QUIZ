import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ChevronDown,
  Check, 
  Sparkles, 
  ArrowRight, 
  Loader2, 
  Star, 
  ShieldCheck, 
  Heart,
  Calendar,
  AlertCircle,
  Tv,
  Layout,
  Repeat,
  Quote
} from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

type QuizStepOption = {
  label: string;
  image?: string;
};

type QuizStep = {
  id: number;
  title?: string;
  subtitle?: string;
  type: 'intro' | 'single' | 'multi' | 'info' | 'processing' | 'result' | 'bridge';
  options?: string[] | QuizStepOption[];
  image?: string;
  buttonText?: string;
};

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});
  const [isExiting, setIsExiting] = useState(false);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const STEPS: QuizStep[] = [
    {
      id: 0,
      title: "Descubra como está a rotina do seu filho",
      subtitle: "e receba um Guia Personalizado de Rotina do Seu Filho. Leva menos de 2 minutos.",
      type: 'intro',
      buttonText: "Iniciar Jornada"
    },
    {
      id: 1,
      title: "Qual a idade do seu filho?",
      type: 'single',
      options: [
        { 
          label: "2 a 4 anos", 
          image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/2%20a%204%20anos.png" 
        },
        { 
          label: "5 a 7 anos", 
          image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/5%20a%207%20anos.png" 
        },
        { 
          label: "8 a 10 anos", 
          image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/003b34385a2ab02007ebe5b919fcf5abe9a5cdb7/8%20a%2010%20anos.png" 
        }
      ]
    },
    {
      id: 2,
      title: "Como é a rotina do seu filho hoje?",
      type: 'single',
      options: [
        "Tem horários, mas vive dando conflito",
        "É organizada, mas com muitos conflitos no dia a dia",
        "Bastante bagunçada e cansativa",
        "Não temos uma rotina definida"
      ]
    },
    {
      id: 3,
      title: "Em quais momentos surgem mais conflitos?",
      type: 'multi',
      options: [
        "Quando precisa desligar telas",
        "Quando precisa mudar de uma atividade para outra",
        "Na hora de dormir",
        "Na hora das refeições",
        "Na hora do banho"
      ],
      buttonText: "Continuar"
    },
    {
      id: 4,
      title: "Quando seu filho resiste, o que mais acontece?",
      type: 'single',
      options: [
        "Chora, grita ou se joga no chão",
        "Explode em birra",
        "Discute e tenta negociar como adulto",
        "Finge que não escuta"
      ]
    },
    {
      id: 5,
      title: "Quando isso se repete no dia a dia, como você costuma se sentir?",
      type: 'single',
      options: ["Cansada", "Irritada", "Culpada", "Sem saber o que fazer", "Tudo isso"]
    },
    {
      id: 6,
      title: "Quando isso se repete, como costuma ficar o clima na sua casa?",
      type: 'single',
      options: ["Estressante", "Imprevisível", "Muito cansativo", "Parece um campo de batalha"]
    },
    {
      id: 7,
      title: "Se nada mudar, como você imagina isso daqui a alguns meses?",
      type: 'single',
      options: ["Mais desgaste", "Mais conflitos", "Criança cada vez mais resistente", "Não quero nem pensar nisso"]
    },
    {
      id: 8,
      title: "Criança calma não é sorte.\nÉ previsibilidade.",
      subtitle: "A maioria das birras acontece porque a criança não consegue entender a sequência do dia.",
      type: 'info',
      image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/25ea3c03a78fb758ada36f9f68ed5ed31957f3e9/Gemini_Generated_Image_bwp8yubwp8yubwp8.png",
      buttonText: "Continuar"
    },
    {
      id: 9,
      title: "No dia a dia, seu filho costuma entender qual é o momento de cada atividade?",
      type: 'single',
      options: ["Sim, na maior parte do tempo", "Em alguns momentos", "Raramente", "Quase nunca"]
    },
    {
      id: 10,
      title: "E quando chega a hora de mudar de uma atividade para outra, o que costuma acontecer?",
      type: 'single',
      options: ["Ele coopera", "Reclama um pouco", "Sempre resiste", "Vira conflito"]
    },
    {
      id: 11,
      title: "Você acredita que, se seu filho entendesse melhor como o dia funciona, ele cooperaria mais?",
      type: 'single',
      options: ["Sim, faz sentido", "Talvez", "Nunca pensei nisso"]
    },
    {
      id: 12,
      title: "No dia a dia, seu filho entende melhor quando você mostra ou quando apenas explica?",
      type: 'single',
      options: ["Quando vê", "Quando escuta", "Um pouco dos dois"]
    },
    {
      id: 13,
      title: "Se existisse um jeito visual e simples de mostrar o dia para seu filho, reduzindo conflitos e resistência, isso ajudaria?",
      type: 'single',
      options: ["Com certeza", "Acho que sim", "Talvez"]
    },
    {
      id: 14,
      title: "Estamos montando o seu Guia Personalizado de Rotina do Seu Filho…",
      subtitle: "Com base nas suas respostas",
      type: 'processing',
      image: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/2e88443c33f9150b3ac0649a37043d6ff25a5844/Expert%20aline.png"
    },
    {
      id: 15,
      title: "Seu Guia Personalizado de Rotina do Seu Filho está pronto",
      subtitle: "Com base nas suas respostas, reunimos os ajustes certos para reduzir conflitos e trazer mais cooperação para o dia a dia da sua casa.",
      type: 'result'
    }
  ];

  useEffect(() => {
    if (STEPS[currentStepIndex].type === 'processing') {
      const timer = setTimeout(() => handleNext(), 3500);
      return () => clearTimeout(timer);
    }
  }, [currentStepIndex]);

  const handleNext = (answer?: any) => {
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

  const renderResults = () => {
    const step9Answer = answers[9];
    let feedback = "";
    let markerPosition = "10%";
    
    if (step9Answer === "Sim, na maior parte do tempo") {
      feedback = "Sua rotina já tem bons momentos de previsibilidade, mas os conflitos aparecem principalmente nas transições.";
      markerPosition = "80%";
    } else if (step9Answer === "Em alguns momentos") {
      feedback = "Hoje seu filho entende a rotina apenas em alguns momentos, o que gera resistência quando o dia muda.";
      markerPosition = "50%";
    } else if (step9Answer === "Raramente") {
      feedback = "Seu filho raramente consegue entender o momento certo de cada atividade, o que aumenta a ansiedade.";
      markerPosition = "25%";
    } else {
      feedback = "Seu filho quase nunca consegue entender o momento certo de cada atividade, o que aumenta ansiedade e conflitos ao longo do dia.";
      markerPosition = "10%";
    }

    const cards = [
      {
        title: "Rotina visual clara",
        visibleText: "Quando a criança sabe o que vem depois, ela coopera mais...",
        icon: <Tv size={20} className="text-[#FE2C55]" />,
        expandedText: "Quando a criança sabe o que vem depois, ela coopera mais porque se sente segura. Uma rotina visual organiza o dia em blocos simples, no tempo da criança."
      },
      {
        title: "Transições bem definidas",
        visibleText: "A maioria das birras acontece na troca de atividades.",
        icon: <Layout size={20} className="text-[#FE2C55]" />,
        expandedText: "A maioria das birras acontece na troca de atividades. Quando a transição é previsível, a resistência diminui e o conflito deixa de ser o padrão."
      }
    ];

    return (
      <div className="space-y-10 animate-fade-in text-left">
        {/* Bloco 1: Feedback Condicional */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">📍 Situação atual da sua rotina</h4>
          <div className="bg-white p-6 rounded-3xl border border-red-50 shadow-sm">
            <p className="text-[#0F172A] font-medium leading-relaxed italic">"{feedback}"</p>
          </div>
        </div>

        {/* Bloco 2: Mapa de Progresso (Journey Map) */}
        <div className="space-y-6">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Mapa de Progresso Visual</h4>
          <div className="relative pt-8 pb-4 px-2">
            <div className="h-2.5 w-full bg-gray-100 rounded-full flex overflow-hidden border border-gray-200/50">
              <div className="h-full bg-red-400 w-1/3"></div>
              <div className="h-full bg-yellow-400 w-1/3"></div>
              <div className="h-full bg-green-500 w-1/3"></div>
            </div>
            <div className="flex justify-between mt-4">
              <div className="flex flex-col items-start gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Você hoje</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Em ajuste</span>
              </div>
              <div className="flex flex-col items-end gap-1 text-right">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-tighter">Rotina Previsível (ideal)</span>
              </div>
            </div>
            <div className="absolute top-5 transition-all duration-1000 ease-out z-10" style={{ left: markerPosition, transform: 'translateX(-50%)' }}>
              <div className="flex flex-col items-center">
                <div className="bg-white p-1 rounded-full shadow-xl border-2 border-[#FE2C55]">
                   <div className="w-3.5 h-3.5 bg-[#FE2C55] rounded-full animate-pulse"></div>
                </div>
                <div className="w-0.5 h-4 bg-[#FE2C55]/30"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Bloco 3: Imagem Comparativa */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Transformação Esperada</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 text-center">
              <div className="rounded-2xl overflow-hidden shadow-sm border border-gray-100 bg-gray-50">
                <img 
                  src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/c65cf9f2d3ed2b48d1d32d3cb5167d89f8e9edd6/ANTES.png" 
                  className="w-full h-auto grayscale opacity-60 block" 
                  alt="Antes" 
                />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Você hoje (sem rotina)</p>
            </div>
            <div className="space-y-2 text-center">
              <div className="rounded-2xl overflow-hidden shadow-md border-2 border-green-100 bg-white">
                <img 
                  src="https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/c65cf9f2d3ed2b48d1d32d3cb5167d89f8e9edd6/DEPOIS.png" 
                  className="w-full h-auto block" 
                  alt="Depois" 
                />
              </div>
              <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest mt-2">Você com rotina</p>
            </div>
          </div>
        </div>

        {/* Bloco 4: Cards Interativos */}
        <div className="space-y-4">
          {cards.map((item, i) => {
            const isExpanded = expandedCard === i;
            return (
              <div key={i} onClick={() => setExpandedCard(isExpanded ? null : i)} className={`bg-white rounded-3xl border border-gray-100 shadow-sm transition-all duration-300 cursor-pointer overflow-hidden ${isExpanded ? 'ring-2 ring-[#FE2C55]/20' : ''}`}>
                <div className="p-5 flex items-center gap-4">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center shrink-0">{item.icon}</div>
                  <div className="flex-1">
                    <h5 className="font-black text-[14px] text-[#0F172A] mb-0.5">{item.title}</h5>
                    <p className="text-[11px] text-gray-400 font-medium truncate w-[200px]">{item.visibleText}</p>
                  </div>
                  <ChevronDown size={18} className={`text-gray-300 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
                {isExpanded && <div className="px-5 pb-6 pt-2 animate-fade-in text-[13px] text-gray-600 font-medium leading-relaxed border-t border-gray-50">{item.expandedText}</div>}
              </div>
            );
          })}
        </div>

        {/* Bloco 5: Depoimentos */}
        <div className="space-y-4 py-4">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 text-center">Resultados Reais</h4>
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm italic relative">
               <Quote size={16} className="text-[#FE2C55]/20 absolute top-4 left-4" />
               <p className="text-xs text-gray-600 font-medium leading-relaxed pl-6">
                "Depois de 3 dias usando o guia, as manhãs pararam de ser um campo de batalha. Ver ele se arrumando sozinho me deu um alívio imenso."
               </p>
               <div className="mt-3 text-[10px] font-black text-[#FE2C55] uppercase tracking-widest text-right">— Ana, mãe do Bento (4 anos)</div>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-gray-50 shadow-sm italic relative">
               <Quote size={16} className="text-[#FE2C55]/20 absolute top-4 left-4" />
               <p className="text-xs text-gray-600 font-medium leading-relaxed pl-6">
                "Eu achava que precisava de pulso firme, mas precisava de método. A rotina visual mudou o comportamento dele da água pro vinho."
               </p>
               <div className="mt-3 text-[10px] font-black text-[#FE2C55] uppercase tracking-widest text-right">— Carla, mãe da Sofia (7 anos)</div>
            </div>
          </div>
        </div>

        <button onClick={() => handleNext()} className="w-full bg-[#FE2C55] text-white font-black py-7 rounded-[2.5rem] shadow-[0_20px_50px_rgba(254,44,85,0.35)] flex items-center justify-center gap-3 mt-4 animate-pulse border-b-4 border-red-700">
          Ver a maneira mais fácil de aplicar isso na prática <ChevronRight size={22} />
        </button>
      </div>
    );
  };

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
          <div className="h-full bg-[#FE2C55] transition-all duration-500 ease-out shadow-[0_0_10px_rgba(254,44,85,0.4)]" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <main ref={containerRef} className={`flex-1 flex flex-col px-6 py-10 transition-all duration-300 transform ${isExiting ? 'opacity-0 translate-x-[-20px]' : 'opacity-100 translate-x-0'}`}>
        <div className="max-w-[500px] mx-auto w-full flex flex-col h-full">
          <div className="mb-10 text-center">
            {step.title && <h1 className="text-2xl sm:text-3xl font-black leading-tight text-[#0F172A] mb-4">{step.title}</h1>}
            {step.subtitle && <p className="text-gray-500 font-medium leading-relaxed">{step.subtitle}</p>}
          </div>
          {step.image && (
            <div className="mb-10 rounded-[3rem] overflow-hidden shadow-2xl border-4 border-white transform rotate-1">
              <img src={step.image} alt="Ilustração" className="w-full h-auto object-cover" />
            </div>
          )}
          {step.type === 'single' && step.options && (
            <div className="grid grid-cols-1 gap-4">
              {step.options.map((option, idx) => {
                const label = typeof option === 'string' ? option : option.label;
                const optImage = typeof option === 'object' ? option.image : null;
                return (
                  <button key={idx} onClick={() => handleNext(label)} className={`w-full bg-white border border-gray-100 rounded-[2.5rem] overflow-hidden text-left font-bold shadow-sm active:scale-[0.98] transition-all group hover:border-[#FE2C55]/20 ${optImage ? 'flex items-center gap-6 p-4' : 'p-6 flex justify-between items-center'}`}>
                    {optImage && <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 shadow-sm border border-gray-50"><img src={optImage} className="w-full h-full object-cover" alt={label} /></div>}
                    <span className="text-[17px] leading-tight flex-1">{label}</span>
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
                  <button key={idx} onClick={() => handleMultiSelect(option)} className={`w-full p-6 rounded-3xl text-left font-bold text-[17px] shadow-sm transition-all flex justify-between items-center border ${isSelected ? 'bg-red-50 border-[#FE2C55] text-[#FE2C55]' : 'bg-white border-gray-100 text-[#0F172A]'}`}>
                    {option}
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${isSelected ? 'bg-[#FE2C55] border-[#FE2C55]' : 'border-gray-200'}`}>{isSelected && <Check size={14} className="text-white" />}</div>
                  </button>
                );
              })}
            </div>
          )}
          {step.type === 'processing' && (
            <div className="flex-1 flex flex-col items-center justify-center py-10">
              <div className="relative mb-8">
                <Loader2 size={60} className="text-[#FE2C55] animate-spin" />
                <div className="absolute inset-0 flex items-center justify-center"><Heart size={20} className="text-[#FE2C55] animate-pulse" fill="currentColor" /></div>
              </div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#FE2C55] animate-pulse">Analisando respostas...</p>
            </div>
          )}
          {step.type === 'result' && renderResults()}
          {(step.type === 'intro' || step.type === 'info' || step.type === 'multi') && (
            <div className="mt-auto pt-8">
              <button onClick={() => handleNext()} disabled={step.type === 'multi' && (!answers[currentStepIndex] || answers[currentStepIndex].length === 0)} className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-3xl shadow-[0_15px_40px_rgba(254,44,85,0.3)] active:scale-95 transition-all flex items-center justify-center gap-3 text-lg border-b-4 border-red-700 disabled:opacity-30">
                {step.buttonText || "Continuar"} <ArrowRight size={22} />
              </button>
              {step.type === 'intro' && (
                <div className="flex flex-col items-center justify-center gap-2 mt-8 opacity-40">
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={16} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">Respostas 100% Privadas</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <footer className="p-8 text-center opacity-30">
        <p className="text-[10px] font-bold uppercase tracking-widest mb-2">© 2025 Filhos com Rotina</p>
        <Link to="/privacidade" className="text-[10px] font-bold uppercase tracking-widest underline underline-offset-2 hover:text-[#FE2C55] transition-colors block">
          Política de Privacidade
        </Link>
      </footer>
    </div>
  );
};

export default QuizPage;