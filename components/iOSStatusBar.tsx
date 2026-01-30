
import React, { useState, useEffect } from 'react';
import { Battery, Wifi, SignalHigh } from 'lucide-react';

interface IOSStatusBarProps {
  dark?: boolean;
}

// Renamed to IOSStatusBar to ensure it's recognized as a React component in JSX
const IOSStatusBar: React.FC<IOSStatusBarProps> = ({ dark = false }) => {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTime(now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`flex justify-between items-center px-6 pt-3 pb-2 text-sm font-semibold tracking-tight h-[44px] ${dark ? 'text-black' : 'text-white'}`}>
      <div className="flex-1">{time}</div>
      <div className="flex items-center gap-1.5">
        <SignalHigh size={16} strokeWidth={2.5} />
        <Wifi size={16} strokeWidth={2.5} />
        <Battery size={20} strokeWidth={2} className="rotate-0" />
      </div>
    </div>
  );
};

export default IOSStatusBar;
