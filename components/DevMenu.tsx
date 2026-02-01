
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, X, ChevronRight, HelpCircle, MessageSquare, Phone, Play, ShoppingCart, FileText } from 'lucide-react';

const DevMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const routes = [
    { path: '/', name: 'Quiz Inicial', icon: <HelpCircle size={16} /> },
    { path: '/intro-whatsapp', name: 'Intro WhatsApp', icon: <MessageSquare size={16} /> },
    { path: '/missao-1-ligacao', name: 'Missão 1: Ligação', icon: <Phone size={16} /> },
    { path: '/missao-2-whatsapp', name: 'Missão 2: Chat', icon: <MessageSquare size={16} /> },
    { path: '/missao-3-video', name: 'Missão 3: Reels', icon: <Play size={16} /> },
    { path: '/sales', name: 'VSL + Quiz', icon: <ShoppingCart size={16} /> },
    { path: '/diagnostico', name: 'Diagnóstico Final', icon: <FileText size={16} /> },
  ];

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-[999] bg-black/80 text-white p-3 rounded-full shadow-2xl backdrop-blur-md border border-white/10 active:scale-90 transition-all"
      >
        <Settings size={20} />
      </button>
    );
  }

  return (
    <div className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-4 animate-fade-in">
      <div className="bg-white w-full max-w-[320px] rounded-[2.5rem] overflow-hidden shadow-2xl animate-slide-up">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex justify-between items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Menu Dev / QA</span>
          <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-black">
            <X size={20} />
          </button>
        </div>
        <div className="p-2">
          {routes.map((route) => (
            <button
              key={route.path}
              onClick={() => {
                navigate(route.path);
                setIsOpen(false);
              }}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 rounded-2xl transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="text-gray-400 group-hover:text-[#FE2C55] transition-colors">
                  {route.icon}
                </div>
                <span className="text-sm font-bold text-gray-700">{route.name}</span>
              </div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DevMenu;
