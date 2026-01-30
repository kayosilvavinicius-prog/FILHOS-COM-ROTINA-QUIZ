import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, ArrowRight, Play, Plus, AlertTriangle, Loader2 } from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';

const VSL_VIDEO_URL = "https://res.cloudinary.com/dafhibb8s/video/upload/v1767185181/MINI_VSL_40MB_-_FILHOS_COM_ROTINA_jgqf44.mp4";

const VideoMission: React.FC = () => {
  const navigate = useNavigate();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = useState(false); 
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [showCTA, setShowCTA] = useState(false);
  const [hasError, setHasError] = useState(false);

  const profileImg = "https://raw.githubusercontent.com/kayosilvavinicius-prog/FILHOS-COM-ROTINA/33b5814f67fd820ca815cac9094f790e29102d28/ALINE%20WHATSAPP.jpg";

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime;
      const duration = videoRef.current.duration;
      if (duration > 0) setProgress((currentTime / duration) * 100);
      
      const shouldShow = (currentTime >= 30 && currentTime < 60) || (currentTime >= 120);
      if (shouldShow !== showCTA) setShowCTA(shouldShow);

      // Rastrear conclusão se chegar perto do fim
      if (duration > 0 && currentTime / duration > 0.95) {
        funnelTracker.track("ETAPA_3_VSL_CONCLUIDA");
      }
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play().catch(() => {});
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  };

  const handleVideoError = () => {
    if (videoRef.current && videoRef.current.src !== "") {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleWaiting = () => setIsLoading(true);
  const handlePlaying = () => {
    setIsLoading(false);
    setIsPlaying(true);
    
    // Facebook Tracking - Started VSL
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'Mission3_Started');
    }
  };

  const handleCTAClick = () => {
    // Facebook Tracking - Completed Mission 3 / Advanced to Sales
    const fbq = (window as any).fbq;
    if (typeof fbq === 'function') {
      fbq('trackCustom', 'Mission3_Completed');
    }
    navigate('/sales');
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsPlaying(true);
          setIsLoading(false);
        }).catch(() => {
          if (videoRef.current) {
            videoRef.current.muted = true;
            setIsMuted(true);
            videoRef.current.play().then(() => {
              setIsPlaying(true);
              setIsLoading(false);
            }).catch(() => {
              setIsPlaying(false);
              setIsLoading(false);
            });
          }
        });
      }
    }
    return () => { if (videoRef.current) videoRef.current.pause(); };
  }, []);

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col max-w-[480px] mx-auto border-x border-white/10 select-none">
      <div className="absolute inset-0 z-0 flex items-center justify-center bg-black" onClick={togglePlay}>
        {hasError ? (
          <div className="flex flex-col items-center text-white p-8 text-center gap-4 animate-fade-in">
            <AlertTriangle size={48} className="text-yellow-500" />
            <p className="font-bold">Não foi possível carregar o vídeo.</p>
            <button onClick={(e) => { e.stopPropagation(); window.location.reload(); }} className="px-6 py-3 bg-white/10 rounded-full text-xs font-bold border border-white/20">TENTAR NOVAMENTE</button>
          </div>
        ) : (
          <>
            <video ref={videoRef} src={VSL_VIDEO_URL} className="w-full h-full object-cover" playsInline autoPlay loop preload="auto" crossOrigin="anonymous" muted={isMuted} onTimeUpdate={handleTimeUpdate} onError={handleVideoError} onWaiting={handleWaiting} onPlaying={handlePlaying} onCanPlay={() => setIsLoading(false)} />
            {isLoading && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 z-30 animate-fade-in">
                <Loader2 size={40} className="text-white animate-spin mb-4" />
                <p className="text-white/60 text-[10px] uppercase tracking-[0.2em] font-bold">Carregando Missão...</p>
              </div>
            )}
          </>
        )}
        {!isPlaying && !hasError && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"><Play size={40} fill="white" className="ml-2" /></div>
          </div>
        )}
      </div>

      <div className="absolute top-4 left-0 right-0 z-20 flex justify-end items-center px-6 pt-8 text-white">
        <button onClick={toggleMute} className="p-3 bg-black/20 backdrop-blur-sm rounded-full border border-white/10 active:scale-90 transition-all">
          {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
        </button>
      </div>

      <div className="absolute right-3 bottom-72 flex flex-col items-center gap-6 z-20">
        <div className="relative"><div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-lg"><img src={profileImg} alt="Aline" className="w-full h-full object-cover" /></div><div className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-[#FE2C55] rounded-full p-0.5 text-white"><Plus size={12} strokeWidth={4} /></div></div>
        <div className="flex flex-col items-center gap-1"><Heart size={34} fill="#FE2C55" stroke="none" className="drop-shadow-lg" /><span className="text-[11px] font-bold text-white shadow-sm">1.4M</span></div>
        <div className="flex flex-col items-center gap-1"><MessageCircle size={34} fill="white" stroke="none" className="drop-shadow-lg" /><span className="text-[11px] font-bold text-white shadow-sm">842</span></div>
        <div className="flex flex-col items-center gap-1"><Share2 size={34} fill="white" stroke="none" className="drop-shadow-lg" /><span className="text-[11px] font-bold text-white shadow-sm">Compartilhar</span></div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 p-6 pb-16 z-20 bg-gradient-to-t from-black/40 to-transparent">
        <div className="mb-32 pl-2"><h3 className="text-white font-bold text-[18px] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">@alineneves_oficial</h3><p className="text-white/95 text-[15px] leading-tight mt-1.5 line-clamp-1 italic drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Transformando a rotina da sua casa.</p></div>
        <div className="w-full h-[3px] bg-white/10 rounded-full mb-8 relative overflow-hidden"><div className="absolute h-full bg-[#FE2C55] transition-all duration-100 ease-linear shadow-[0_0_8px_rgba(254,44,85,0.8)]" style={{ width: `${progress}%` }} /></div>
        {showCTA && (
          <button onClick={handleCTAClick} className="w-full bg-[#FE2C55] text-white font-black py-5 rounded-2xl flex items-center justify-center gap-3 active:scale-95 transition-all shadow-[0_10px_40px_rgba(254,44,85,0.5)] animate-fade-in">
            <span className="tracking-tight uppercase text-[16px]">Quero meu filho com rotina</span>
            <ArrowRight size={24} />
          </button>
        )}
      </div>
    </div>
  );
};

export default VideoMission;