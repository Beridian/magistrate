import React, { useState, useEffect } from 'react';
import { MessageSquare, ArrowRight, Clock } from 'lucide-react';
import { GameSession, Player } from '../types';
import { soundEngine } from '../utils/audio';

interface DiscussionPhaseProps {
  session: GameSession;
  guesser: Player;
  onProceedToVoting: () => void;
}

export const DiscussionPhase: React.FC<DiscussionPhaseProps> = ({
  session,
  guesser,
  onProceedToVoting,
}) => {
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const handleProceed = () => {
    soundEngine.playClick();
    onProceedToVoting();
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in text-center">
      <div className="space-y-6 pt-4">
        {/* Banner */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Council Deliberation</span>
        </div>

        {/* Guesser Highlight */}
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 p-6 rounded-3xl space-y-3 shadow-2xl gold-box-glow">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-3xl shadow-inner">
            {guesser.avatar}
          </div>
          <div className="space-y-1">
            <div className="text-2xl font-serif text-white">{guesser.name}</div>
            <div className="text-xs text-[#D4AF37] font-sans font-bold uppercase tracking-wider">Unmasked the Secret Word</div>
          </div>
        </div>

        <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-2xl space-y-2 text-xs text-[#E0D7D0] font-sans">
          <p className="font-semibold text-white">
            Is <span className="text-[#D4AF37]">{guesser.name}</span> the clandestine Spy who held the word, or a cunning Townsfolk who deduced it?
          </p>
          <p className="text-[#A6998A]">
            Debate freely before convening for the final Council Judgment Vote.
          </p>
        </div>

        {/* Discussion Countdown */}
        <div className="flex items-center justify-center space-x-2 text-xl font-serif text-[#D4AF37] bg-[#070707] p-3.5 rounded-2xl border border-white/10 w-48 mx-auto shadow-md">
          <Clock className="w-4 h-4 text-[#D4AF37]" />
          <span>{timeLeft}s Remaining</span>
        </div>
      </div>

      <div className="pb-6">
        <button
          onClick={handleProceed}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <span>PROCEED TO JUDGMENT VOTE</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
