import React, { useState, useEffect } from 'react';

const funnyQuotes = [
  "Os anúncios trabalharam enquanto tomavas café ☕",
  "O algoritmo acordou inspirado hoje 😎",
  "Mais dados, menos achismos 📈",
  "O pixel acordou motivado 🔥",
  "As conversões não dormem, tu sim 🌙",
  "Meta Ads a fazer magia enquanto dormias ✨",
  "ROAS subindo, stress descendo 📊",
  "Campanha otimizada, café merecido 💪",
  "Os cliques chegaram, as vendas também 🎯",
  "Dashboard atualizado, decisões facilitadas 🚀",
  "Budget bem investido = Sexta-feira tranquila 😌",
  "Enquanto tu descansavas, os leads chegavam 📲",
  "CSS centrado, campanhas otimizadas 💻",
  "Loading... ROI a aumentar ⏳",
  "Spoiler: os dados não mentem 📖",
  "Hoje aprendi: dados > opiniões 🧠"
];

interface WelcomeBannerProps {
  userName?: string;
  clientName?: string;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ 
  userName = "Ricardo Carneiro",
  clientName 
}) => {
  const [currentQuote, setCurrentQuote] = useState(0);
  
  // Rotacionar frase a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % funnyQuotes.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-400 rounded-xl p-8 shadow-sm relative overflow-hidden">
      {/* Elementos decorativos (opcional) */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/20 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <h1 className="text-3xl font-normal text-white mb-2 tracking-tight">
          Bem-vindo de volta, <span className="font-bold">{userName}</span>! 👋
        </h1>
        
        {/* Frase rotativa com animação */}
        <div className="overflow-hidden h-8">
          <p 
            key={currentQuote}
            className="text-white/90 text-lg font-medium animate-slide-up"
          >
            {funnyQuotes[currentQuote]}
          </p>
        </div>
      </div>
    </div>
  );
};