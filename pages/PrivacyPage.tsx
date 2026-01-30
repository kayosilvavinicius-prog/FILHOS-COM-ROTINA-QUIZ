
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ShieldCheck, Lock, Eye, FileText } from 'lucide-react';
import IOSStatusBar from '../components/iOSStatusBar';

const PrivacyPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white font-sans text-[#0F172A]">
      <IOSStatusBar dark />
      <header className="px-6 py-4 flex items-center gap-4 sticky top-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <button onClick={() => navigate(-1)} className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="font-black text-lg tracking-tight">Privacidade</h1>
      </header>

      <main className="px-6 py-10 max-w-2xl mx-auto space-y-12">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center mx-auto text-[#FE2C55]">
            <ShieldCheck size={40} />
          </div>
          <h2 className="text-3xl font-black">Sua privacidade é nossa prioridade</h2>
          <p className="text-gray-500 font-medium">Entenda como cuidamos dos seus dados e dos dados do seu filho no app Filhos com Rotina.</p>
        </div>

        <section className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0"><FileText size={20} className="text-[#FE2C55]" /></div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">1. Coleta de Informações</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Coletamos informações básicas durante o quiz (como idade do filho e rotina atual) para personalizar o seu guia. Seus dados de contato (nome, e-mail e WhatsApp) são solicitados apenas para o envio do acesso e comunicações estratégicas relacionadas ao método.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0"><Eye size={20} className="text-[#FE2C55]" /></div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">2. Uso dos Dados</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Os dados do quiz são utilizados exclusivamente para gerar o seu diagnóstico personalizado. Não vendemos seus dados para terceiros. O seu WhatsApp e e-mail serão usados apenas para suporte e avisos sobre o sistema.</p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0"><Lock size={20} className="text-[#FE2C55]" /></div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg">3. Segurança e Proteção</h3>
              <p className="text-sm text-gray-500 leading-relaxed">Utilizamos protocolos de segurança modernos para garantir que suas respostas e informações pessoais estejam protegidas contra acesso não autorizado.</p>
            </div>
          </div>
        </section>

        <div className="bg-gray-50 p-8 rounded-[2.5rem] space-y-4 border border-gray-100">
          <h4 className="font-black text-center uppercase tracking-widest text-[10px] text-gray-400">Compromisso d4k maternidade</h4>
          <p className="text-xs text-gray-500 leading-loose text-center">
            Este site e o sistema Filhos com Rotina cumprem rigorosamente a LGPD (Lei Geral de Proteção de Dados). Ao utilizar nossa plataforma, você concorda com os termos descritos nesta página.
          </p>
        </div>

        <button 
          onClick={() => navigate(-1)}
          className="w-full bg-[#FE2C55] text-white font-black py-6 rounded-3xl shadow-xl active:scale-95 transition-all"
        >
          VOLTAR PARA O APP
        </button>
      </main>

      <footer className="py-12 px-6 text-center opacity-40 border-t border-gray-50 mt-20">
        <p className="text-[10px] font-bold uppercase tracking-widest">© 2025 Filhos com Rotina • v1.0.2</p>
      </footer>
    </div>
  );
};

export default PrivacyPage;
