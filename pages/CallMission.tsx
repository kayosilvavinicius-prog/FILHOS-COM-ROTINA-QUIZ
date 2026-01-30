
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  MicOff, Grid3x3, Volume2, Plus, Video, Users, Phone, MessageSquare, X, AlertCircle
} from 'lucide-react';
import IOSStatusBar from '../components/iOSStatusBar';

const ALINE_AUDIO_URL = "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/fe3f6ea59b951352e43388c8da1f56115e911980/WhatsApp%20Ptt%202025-12-30%20at%2009.57.36.ogg"; 
const VIBRATION_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/1358/1358-preview.mp3"; 
const END_CALL_SOUND_URL = "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3";

const CallMission: React.FC = () => {
  const [status, setStatus] = useState<'incoming' | 'active' | 'ended'>('incoming');
  const [callDuration, setCallDuration] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVibratingVisual, setIsVibratingVisual] = useState(false);
  const [audioError, setAudioError] = useState<boolean>(false);
  const navigate = useNavigate();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const vibrationAudioRef = useRef<HTMLAudioElement | null>(null);
  const isMounted = useRef(true);

  const profileImg = "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg";

  useEffect(() => {
    isMounted.current = true;
    
    const vAudio = new Audio(VIBRATION_SOUND_URL);
    vAudio.loop = true;
    vAudio.volume = 0.4;
    vibrationAudioRef.current = vAudio;

    setIsVibratingVisual(true);
    if (navigator.vibrate) navigator.vibrate([800, 400, 800]);
    
    vAudio.play().catch(() => console.log("Vibração silenciosa no início"));

    return () => {
      isMounted.current = false;
      if (vibrationAudioRef.current) {
        vibrationAudioRef.current.pause();
        vibrationAudioRef.current.src = "";
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
    };
  }, []);

  useEffect(() => {
    let timer: any;
    if (status === 'active') {
      timer = setInterval(() => {
        if (isMounted.current) setCallDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [status]);

  const initAlineAudio = () => {
    const audio = new Audio(ALINE_AUDIO_URL);
    audio.playbackRate = 1.35;
    audio.preload = "auto";
    audio.muted = false;
    audio.volume = 1.0;
    
    audio.onended = () => {
      if (isMounted.current) handleHangUp();
    };

    audioRef.current = audio;
    return audio;
  };

  const handleAnswer = () => {
    setIsVibratingVisual(false);
    if (vibrationAudioRef.current) vibrationAudioRef.current.pause();
    setStatus('active');
    
    // Facebook Tracking - Answered Call
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'Mission1_Answered');
    }

    const alineAudio = initAlineAudio();
    alineAudio.play()
      .then(() => setAudioError(false))
      .catch(error => {
        console.error("Autoplay falhou no iOS:", error);
        setAudioError(true);
      });
  };

  const tryForcePlay = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
    }
    
    const newAudio = initAlineAudio();
    newAudio.play()
      .then(() => setAudioError(false))
      .catch(() => setAudioError(true));
  };

  const handleHangUp = () => {
    if (audioRef.current) audioRef.current.pause();
    if (vibrationAudioRef.current) vibrationAudioRef.current.pause();
    
    const endAudio = new Audio(END_CALL_SOUND_URL);
    endAudio.play().catch(() => {});
    
    // Facebook Tracking - Completed Mission 1
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'Mission1_Completed');
    }

    setStatus('ended');
    setIsExiting(true);
    setTimeout(() => { 
      if (isMounted.current) navigate('/missao-2-whatsapp'); 
    }, 800);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative w-full h-[100dvh] overflow-hidden flex flex-col bg-gradient-to-b from-[#1C1C1E] to-black transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'} ${isVibratingVisual && status === 'incoming' ? 'ios-shake-vivid' : ''}`}>
      <IOSStatusBar />
      
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes iosVividShake { 
          0% { transform: translate(0, 0); } 
          10% { transform: translate(-3px, -3px); } 
          20% { transform: translate(3px, 3px); } 
          30% { transform: translate(-3px, 3px); } 
          40% { transform: translate(3px, -3px); } 
          50% { transform: translate(-3px, -3px); } 
          100% { transform: translate(0, 0); } 
        } 
        .ios-shake-vivid { animation: iosVividShake 0.15s linear infinite; }
        @keyframes pulseAlert { 0% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0.4); } 70% { box-shadow: 0 0 0 15px rgba(255, 204, 0, 0); } 100% { box-shadow: 0 0 0 0 rgba(255, 204, 0, 0); } }
        .viva-voz-alert { animation: pulseAlert 1.5s infinite; }
      `}} />

      {status === 'incoming' ? (
        <div className="flex-1 flex flex-col items-center justify-between py-12 px-8 animate-fade-in">
          <div className="flex flex-col items-center pt-8 text-center">
            <div className="w-[110px] h-[110px] rounded-full overflow-hidden bg-gray-800 mb-6 border-[3px] border-white/10 shadow-2xl mx-auto">
              <img src={profileImg} alt="Aline" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-[32px] font-bold text-white tracking-tight leading-none mb-2">Aline</h1>
            <p className="text-[17px] text-white/50 font-medium">WhatsApp Audio...</p>
          </div>
          
          <div className="w-full flex flex-col gap-14">
            <div className="flex justify-around items-end opacity-40">
                <div className="flex flex-col items-center gap-2 text-white"><MessageSquare size={24} /><span className="text-[10px] uppercase font-bold tracking-widest">Mensagem</span></div>
                <div className="flex flex-col items-center gap-2 text-white"><X size={24} /><span className="text-[10px] uppercase font-bold tracking-widest">Lembrar</span></div>
            </div>
            
            <div className="flex justify-between items-center px-4 pb-12">
              <div className="flex flex-col items-center gap-3">
                <button onClick={handleHangUp} className="w-[75px] h-[75px] bg-[#FF3B30] rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-xl">
                  <Phone size={32} className="rotate-[135deg]" fill="currentColor" />
                </button>
                <span className="text-[12px] font-bold text-white/70">Recusar</span>
              </div>
              <div className="flex flex-col items-center gap-3">
                <button onClick={handleAnswer} className="w-[75px] h-[75px] bg-[#34C759] rounded-full flex items-center justify-center text-white active:scale-[0.85] shadow-[0_0_40px_rgba(52,199,89,0.3)] animate-pulse">
                  <Phone size={32} fill="currentColor" />
                </button>
                <span className="text-[12px] font-bold text-white/70">Aceitar</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col animate-fade-in justify-between">
          <div className="flex flex-col items-center pt-12">
            <div className="w-[90px] h-[90px] rounded-full overflow-hidden bg-gray-800 mb-5 border-2 border-white/10">
              <img src={profileImg} alt="Aline" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-[26px] font-bold text-white tracking-tight">Aline</h1>
            <p className="text-[14px] text-white/40 font-medium mb-1 uppercase tracking-widest">
               {callDuration === 0 ? 'Conectando...' : 'WhatsApp Audio'}
            </p>
            <p className="text-[22px] font-light text-white tabular-nums tracking-widest">{formatTime(callDuration)}</p>
            
            {audioError && (
              <div className="mt-6 mx-8 bg-[#FFCC00]/10 border border-[#FFCC00]/30 p-4 rounded-2xl flex flex-col items-center gap-2 animate-bounce">
                <AlertCircle size={20} className="text-[#FFCC00]" />
                <p className="text-[12px] text-[#FFCC00] font-bold text-center">Toque no botão 'viva-voz' abaixo para liberar o áudio.</p>
              </div>
            )}
          </div>

          <div className="px-10 pb-12">
            <div className="grid grid-cols-3 gap-y-8 mb-8">
              {[
                { icon: <MicOff size={24} />, label: "mudo" },
                { icon: <Grid3x3 size={24} />, label: "teclado" },
                { icon: <Volume2 size={24} />, label: "viva-voz", active: audioError, action: tryForcePlay },
                { icon: <Plus size={24} />, label: "adicionar" },
                { icon: <Video size={24} />, label: "FaceTime", disabled: true },
                { icon: <Users size={24} />, label: "contatos" },
              ].map((item, idx) => (
                <button key={idx} 
                  onClick={item.action}
                  disabled={item.disabled}
                  className={`flex flex-col items-center gap-2 transition-all ${item.disabled ? 'opacity-20' : 'active:scale-90'}`}
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-white ${item.active ? 'bg-white text-black viva-voz-alert' : 'bg-white/10'}`}>
                    {item.icon}
                  </div>
                  <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">{item.label}</span>
                </button>
              ))}
            </div>
            
            <div className="flex justify-center">
              <button onClick={handleHangUp} className="w-[68px] h-[68px] sm:w-[72px] sm:h-[72px] bg-[#FF3B30] rounded-full flex items-center justify-center text-white active:scale-90 transition-all shadow-2xl">
                <Phone size={32} className="rotate-[135deg]" fill="currentColor" />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-center pb-4 pt-2">
        <div className="w-32 h-1.5 bg-white/20 rounded-full" />
      </div>
    </div>
  );
};

export default CallMission;
