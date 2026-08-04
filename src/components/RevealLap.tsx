import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Player, GameSession, Role } from '../types';
import { soundEngine } from '../utils/audio';

interface RevealLapProps {
  session: GameSession;
  players: Player[];
  onLapComplete: () => void;
}

export const RevealLap: React.FC<RevealLapProps> = ({ session, players, onLapComplete }) => {
  const [currentPlayerIdx, setCurrentPlayerIdx] = useState(0);
  const [step, setStep] = useState<'handoff' | 'reveal'>('handoff');
  const [isHolding, setIsHolding] = useState(false);

  const currentPlayer = players[currentPlayerIdx];
  const totalPlayers = players.length;

  if (!currentPlayer) return null;

  const role: Role = session.roleAssignments[currentPlayer.id] || 'Townsfolk';
  const isMagistrate = role === 'Magistrate';
  const isSpy = role === 'Spy';
  const secretTheme = session.selectedTheme;

  const handleStartReveal = () => {
    soundEngine.playClick();
    setStep('reveal');
    setIsHolding(false);
  };

  const handleHoldStart = () => {
    setIsHolding(true);
    soundEngine.playRevealHoldStart();
  };

  const handleHoldEnd = () => {
    setIsHolding(false);
  };

  const handleNextPlayer = () => {
    soundEngine.playClick();
    setIsHolding(false);

    if (currentPlayerIdx < totalPlayers - 1) {
      setCurrentPlayerIdx(currentPlayerIdx + 1);
      setStep('handoff');
    } else {
      onLapComplete();
    }
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] select-none animate-fade-in">
      {/* Top Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[10px] font-sans font-bold text-[#A6998A] uppercase tracking-[0.25em]">
          <span>Secret Role Pass</span>
          <span>
            Member {currentPlayerIdx + 1} of {totalPlayers}
          </span>
        </div>

        <div className="w-full bg-[#0F0F0F] border border-white/10 rounded-full h-2 overflow-hidden">
          <div
            className="bg-[#D4AF37] h-full transition-all duration-300"
            style={{ width: `${((currentPlayerIdx + 1) / totalPlayers) * 100}%` }}
          />
        </div>
      </div>

      {/* STEP 1: Neutral Handoff Screen */}
      {step === 'handoff' && (
        <div className="my-auto space-y-6 text-center animate-fade-in py-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#0F0F0F] border border-[#D4AF37]/50 flex items-center justify-center text-4xl gold-box-glow">
            📱
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase tracking-[0.3em]">
              Pass Device
            </span>
            <h2 className="text-3xl sm:text-4xl font-serif text-white font-normal">
              Hand device to <span className="text-[#D4AF37]">{currentPlayer.name}</span>
            </h2>
            <p className="text-xs text-[#A6998A] max-w-xs mx-auto font-sans">
              All other council members must avert their gaze while {currentPlayer.name} inspects their decree.
            </p>
          </div>

          <div className="bg-[#0F0F0F] border border-white/10 p-5 rounded-2xl max-w-xs mx-auto space-y-4 shadow-xl">
            <div className="flex items-center justify-center space-x-3 text-white font-serif text-base">
              <span className="text-2xl">{currentPlayer.avatar}</span>
              <span>{currentPlayer.name}</span>
            </div>

            <button
              onClick={handleStartReveal}
              className="w-full py-3.5 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-xs rounded-full transition shadow-lg flex items-center justify-center space-x-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>I'm {currentPlayer.name}, Inspect Role</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Hold-to-Reveal Secret Screen */}
      {step === 'reveal' && (
        <div className="my-auto space-y-6 text-center animate-fade-in py-4">
          <div className="space-y-1">
            <div className="text-[10px] font-sans font-bold text-[#A6998A] uppercase tracking-[0.3em] flex items-center justify-center space-x-1">
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Confidential Role Decree</span>
            </div>
            <h3 className="text-xl font-serif text-white">{currentPlayer.name}'s Inspection</h3>
          </div>

          {/* Secret Reveal Area */}
          <div className="relative min-h-[220px] bg-[#0F0F0F] border-2 border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center shadow-2xl overflow-hidden transition-all duration-200">
            {isHolding ? (
              /* ACTIVE SECRET CONTENT DISPLAY */
              <div className="space-y-4 animate-scale-up text-center z-10 w-full">
                {/* Role Badge */}
                {isMagistrate && (
                  <div className="inline-block px-3 py-1 rounded-full bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/50 text-xs font-sans font-bold uppercase tracking-widest">
                    Role: PRESIDING MAGISTRATE
                  </div>
                )}
                {isSpy && (
                  <div className="inline-block px-3 py-1 rounded-full bg-[#8B0000]/40 text-rose-300 border border-[#8B0000] text-xs font-sans font-bold uppercase tracking-widest">
                    Role: THE SPY 🕵️
                  </div>
                )}
                {!isMagistrate && !isSpy && (
                  <div className="inline-block px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-sans font-bold uppercase tracking-widest">
                    Role: TOWNSFOLK
                  </div>
                )}

                {/* Secret Word Display */}
                <div className="p-4 bg-[#070707] border border-white/10 rounded-2xl space-y-1 shadow-inner">
                  <div className="text-[10px] text-[#A6998A] font-sans font-bold uppercase tracking-widest">
                    Secret Word / Theme
                  </div>
                  {(isMagistrate || isSpy) ? (
                    <div className="text-2xl sm:text-3xl font-serif text-[#D4AF37] tracking-wide font-bold">
                      {secretTheme.text}
                    </div>
                  ) : (
                    <div className="text-xl font-serif text-[#A6998A] italic">
                      ??? (Hidden from Townsfolk)
                    </div>
                  )}
                  <div className="text-[11px] text-[#A6998A] font-sans">Category: {secretTheme.category}</div>
                </div>

                <p className="text-xs text-[#E0D7D0] px-2 font-sans">
                  {isMagistrate && 'Answer inquiry questions with Affirmative, Negative, or Unclear.'}
                  {isSpy && 'You hold the secret word! Blend into the council without being unmasked.'}
                  {!isMagistrate && !isSpy && 'Interrogate wisely to deduce the secret word & expose the Spy!'}
                </p>
              </div>
            ) : (
              /* HIDDEN COVER DISPLAY */
              <div className="space-y-3 text-center text-[#A6998A] z-10">
                <EyeOff className="w-12 h-12 mx-auto text-[#A6998A]/50 animate-pulse" />
                <div className="font-serif text-[#E0D7D0] text-base">Role & Secret Word Concealed</div>
                <p className="text-xs text-[#A6998A] max-w-xs font-sans">
                  Press and HOLD the trigger below to inspect your confidential role.
                </p>
              </div>
            )}
          </div>

          {/* Hold Button */}
          <button
            onMouseDown={handleHoldStart}
            onMouseUp={handleHoldEnd}
            onTouchStart={handleHoldStart}
            onTouchEnd={handleHoldEnd}
            className={`w-full py-5 rounded-full font-sans font-bold uppercase tracking-[0.15em] text-sm transition-all transform active:scale-98 shadow-xl flex items-center justify-center space-x-2 border ${
              isHolding
                ? 'bg-[#D4AF37] text-black border-[#D4AF37] gold-box-glow'
                : 'bg-[#0F0F0F] hover:bg-[#181818] text-[#D4AF37] border-[#D4AF37]/50'
            }`}
          >
            {isHolding ? (
              <>
                <Eye className="w-5 h-5 animate-pulse" />
                <span>RELEASE TO CONCEAL</span>
              </>
            ) : (
              <>
                <Lock className="w-5 h-5" />
                <span>HOLD TO REVEAL ROLE</span>
              </>
            )}
          </button>

          {/* Confirm & Next Button */}
          <button
            onClick={handleNextPlayer}
            className="w-full py-3 bg-[#0F0F0F] hover:bg-[#181818] text-[#A6998A] hover:text-[#E0D7D0] font-sans font-bold uppercase tracking-wider rounded-full transition text-xs border border-white/10 flex items-center justify-center space-x-2"
          >
            <CheckCircle2 className="w-4 h-4 text-[#D4AF37]" />
            <span>Role Inspected, Pass Device</span>
          </button>
        </div>
      )}

      {/* Footer Instructions */}
      <div className="text-center text-[10px] font-sans uppercase tracking-widest text-[#A6998A]/60">
        Strict Council Silence: Do not disclose your role aloud!
      </div>
    </div>
  );
};
