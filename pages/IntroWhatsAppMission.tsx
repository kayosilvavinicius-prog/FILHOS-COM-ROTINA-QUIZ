
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, MessageSquare, Phone, Info, MoreVertical } from 'lucide-react';
import IOSStatusBar from '../components/iOSStatusBar';
import { Message } from '../types';

const SINGLE_KEY_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"; 
const RECEIVED_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3";

const IntroWhatsAppMission: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  const navTimeoutRef = useRef<any>(null);
  
  const keySoundsRef = useRef<HTMLAudioElement[]>([]);
  const receivedAudioRef = useRef<HTMLAudioElement | null>(null);

  const profileImg = "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg";

  const introCopy = [
    "Olá, mãe!",
    "Acredito que posso te ajudar a organizar essa rotina.",
    "Agora, preciso falar com você rapidinho.",
    "Fique nessa tela, eu vou te ligar agora."
  ];

  useEffect(() => {
    isMounted.current = true;
    const poolSize = 6;
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(SINGLE_KEY_SOUND_URL);
      audio.volume = 0.2;
      audio.preload = "auto";
      pool.push(audio);
    }
    keySoundsRef.current = pool;

    const rAudio = new Audio(RECEIVED_SOUND_URL);
    rAudio.volume = 0.4;
    rAudio.preload = "auto";
    receivedAudioRef.current = rAudio;

    return () => {
      isMounted.current = false;
      if (navTimeoutRef.current) clearTimeout(navTimeoutRef.current);
    };
  }, []);

  const playKeySound = () => {
    if (!isMounted.current) return;
    const audio = keySoundsRef.current.find(a => a.paused || a.ended);
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    }
  };

  const unlockAudio = () => {
    const silent = new Audio(SINGLE_KEY_SOUND_URL);
    silent.volume = 0.01;
    silent.play().catch(() => {});
  };

  const typeMessage = async (text: string) => {
    if (!isMounted.current) return;
    setIsTyping(true);
    const chars = text.split('');
    for (let i = 0; i < chars.length; i++) {
      if (!isMounted.current) return;
      if (i % 2 === 0) playKeySound();
      await new Promise(resolve => setTimeout(resolve, 25 + Math.random() * 30));
    }
    
    if (!isMounted.current) return;
    setIsTyping(false);
    
    if (receivedAudioRef.current) {
      receivedAudioRef.current.currentTime = 0;
      receivedAudioRef.current.play().catch(() => {});
    }

    setMessages(prev => [...prev, {
      id: Date.now(),
      text: text,
      sender: "character",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: "read"
    }]);
  };

  const startSequence = async () => {
    if (hasStarted || !isMounted.current) return;
    unlockAudio();
    setHasStarted(true);

    // Track Funnel Start
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'FunnelStart');
    }
    
    await new Promise(res => setTimeout(res, 800));

    for (const text of introCopy) {
      if (!isMounted.current) return;
      await new Promise(res => setTimeout(res, 700 + Math.random() * 1000));
      await typeMessage(text);
    }

    if (isMounted.current) {
      // Track Intro Completion
      if (typeof fbq === 'function') {
        fbq('trackCustom', 'IntroCompleted');
      }

      navTimeoutRef.current = setTimeout(() => {
        if (isMounted.current) navigate('/missao-1-ligacao');
      }, 1800);
    }
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F2F2F7] overflow-hidden max-w-[480px] mx-auto relative shadow-2xl">
      {/* iOS Notificação Banner */}
      {!hasStarted && (
        <div className="absolute inset-0 z-[100] bg-black/20 backdrop-blur-[2px] flex flex-col items-center pt-14 px-4">
          <div 
            onClick={startSequence}
            className="w-full max-w-[400px] bg-white/80 backdrop-blur-xl rounded-[2rem] p-4 shadow-[0_20px_40px_rgba(0,0,0,0.15)] border border-white/20 animate-fade-in cursor-pointer active:scale-[0.98] transition-all"
          >
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#25D366] rounded-xl flex items-center justify-center text-white shadow-sm">
                <MessageSquare size={24} fill="currentColor" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="text-[13px] font-bold text-black uppercase tracking-tight">WhatsApp</span>
                  <span className="text-[11px] text-black/50 font-medium">agora</span>
                </div>
                <h4 className="text-[15px] font-bold text-black">Aline Neves</h4>
                <p className="text-[14px] text-black/80 leading-tight">Olá, mãe! Acredito que posso te ajudar a organizar essa rotina...</p>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-black/5 text-center text-[12px] font-bold text-black/40 uppercase tracking-widest">
              Toque para abrir
            </div>
          </div>
        </div>
      )}

      {/* Header Fixo */}
      <div className="bg-[#F6F6F6] z-20 flex-none border-b border-gray-200">
        <IOSStatusBar dark />
        <header className="px-4 py-2 flex items-center justify-between h-[60px]">
          <div className="flex items-center gap-2">
            <ChevronLeft className="text-[#007AFF]" size={30} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border border-gray-200 shadow-sm">
                <img src={profileImg} alt="Aline" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[17px] font-bold text-black leading-none">Aline Neves</h2>
                <p className="text-[12px] text-gray-500 font-medium mt-1">
                  {isTyping ? <span className="text-[#007AFF] animate-typing">digitando...</span> : 'online'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-5 text-[#007AFF]">
             <Phone size={22} />
             <MoreVertical size={22} />
          </div>
        </header>
      </div>

      {/* Mensagens Roláveis */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5] relative scroll-smooth hide-scrollbar" 
            style={{ 
              backgroundImage: "url('https://w0.peakpx.com/wallpaper/580/624/HD-wallpaper-whatsapp-background-dark-pattern-whatsapp-doodle-doodle-art.jpg')", 
              backgroundSize: '400px', 
              backgroundBlendMode: 'overlay' 
            }}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col animate-fade-in">
            <div className="max-w-[85%] px-3 py-1.5 rounded-lg relative text-[15px] shadow-sm bg-white self-start text-black rounded-tl-none border border-gray-200/50">
              {msg.text}
              <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-gray-400 font-medium">
                {msg.timestamp} <span className="text-[#34B7F1] text-[12px]">✓✓</span>
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex self-start bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm animate-fade-in">
            <div className="flex gap-1 py-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </main>

      {/* Footer Fixo */}
      <footer className="bg-[#F6F6F6] border-t border-gray-200 p-2 pb-8 flex items-center gap-3 z-20 flex-none">
        <Plus className="text-[#007AFF]" size={28} />
        <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-1.5 text-gray-300 text-[16px]">Mensagem</div>
        <div className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center text-white">
          <MessageSquare size={20} fill="currentColor" />
        </div>
      </footer>
    </div>
  );
};

export default IntroWhatsAppMission;
