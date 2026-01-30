
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Plus, MessageSquare, Phone, Info } from 'lucide-react';
import IOSStatusBar from '../components/iOSStatusBar';
import { Message } from '../types';

const SINGLE_KEY_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3"; 
const RECEIVED_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3";

const WhatsAppMission: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showCTA, setShowCTA] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(true);
  
  const keySoundsRef = useRef<HTMLAudioElement[]>([]);
  const receivedAudioRef = useRef<HTMLAudioElement | null>(null);

  const profileImg = "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg";

  const copy = [
    "posso ser sincera com vc?",
    "vc nao ta cansada fisicamente",
    "vc ta cansada de pensar por TODO MUNDO",
    "o dia inteiro",
    "vc carrega o dia inteiro na cabeça",
    "seu filho nao",
    "ai, cada tarefa vira uma briga.",
    "nao pq ele é dificil",
    "mas pq ele nao sabe o q vem depois",
    "criança coopera quando ENXERGA o dia",
    "quer ver como isso muda tudo?"
  ];

  useEffect(() => {
    isMounted.current = true;
    const poolSize = 8;
    const pool: HTMLAudioElement[] = [];
    for (let i = 0; i < poolSize; i++) {
      const audio = new Audio(SINGLE_KEY_SOUND_URL);
      audio.volume = 0.3;
      audio.preload = "auto";
      pool.push(audio);
    }
    keySoundsRef.current = pool;

    const rAudio = new Audio(RECEIVED_SOUND_URL);
    rAudio.volume = 0.4;
    rAudio.preload = "auto";
    receivedAudioRef.current = rAudio;

    startSequence();

    return () => {
      isMounted.current = false;
      keySoundsRef.current.forEach(a => { a.pause(); a.src = ""; });
    };
  }, []);

  let poolIndex = 0;
  const playKeySound = () => {
    if (!isMounted.current) return;
    const audio = keySoundsRef.current[poolIndex];
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch(() => {});
      poolIndex = (poolIndex + 1) % keySoundsRef.current.length;
    }
  };

  const typeMessage = async (text: string) => {
    if (!isMounted.current) return;
    setIsTyping(true);
    for (let i = 0; i < text.length; i++) {
      if (!isMounted.current) return;
      playKeySound();
      await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 40));
    }
    if (!isMounted.current) return;
    setIsTyping(false);
    if (receivedAudioRef.current) {
      receivedAudioRef.current.currentTime = 0;
      receivedAudioRef.current.play().catch(() => {});
    }
    const newMessage: Message = {
      id: Date.now(),
      text: text,
      sender: "character",
      timestamp: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      status: "read"
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const startSequence = async () => {
    await new Promise(res => setTimeout(res, 1200)); 
    for (const text of copy) {
      if (!isMounted.current) return;
      await new Promise(res => setTimeout(res, 800 + Math.random() * 1000));
      await typeMessage(text);
    }
    if (isMounted.current) setShowCTA(true);
  };

  const handleNextMission = () => {
    // Facebook Tracking - Completed Mission 2
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'Mission2_Completed');
    }
    navigate('/missao-3-video');
  };

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[100dvh] bg-[#F2F2F7] overflow-hidden max-w-[480px] mx-auto relative shadow-2xl">
      {/* Header Fixo */}
      <div className="bg-[#F6F6F6] z-20 flex-none border-b border-gray-200">
        <IOSStatusBar dark />
        <header className="px-4 py-2 flex items-center justify-between h-[60px]">
          <div className="flex items-center gap-2">
            <ChevronLeft className="text-[#007AFF]" size={28} />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border border-gray-200 shadow-sm">
                <img src={profileImg} alt="Aline" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col">
                <h2 className="text-[16px] font-bold text-black leading-none">Aline Neves</h2>
                <p className="text-[11px] text-gray-500 font-medium mt-1">
                  {isTyping ? <span className="text-[#007AFF] animate-typing">digitando...</span> : 'online'}
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4 text-[#007AFF]">
             <Phone size={20} />
             <Info size={20} />
          </div>
        </header>
      </div>

      {/* Main Rolável */}
      <main className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#E5DDD5] relative scroll-smooth hide-scrollbar" 
            style={{ backgroundImage: "url('https://w0.peakpx.com/wallpaper/580/624/HD-wallpaper-whatsapp-background-dark-pattern-whatsapp-doodle-doodle-art.jpg')", backgroundSize: '400px', backgroundBlendMode: 'overlay' }}>
        {messages.map((msg) => (
          <div key={msg.id} className="flex flex-col animate-fade-in">
            <div className={`max-w-[85%] px-3 py-1.5 rounded-lg relative text-[15px] shadow-sm border border-gray-200/50 ${msg.sender === 'character' ? 'bg-white self-start text-black rounded-tl-none' : 'bg-[#DCF8C6] self-end text-black rounded-tr-none'}`}>
              {msg.text}
              <div className="flex items-center justify-end gap-1 mt-0.5 text-[9px] text-gray-400 font-medium">
                {msg.timestamp}
                {msg.sender === 'character' && <span className="text-[#34B7F1] text-[12px]">✓✓</span>}
              </div>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex self-start bg-white px-3 py-2 rounded-lg rounded-tl-none shadow-sm animate-fade-in border border-gray-200/50">
            <div className="flex gap-1 py-1">
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} className="h-4" />
      </main>

      {showCTA && (
        <div className="absolute bottom-[110px] left-0 right-0 px-6 flex justify-center z-30 animate-fade-in">
          <button onClick={handleNextMission} className="w-full bg-[#25D366] text-white font-black py-4.5 rounded-2xl shadow-[0_15px_40px_rgba(37,211,102,0.4)] flex items-center justify-center gap-3 active:scale-95 transition-all animate-pulse border-2 border-white/20">
            <span className="text-[15px]">VER COMO ISSO MUDA TUDO ▶️</span>
          </button>
        </div>
      )}

      {/* Footer Fixo */}
      <footer className="bg-[#F6F6F6] border-t border-gray-300 p-2 pb-10 flex items-center gap-3 z-20 flex-none">
        <Plus className="text-[#007AFF]" size={24} />
        <div className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 text-gray-300 text-[15px]">Mensagem</div>
        <div className="w-10 h-10 bg-[#007AFF] rounded-full flex items-center justify-center text-white">
          <MessageSquare size={20} fill="currentColor" />
        </div>
      </footer>
    </div>
  );
};

export default WhatsAppMission;
