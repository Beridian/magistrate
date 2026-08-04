import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, PlusCircle, CheckCircle2 } from 'lucide-react';
import { GameSession, Player } from '../types';
import { soundEngine } from '../utils/audio';

interface QAPhaseProps {
  session: GameSession;
  players: Player[];
  magistrate: Player;
  totalTimeSec: number;
  onCorrectGuess: (guesserId: string) => void;
  onTimerExpired: () => void;
}

export const QAPhase: React.FC<QAPhaseProps> = ({
  session,
  players,
  magistrate,
  totalTimeSec,
  onCorrectGuess,
  onTimerExpired,
}) => {
  const [timeLeft, setTimeLeft] = useState(totalTimeSec);
  const [isRunning, setIsRunning] = useState(true);
  const [showGuesserModal, setShowGuesserModal] = useState(false);
  const [selectedGuesserId, setSelectedGuesserId] = useState<string | null>(null);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer logic
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current as NodeJS.Timeout);
            setIsRunning(false);
            soundEngine.playNoBuzz();
            onTimerExpired();
            return 0;
          }
          if (prev <= 6) {
            soundEngine.playWarningBeep();
          } else if (prev % 10 === 0) {
            soundEngine.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, timeLeft, onTimerExpired]);

  const toggleTimer = () => {
    soundEngine.playClick();
    setIsRunning((prev) => !prev);
  };

  const handleAdd30s = () => {
    soundEngine.playClick();
    setTimeLeft((prev) => prev + 30);
  };

  // Magistrate response handlers
  const handleYes = () => {
    soundEngine.playYesChime();
  };

  const handleNo = () => {
    soundEngine.playNoBuzz();
  };

  const handleIDK = () => {
    soundEngine.playIDKChime();
  };

  const handleOpenGuesserModal = () => {
    soundEngine.playClick();
    setIsRunning(false);
    setShowGuesserModal(true);
  };

  const handleConfirmGuesser = () => {
    if (!selectedGuesserId) return;
    soundEngine.playClick();
    onCorrectGuess(selectedGuesserId);
  };

  // Format MM:SS
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  const progressPercent = (timeLeft / totalTimeSec) * 100;

  return (
    <div className="flex-1 w-full max-w-2xl mx-auto p-4 flex flex-col justify-between text-[#E0D7D0] animate-fade-in relative">
      {/* Top Banner & Timer Controls */}
      <div className="flex items-center justify-between bg-[#0F0F0F] border border-white/10 p-3.5 rounded-2xl shadow-md">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-[#070707] border border-[#D4AF37]/50 flex items-center justify-center text-lg">
            {magistrate.avatar}
          </div>
          <div>
            <div className="text-[9px] text-[#D4AF37] font-sans font-bold uppercase tracking-[0.2em]">Presiding Magistrate</div>
            <div className="text-sm font-serif text-white">{magistrate.name}</div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleAdd30s}
            className="px-3 py-1.5 bg-[#070707] hover:bg-[#181818] border border-white/10 text-[#E0D7D0] rounded-full transition text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1"
            title="Add 30 seconds"
          >
            <PlusCircle className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>+30s</span>
          </button>

          <button
            onClick={toggleTimer}
            className={`px-3.5 py-1.5 rounded-full transition text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1 border ${
              isRunning
                ? 'bg-[#070707] text-[#D4AF37] border-[#D4AF37]/40'
                : 'bg-[#D4AF37] text-black border-[#D4AF37]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Resume</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* FULL-SCREEN PUBLIC COUNTDOWN TIMER */}
      <div className="my-auto text-center space-y-6 py-4">
        <div className="space-y-1">
          <span className="px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
            Interrogation Phase
          </span>
          <h2 className="text-xs text-[#A6998A] font-sans">
            Direct your inquiries to the Magistrate!
          </h2>
        </div>

        {/* Large Countdown Display */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          {/* Radial progress ring */}
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="44"
              className="stroke-[#0F0F0F] fill-none"
              strokeWidth="6"
            />
            <circle
              cx="50"
              cy="50"
              r="44"
              className={`fill-none transition-all duration-1000 ${
                timeLeft < 15 ? 'stroke-rose-500' : 'stroke-[#D4AF37]'
              }`}
              strokeWidth="6"
              strokeDasharray="276.46"
              strokeDashoffset={276.46 - (276.46 * progressPercent) / 100}
              strokeLinecap="round"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center space-y-1">
            <span
              className={`font-serif tracking-tight text-5xl sm:text-6xl ${
                timeLeft < 15 ? 'text-rose-400 animate-pulse' : 'text-white'
              }`}
            >
              {timeString}
            </span>
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#A6998A] font-sans font-bold">
              Time Remaining
            </span>
          </div>
        </div>

        {/* Correct Guess Action Button */}
        <button
          onClick={handleOpenGuesserModal}
          className="px-8 py-4 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold text-sm uppercase tracking-[0.15em] rounded-full transition shadow-xl gold-glow flex items-center justify-center space-x-2 mx-auto"
        >
          <CheckCircle2 className="w-5 h-5" />
          <span>SECRET WORD GUESSED!</span>
        </button>
      </div>

      {/* MAGISTRATE BOTTOM RESPONSE STRIP */}
      <div className="space-y-2 pt-2">
        <div className="text-[9px] text-center font-sans font-bold uppercase tracking-[0.25em] text-[#A6998A]">
          Magistrate Chime Controls
        </div>

        <div className="grid grid-cols-3 gap-3">
          <button
            onClick={handleYes}
            className="py-3.5 bg-[#0F0F0F] hover:bg-emerald-950/40 border border-emerald-500/50 text-emerald-300 font-sans font-bold text-sm rounded-2xl transition shadow-lg active:scale-95 flex flex-col items-center justify-center"
          >
            <span>AFFIRMATIVE</span>
            <span className="text-[9px] text-emerald-400/70 font-sans font-normal uppercase tracking-wider">Yes Chime</span>
          </button>

          <button
            onClick={handleNo}
            className="py-3.5 bg-[#0F0F0F] hover:bg-[#8B0000]/30 border border-[#8B0000] text-rose-300 font-sans font-bold text-sm rounded-2xl transition shadow-lg active:scale-95 flex flex-col items-center justify-center"
          >
            <span>NEGATIVE</span>
            <span className="text-[9px] text-rose-400/70 font-sans font-normal uppercase tracking-wider">No Buzz</span>
          </button>

          <button
            onClick={handleIDK}
            className="py-3.5 bg-[#0F0F0F] hover:bg-[#181818] border border-[#D4AF37]/50 text-[#D4AF37] font-sans font-bold text-sm rounded-2xl transition shadow-lg active:scale-95 flex flex-col items-center justify-center"
          >
            <span>UNCLEAR</span>
            <span className="text-[9px] text-[#D4AF37]/70 font-sans font-normal uppercase tracking-wider">Chime</span>
          </button>
        </div>
      </div>

      {/* GUESSER SELECTION MODAL */}
      {showGuesserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-center shadow-2xl gold-box-glow">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-2xl">
                🎯
              </div>
              <h3 className="text-2xl font-serif text-[#D4AF37]">Who Unmasked the Secret Word?</h3>
              <p className="text-xs text-[#A6998A] font-sans">
                Select the council member who accurately spoke the secret word.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 max-h-[40vh] overflow-y-auto p-1">
              {players.map((p) => {
                const isSelected = selectedGuesserId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedGuesserId(p.id)}
                    className={`p-3 rounded-2xl border flex items-center space-x-3 transition font-sans ${
                      isSelected
                        ? 'bg-[#070707] border-[#D4AF37] text-[#D4AF37] gold-box-glow'
                        : 'bg-[#070707] border-white/10 text-[#E0D7D0] hover:bg-[#181818]'
                    }`}
                  >
                    <span className="text-2xl">{p.avatar}</span>
                    <span className="font-bold text-sm truncate">{p.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center space-x-3 pt-2">
              <button
                onClick={() => {
                  setShowGuesserModal(false);
                  setIsRunning(true);
                }}
                className="flex-1 py-3 bg-[#070707] hover:bg-[#181818] border border-white/10 text-[#A6998A] font-sans font-bold uppercase tracking-wider text-xs rounded-full transition"
              >
                Cancel / Resume
              </button>

              <button
                onClick={handleConfirmGuesser}
                disabled={!selectedGuesserId}
                className="flex-1 py-3 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg"
              >
                Confirm Guesser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
