import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Award, ArrowRight } from 'lucide-react';
import { GameSession, Player, GameOutcome } from '../types';
import { soundEngine } from '../utils/audio';

interface EndGameRevealProps {
  session: GameSession;
  players: Player[];
  onProceedToSummary: () => void;
}

export const EndGameReveal: React.FC<EndGameRevealProps> = ({
  session,
  players,
  onProceedToSummary,
}) => {
  const outcome: GameOutcome = session.gameOutcome || 'TownsfolkWin_SpyCaught';
  const spyPlayer = session.spyPlayerId ? players.find((p) => p.id === session.spyPlayerId) : null;

  const isTownsfolkVictory =
    outcome === 'TownsfolkWin_SpyCaught' ||
    outcome === 'TownsfolkWin_SpyUnmasked' ||
    outcome === 'TownsfolkWin_CoopGuessed';

  useEffect(() => {
    soundEngine.playDramaticGong();

    if (isTownsfolkVictory) {
      soundEngine.playVictoryFanfare();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [isTownsfolkVictory]);

  const handleNext = () => {
    soundEngine.playClick();
    onProceedToSummary();
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in text-center">
      <div className="space-y-6 pt-4">
        {/* Victory/Defeat Banner */}
        <div className="space-y-3">
          <div
            className={`inline-flex items-center space-x-2 px-4 py-1.5 rounded-full border text-[10px] font-sans font-bold uppercase tracking-[0.3em] ${
              isTownsfolkVictory
                ? 'bg-[#0F0F0F] text-[#D4AF37] border-[#D4AF37]/50'
                : 'bg-[#0F0F0F] text-rose-300 border-[#8B0000]'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>
              {isTownsfolkVictory ? 'TOWNSFOLK VICTORY!' : 'THE SPY PREVAILS!'}
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-serif text-white tracking-tight">
            {outcome === 'TownsfolkWin_SpyCaught' && 'The Spy was Caught!'}
            {outcome === 'TownsfolkWin_SpyUnmasked' && 'The Spy was Unmasked!'}
            {outcome === 'TownsfolkWin_CoopGuessed' && 'Cooperative Victory!'}
            {outcome === 'SpyWin_InnocentExiled' && 'Innocent Townsfolk Exiled!'}
            {outcome === 'SpyWin_SpyEscaped' && 'The Spy Escaped!'}
            {outcome === 'SpyWin_TimeExpired' && 'Time Expired!'}
            {outcome === 'TimeExpiredLoss_NoSpy' && 'Time Expired! Everyone Lost!'}
          </h2>
        </div>

        {/* Spy Unmasking Hero Box */}
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 p-6 rounded-3xl space-y-4 shadow-2xl gold-box-glow relative overflow-hidden">
          {!session.hasSpy ? (
            /* NO SPY REVEAL */
            <div className="space-y-3 py-2 font-sans">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-3xl">
                ✨
              </div>
              <div className="text-2xl font-serif text-[#D4AF37]">NO SPY IN THE COUNCIL!</div>
              <p className="text-xs text-[#A6998A] max-w-xs mx-auto">
                You played the rare Cooperative Variant! Everyone won by discovering the Secret Word together.
              </p>
            </div>
          ) : (
            /* NORMAL SPY REVEAL */
            <div className="space-y-3">
              <div className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase tracking-[0.25em]">
                The Clandestine Spy Was
              </div>

              <div className="w-20 h-20 mx-auto rounded-full bg-[#070707] border-2 border-[#D4AF37] flex items-center justify-center text-4xl shadow-xl gold-glow animate-scale-up">
                {spyPlayer?.avatar || '🕵️'}
              </div>

              <div className="text-2xl font-serif text-white">{spyPlayer?.name}</div>
            </div>
          )}

          {/* Secret Word Display */}
          <div className="p-4 bg-[#070707] border border-white/10 rounded-2xl space-y-1">
            <div className="text-[9px] text-[#A6998A] font-sans font-bold uppercase tracking-[0.2em]">
              Tonight's Secret Word Was
            </div>
            <div className="text-2xl font-serif text-[#D4AF37]">
              {session.selectedTheme.text}
            </div>
            <div className="text-xs text-[#A6998A] font-sans">Category: {session.selectedTheme.category}</div>
          </div>
        </div>
      </div>

      <div className="pb-6">
        <button
          onClick={handleNext}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <span>VIEW GAME SUMMARY & LEADERBOARD</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
