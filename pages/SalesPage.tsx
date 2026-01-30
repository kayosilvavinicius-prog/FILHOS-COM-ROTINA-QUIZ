import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight,
  Sparkles,
  Lock,
  X,
  User,
  Mail,
  MessageCircle,
  Loader2,
  Star,
  Clock,
  Quote,
  ShieldAlert,
  CalendarCheck,
  Tv,
  EyeOff,
  Brain,
  ChevronDown,
  Info,
  Lightbulb,
  Users
} from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

const ASSETS = {
  ALINE_FOTO: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/2e88443c33f9150b3ac0649a37043d6ff25a5844/Expert%20aline.png",
  PRODUTO_MOCKUP: "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA-quiz-/45b6d41935979ee738350aed1a78aa0a3090aac4/ChatGPT%20Image%20Jan%2030%2C%202026%2C%2001_13_07%20AM.png"
};

const CHECKOUT_URL = "https://pay.cakto.com.br/8orm8zt_705304";

const SalesPage: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', whatsapp: '' });
  const finalCtaRef = useRef<HTMLDivElement>(null);

  const isFormValid = formData.name.trim().length >= 2 && 
                      formData.email.includes('@') && 
                      formData.whatsapp.replace(/\D/g, '').length >= 10;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 400);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToFinal = () => {
    finalCtaRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const openCheckoutProcess = () => {
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'InitiateCheckout', {
        content_name: 'Filhos com Rotina - Final Click',
        value: 19.90,
        currency: 'BRL'
      });
    }
    
    funnelTracker.track("CTA_PAGINA_VENDAS");
    setShowLeadForm(true);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || isSubmitting) return;
    setIsSubmitting(true);

    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('track', 'Lead', { content_category: 'Maternidade' });
    }

    funnelTracker.track("MODAL_CAPTURA_PREENCHIDO");
    funnelTracker.track("CHECKOUT_INICIADO");

    setTimeout(() => {
      window.location.href = CHECKOUT_URL;
    }, 400);
  };

  return (
    <div className="bg-[#FAF9F6] text-[#0F172A] min-h-screen font-sans pb-32 overflow-x-hidden selection:bg-[#FE2C55]/20 text-[16px]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shine {
          0% { left: -100%; }
          20% { left: 100%; }
          100% { left: 100%; }
        }
        .animate-shine {
          position: relative;
          overflow: hidden;
        }
        .animate-shine::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -100%;
          width: 50%;
          height: 200%;
          background: rgba(255, 255, 255, 0.4);
          transform: rotate(30deg);
          animation: shine 3s infinite;
        }
        .btn-pulse-heavy {
          animation: pulseHeavy 2s infinite;
        }
        @keyframes pulseHeavy {
          0% { transform: scale(1); box-shadow: 0 0 0 0 rgba(254, 44, 85, 0.7); }
          70% { transform: scale(1.03); box-shadow: 0 0 0 20px rgba(254, 44, 85, 0); }
          100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(254, 44, 85, 0); }
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Barra de Urgência */}
      <div className="bg-[#FE2C55] text-white text-[10px] sm:text-xs font-black py-2.5 text-center uppercase tracking-[0.2em] sticky top-0 z-[100] shadow-md px-4">
        ACESSO IMEDIATO
      </div>

      {/* Hero Section */}
      <section className="px-6 pt-12 pb-20 max-w-[1100px] mx-auto text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 border border-red-100 px-4 py-2 rounded-full mb-8 shadow-sm">
          <Star className="text-yellow-400 fill-yellow-400" size={14} />
          <span className="text-[10px] font-black uppercase tracking-widest text-[#FE2C55]">Mais de 5.400 mães transformadas</span>
        </div>
        
        <h1 className="text-4xl sm:text-7xl font-black leading-[1.05] mb-8 tracking-tight text-[#0F172A]">
          Pare de gritar. <br/>Comece a <span className="text-[#FE2C55] italic">guiar</span>.
        </h1>
        
        <p className="text-gray-500 mb-12 text-lg sm:text-xl leading-relaxed max-w-[800px] mx-auto font-medium">
          O Sistema Filhos com Rotina usa previsibilidade visual para ajudar seu filho a cooperar sem gritos — e devolver a paz para sua casa.
        </p>

        <div className="flex flex-col items-center gap-4 mb-20">
          <button 
            onClick={scrollToFinal} 
            className="w-full max-w-[550px] bg-[#FE2C55] text-white font-black py-7 rounded-[2.5rem] text-xl shadow-[0_25px_60px_rgba(254,44,85,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 group border-b-4 border-red-700"
          >
            QUERO A PAZ DE VOLTA NA MINHA CASA <ChevronDown className="group-hover:translate-y-1 transition-transform" />
          </button>
        </div>

        <div className="relative flex flex-col items-center">
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#FAF9F6] via-transparent to-transparent z-10 h-64"></div>
          <img 
            src={ASSETS.PRODUTO_MOCKUP} 
            alt="Material Filhos com Rotina" 
            decoding="async"
            className="relative z-20 w-full max-w-[950px] mx-auto drop-shadow-[0_50px_100px_rgba(0,0,0,0.12)]" 
          />
          <p className="relative z-30 mt-8 text-gray-400 font-bold text-xs uppercase tracking-widest bg-white/50 px-6 py-2 rounded-full border border-gray-100">
            Um sistema visual simples para a criança entender o dia — sem depender de ordens o tempo todo.
          </p>
        </div>
      </section>

      {/* Seção de Telas vs Rotina Visual */}
      <section className="py-24 px-6 bg-red-50/50">
        <div className="max-w-[1000px] mx-auto">
          <div className="bg-white p-10 sm:p-16 rounded-[4rem] shadow-[0_30px_70px_rgba(254,44,85,0.08)] border border-red-100">
            <div className="flex flex-col md:flex-row gap-12 items-center">
              <div className="flex-1 space-y-6">
                <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">
                   <Lightbulb size={14} /> Você sabia disso?
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] leading-tight">
                  O problema não é a tela. <br/><span className="text-blue-600 underline">É o que vem depois dela.</span>
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed font-medium">
                  A Sociedade Brasileira de Pediatria não proíbe o uso de telas — o ponto central é o equilíbrio.
                </p>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Na prática, a maioria dos conflitos não acontece pela tela em si, mas porque a criança não consegue enxergar o que vem depois daquele momento prazeroso.
                </p>
                <p className="text-[#0F172A] font-bold text-sm leading-relaxed">
                  Quando a criança sabe quando a tela acontece e qual é a próxima atividade, a ansiedade diminui e a cooperação aumenta.
                </p>
                <div className="pt-4">
                  <button onClick={scrollToFinal} className="bg-[#FE2C55] text-white px-8 py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-red-200 active:scale-95 transition-all">
                    Aproveitar preço especial agora
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-[#FAF9F6] p-8 rounded-[3rem] border border-gray-100">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
                    <Brain size={24} />
                  </div>
                  <h4 className="font-black text-lg text-[#0F172A]">O Problema Real</h4>
                </div>
                <p className="text-gray-500 text-sm leading-relaxed mb-6">
                  Seu filho não briga pela tela porque é "viciado", ele briga porque o cérebro infantil entra em alerta quando perde o controle do que vem a seguir.
                </p>
                <p className="text-[#0F172A] font-bold text-sm leading-relaxed">
                  O <strong>Filhos com Rotina</strong> traz a <strong>previsibilidade</strong> necessária. Quando a criança "vê" o dia, a birra dá lugar à compreensão.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-24 bg-white border-y border-gray-100 overflow-hidden">
        <div className="max-w-[1000px] mx-auto">
          <div className="text-center mb-16 px-6">
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A] mb-4">O que as mães estão dizendo</h2>
            <div className="flex justify-center gap-1 mb-4">
              {[1,2,3,4,5].map(i => <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />)}
            </div>
          </div>
          
          <div className="flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-4 px-6 md:px-0 md:grid md:grid-cols-2 md:gap-8 pb-8">
            {[
              { name: "Juliana Santos", text: "Meu filho de 4 anos não queria escovar os dentes por nada. Com o quadro visual, ele mesmo vai e faz sem eu precisar gritar. É mágico!", role: "Mãe do Pedro (4 anos)" },
              { name: "Camila Duarte", text: "O aplicativo é incrível! O Theo ama ver as estrelinhas subindo quando ele termina de se arrumar sozinho em menos de 3 dias.", role: "Mãe do Theo (6 anos)" }
            ].map((dep, idx) => (
              <div 
                key={idx} 
                className="bg-[#FAF9F6] p-8 rounded-[2.5rem] border border-gray-100 relative shadow-sm min-w-[85%] sm:min-w-[70%] md:min-w-0 snap-start flex flex-col justify-between"
              >
                <div>
                  <Quote className="text-[#FE2C55] opacity-10 absolute top-6 right-8" size={40} />
                  <p className="text-gray-600 font-medium italic mb-6 leading-relaxed">"{dep.text}"</p>
                </div>
                <div>
                  <div className="font-black text-[#0F172A]">{dep.name}</div>
                  <div className="text-xs font-bold text-[#FE2C55] uppercase tracking-wider mt-1">{dep.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section ref={finalCtaRef} className="py-32 px-6 text-center">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-4xl sm:text-6xl font-black text-[#0F172A] mb-8 leading-tight tracking-tight">O próximo passo para uma casa em paz.</h2>
          <div className="bg-white rounded-[3.5rem] p-10 sm:p-14 shadow-2xl text-left border border-gray-100 relative">
            
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#FE2C55] text-white px-6 sm:px-12 py-4.5 sm:py-4 rounded-2xl sm:rounded-[2rem] font-black text-[11px] sm:text-[13px] uppercase tracking-[0.12em] shadow-[0_15px_40px_rgba(254,44,85,0.4)] w-[92%] sm:w-auto text-center flex flex-col sm:flex-row items-center justify-center leading-tight border-2 border-white/20 whitespace-normal sm:whitespace-nowrap gap-1 sm:gap-3 transition-all z-20">
              <span className="drop-shadow-sm">CONDIÇÃO ESPECIAL</span>
              <span className="hidden sm:inline opacity-30 text-lg">•</span>
              <span className="drop-shadow-sm">VOLTA ÀS AULAS</span>
            </div>
            
            <div className="space-y-4 mb-12 mt-10 sm:mt-0 pt-4 sm:pt-0">
              <div className="pb-4 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-center">
                Você não vai receber apenas um conteúdo. Vai aplicar um sistema simples, repetível e visual no dia a dia da sua casa.
              </div>

              <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-[1.5rem] border border-gray-100"><CheckCircle2 className="text-[#FE2C55]" size={18}/><span className="font-black text-[13px]">Aplicativo do Sistema Filhos com Rotina</span></div>
              <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-[1.5rem] border border-gray-100"><Sparkles className="text-[#FE2C55]" size={18}/><span className="font-black text-[13px]">Rotinas prontas + criador de rotinas personalizadas</span></div>
              <div className="flex items-center gap-4 bg-[#FAF9F6] p-4 rounded-[1.5rem] border border-gray-100"><Star className="text-[#FE2C55]" size={18}/><span className="font-black text-[13px]">Sistema de pontos com recompensas reais</span></div>
              
              <div className="pt-4 pb-2 text-[10px] font-black text-red-600 uppercase tracking-[0.2em] text-center">BÔNUS INCLUÍDOS NESTA CONDIÇÃO ESPECIAL</div>

              <div className="flex items-center gap-4 bg-red-50/30 p-4 rounded-[1.5rem] border border-red-100/50">
                <ShieldAlert className="text-red-600 shrink-0" size={18}/>
                <div>
                  <div className="font-black text-[13px]">Manual de Emergência para Crises</div>
                  <div className="text-[11px] text-gray-500 leading-tight mt-0.5">Estratégias para quando seu filho chora, grita ou colapsa.</div>
                </div>
              </div>
            </div>

            <div className="text-center mb-10">
              <div className="text-gray-400 line-through text-lg font-bold">Valor regular do sistema: R$ 358,80 / ano</div>
              <div className="text-4xl sm:text-5xl font-black text-[#FE2C55] tracking-tight mt-2">
                Por uma <span className="italic underline">fração</span> deste valor
              </div>
            </div>

            <button 
              onClick={openCheckoutProcess} 
              className="w-full bg-[#FE2C55] text-white font-black py-7 rounded-[2rem] text-xl shadow-[0_20px_50px_rgba(254,44,85,0.4)] active:scale-95 transition-all flex items-center justify-center gap-3 uppercase border-b-4 border-red-700 animate-shine btn-pulse-heavy"
            >
              QUERO GARANTIR MEU ACESSO AGORA <ArrowRight size={24} />
            </button>
            <p className="text-[10px] font-bold text-gray-400 mt-6 uppercase tracking-widest text-center">
              Acesso imediato • Vagas limitadas • Garantia de 30 dias
            </p>
          </div>
        </div>
      </section>

      {/* Botão Flutuante Mobile */}
      <div className={`fixed bottom-0 left-0 right-0 p-4 z-[200] transition-all duration-700 transform ${scrolled ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
        <div className="max-w-[500px] mx-auto">
          <button 
            onClick={openCheckoutProcess} 
            className="w-full bg-[#FE2C55] text-white font-black py-5 rounded-[2rem] shadow-[0_15px_45px_rgba(254,44,85,0.6)] flex items-center justify-center gap-3 active:scale-95 border-2 border-white/20 uppercase tracking-tight text-sm animate-shine"
          >
            Aproveitar Preço Especial • AGORA
          </button>
        </div>
      </div>

      {/* Modal de Lead Captura */}
      {showLeadForm && (
        <div className="fixed inset-0 z-[1000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white w-full max-w-md rounded-[3rem] shadow-2xl relative overflow-hidden">
            <button onClick={() => setShowLeadForm(false)} className="absolute top-8 right-8 p-2 bg-gray-100 rounded-full text-gray-400 hover:text-red-500 transition-colors"><X size={20} /></button>
            <div className="p-10 text-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#FE2C55]">
                <Lock size={40} />
              </div>
              <h3 className="text-2xl font-black text-[#0F172A] mb-2">Para onde enviamos o acesso?</h3>
              <p className="text-gray-400 text-sm font-medium mb-8">Preencha os dados abaixo para prosseguir com segurança.</p>
              
              <form onSubmit={handleLeadSubmit} className="space-y-4 text-left">
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="text" required placeholder="Seu Nome Completo" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none font-bold focus:border-[#FE2C55] transition-colors" />
                </div>
                <div className="relative">
                  <MessageCircle className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="tel" required placeholder="WhatsApp com DDD" value={formData.whatsapp} onChange={(e) => setFormData({...formData, whatsapp: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none font-bold focus:border-[#FE2C55] transition-colors" />
                </div>
                <div className="relative">
                  <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300" size={18} />
                  <input type="email" required placeholder="Seu Melhor E-mail" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="w-full bg-gray-50 border border-gray-200 rounded-[1.5rem] py-5 pl-14 pr-6 outline-none font-bold focus:border-[#FE2C55] transition-colors" />
                </div>
                
                <button 
                  type="submit" 
                  disabled={!isFormValid || isSubmitting} 
                  className="w-full py-6 rounded-[1.5rem] font-black text-white bg-[#FE2C55] shadow-[0_15px_35px_rgba(254,44,85,0.4)] flex items-center justify-center gap-3 mt-6 hover:bg-red-600 transition-colors border-b-4 border-red-700 disabled:opacity-50 animate-shine"
                >
                  {isSubmitting ? <Loader2 className="animate-spin" size={24} /> : 'LIBERAR MEU DESCONTO AGORA'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <footer className="py-24 px-6 border-t border-gray-100 text-center bg-white opacity-40">
        <div className="text-[#FE2C55] font-black text-2xl tracking-tighter mb-4">d4k maternidade.</div>
        <p className="text-[10px] font-bold uppercase tracking-widest max-w-[300px] mx-auto leading-loose mb-6">
          Este site não faz parte do Google ou Facebook. <br/>
          © 2025 Filhos com Rotina. Todos os direitos reservados.
        </p>
        <div className="flex justify-center">
          <Link to="/privacidade" className="text-[10px] font-bold uppercase tracking-widest underline hover:text-[#FE2C55] transition-colors">
            Política de Privacidade
          </Link>
        </div>
      </footer>
    </div>
  );
};

export default SalesPage;