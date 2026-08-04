import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, CheckCircle, ShieldAlert } from 'lucide-react';
import { GameSession, Player } from '../types';
import { soundEngine } from '../utils/audio';

interface JudgmentVoteProps {
  session: GameSession;
  players: Player[];
  guesser: Player;
  onVoteComplete: (votesYes: number, votesNo: number) => void;
}

export const JudgmentVote: React.FC<JudgmentVoteProps> = ({
  session,
  players,
  guesser,
  onVoteComplete,
}) => {
  const eligibleVoters = players.filter((p) => p.id !== guesser.id);
  
  const [votes, setVotes] = useState<Record<string, boolean>>({});
  const [showConfirmation, setShowConfirmation] = useState(false);

  const toggleVote = (playerId: string) => {
    soundEngine.playClick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: !prev[playerId],
    }));
  };

  const yesCount = Object.values(votes).filter(Boolean).length;
  const noCount = eligibleVoters.length - yesCount;

  const handleSubmit = () => {
    soundEngine.playClick();
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = () => {
    soundEngine.playClick();
    onVoteComplete(yesCount, noCount);
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in">
      <div className="space-y-6 pt-2">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
            Council Judgment Vote
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            Did <span className="text-[#D4AF37]">{guesser.name}</span> guess because they are the Spy?
          </h2>
          <p className="text-xs text-[#A6998A] font-sans">
            Raise hands in person! The scribe records each member's vote on screen.
          </p>
        </div>

        {/* Guesser Card */}
        <div className="bg-[#0F0F0F] border border-white/10 p-4 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3 font-serif">
            <span className="text-2xl">{guesser.avatar}</span>
            <div>
              <div className="font-semibold text-sm text-white">{guesser.name} (Guesser)</div>
              <div className="text-[11px] text-[#A6998A] font-sans">Excluded from voting</div>
            </div>
          </div>
          <span className="text-[10px] font-sans font-bold text-[#D4AF37] uppercase bg-[#070707] px-3 py-1 rounded-full border border-[#D4AF37]/40 tracking-widest">
            On Trial
          </span>
        </div>

        {/* Voting Tally Grid */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A6998A] px-1">
            <span>Hand-Raise Tally ({eligibleVoters.length} Voters)</span>
            <span>
              <span className="text-rose-400">{yesCount} YES</span> /{' '}
              <span className="text-emerald-400">{noCount} NO</span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[40vh] overflow-y-auto pr-1">
            {eligibleVoters.map((p) => {
              const isYes = votes[p.id] === true;
              return (
                <button
                  key={p.id}
                  onClick={() => toggleVote(p.id)}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition font-sans ${
                    isYes
                      ? 'bg-[#0F0F0F] border-[#8B0000] text-rose-200'
                      : 'bg-[#0F0F0F] border-emerald-500/50 text-emerald-200'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 font-serif">
                    <span className="text-xl">{p.avatar}</span>
                    <span className="font-semibold text-sm">{p.name}</span>
                  </div>

                  <div className="flex items-center space-x-1.5 font-bold text-xs px-2.5 py-1 rounded-full bg-[#070707]">
                    {isYes ? (
                      <>
                        <ThumbsUp className="w-3.5 h-3.5 text-rose-400" />
                        <span className="text-rose-300">YES (SPY)</span>
                      </>
                    ) : (
                      <>
                        <ThumbsDown className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-300">NO (INNOCENT)</span>
                      </>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 pb-6">
        <button
          onClick={handleSubmit}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <CheckCircle className="w-5 h-5" />
          <span>TALLY VOTES & REVEAL DECREE</span>
        </button>
      </div>

      {/* CONFIRMATION READ-BACK MODAL */}
      {showConfirmation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-center shadow-2xl gold-box-glow">
            <div className="space-y-2">
              <ShieldAlert className="w-12 h-12 mx-auto text-[#D4AF37]" />
              <h3 className="text-2xl font-serif text-[#D4AF37]">Confirm Hand-Raise Tally</h3>
              <p className="text-xs text-[#A6998A] font-sans">Read back to the council before final reveal!</p>
            </div>

            <div className="bg-[#070707] border border-white/10 p-4 rounded-2xl space-y-3 text-sm font-sans">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <span className="text-rose-300 font-bold">Voted YES (Guesser is Spy):</span>
                <span className="font-serif font-bold text-lg text-rose-400">{yesCount} Votes</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-emerald-300 font-bold">Voted NO (Guesser is Innocent):</span>
                <span className="font-serif font-bold text-lg text-emerald-400">{noCount} Votes</span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={() => setShowConfirmation(false)}
                className="flex-1 py-3 bg-[#070707] hover:bg-[#181818] border border-white/10 text-[#A6998A] font-sans font-bold uppercase tracking-wider text-xs rounded-full transition"
              >
                Edit Tally
              </button>

              <button
                onClick={handleConfirmSubmit}
                className="flex-1 py-3 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg"
              >
                Confirm & Proceed
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
