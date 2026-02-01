
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Mail, User, Phone, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';
import { funnelTracker } from '../services/funnelTracker';
import IOSStatusBar from '../components/iOSStatusBar';

const LeadCapturePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const answers = location.state?.answers || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Rastrear leads na planilha (os dados vão como uma string concatenada no campo 'data')
    const leadData = `Nome: ${formData.name} | E-mail: ${formData.email} | Tel: ${formData.phone}`;
    funnelTracker.track("CHECKOUT_INICIADO", leadData); // Usamos um step de checkout para marcar a intenção forte

    setTimeout(() => {
      navigate('/diagnostico', { state: { answers, lead: formData } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A] flex flex-col">
      <IOSStatusBar dark />
      
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-12 max-w-[450px] mx-auto w-full">
        <header className="text-center mb-10 space-y-4">
          <div className="inline-flex p-3 bg-red-50 rounded-2xl text-[#FE2C55] mb-2">
            <Sparkles size={32} />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tighter leading-tight uppercase">
            Quase lá, Mãe!
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-relaxed px-4">
            Informe seus dados abaixo para enviarmos seu <span className="font-bold text-[#0F172A]">Guia PDF gratuito</span> e seu <span className="font-bold text-[#0F172A]">Diagnóstico Personalizado</span> agora mesmo.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FE2C55] transition-colors">
              <User size={20} />
            </div>
            <input 
              required
              type="text" 
              placeholder="Seu nome completo"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FE2C55] transition-colors">
              <Mail size={20} />
            </div>
            <input 
              required
              type="email" 
              placeholder="Seu melhor e-mail"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:bg-white transition-all"
            />
          </div>

          <div className="relative group">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FE2C55] transition-colors">
              <Phone size={20} />
            </div>
            <input 
              required
              type="tel" 
              placeholder="WhatsApp com DDD"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-5 pl-14 pr-6 font-bold text-[15px] focus:outline-none focus:ring-2 focus:ring-[#FE2C55]/20 focus:bg-white transition-all"
            />
          </div>

          <button 
            disabled={loading}
            type="submit" 
            className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-3xl shadow-xl shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 border-red-800 uppercase tracking-tight"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={24} />
            ) : (
              <>ENVIAR MEUS MATERIAIS <ArrowRight size={20} /></>
            )}
          </button>
        </form>

        <div className="mt-10 flex flex-col items-center gap-3 opacity-40">
          <ShieldCheck size={24} />
          <p className="text-[10px] font-bold uppercase tracking-widest text-center">
            Seus dados estão 100% seguros.<br/>Odieamos spam tanto quanto você.
          </p>
        </div>
      </main>
    </div>
  );
};

export default LeadCapturePage;
