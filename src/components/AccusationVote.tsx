import React, { useState } from 'react';
import { Target } from 'lucide-react';
import { GameSession, Player } from '../types';
import { soundEngine } from '../utils/audio';

interface AccusationVoteProps {
  session: GameSession;
  players: Player[];
  guesser: Player;
  onAccusationComplete: (accusedPlayerId: string, tieBreakerUsed: boolean) => void;
}

export const AccusationVote: React.FC<AccusationVoteProps> = ({
  session,
  players,
  guesser,
  onAccusationComplete,
}) => {
  const [votes, setVotes] = useState<Record<string, number>>({});
  const [showTieBreaker, setShowTieBreaker] = useState(false);
  const [tiedPlayerIds, setTiedPlayerIds] = useState<string[]>([]);
  const [selectedTieWinnerId, setSelectedTieWinnerId] = useState<string | null>(null);

  const handleIncrement = (playerId: string) => {
    soundEngine.playClick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: (prev[playerId] || 0) + 1,
    }));
  };

  const handleDecrement = (playerId: string) => {
    soundEngine.playClick();
    setVotes((prev) => ({
      ...prev,
      [playerId]: Math.max(0, (prev[playerId] || 0) - 1),
    }));
  };

  const totalVotesLogged = Object.values(votes).reduce((a: number, b: number) => a + b, 0);

  const handleSubmitTally = () => {
    soundEngine.playClick();

    let maxVotes = -1;
    let topPlayerIds: string[] = [];

    players.forEach((p) => {
      const count = votes[p.id] || 0;
      if (count > maxVotes) {
        maxVotes = count;
        topPlayerIds = [p.id];
      } else if (count === maxVotes && count > 0) {
        topPlayerIds.push(p.id);
      }
    });

    if (topPlayerIds.length === 1) {
      onAccusationComplete(topPlayerIds[0], false);
    } else if (topPlayerIds.length > 1) {
      setTiedPlayerIds(topPlayerIds);
      setShowTieBreaker(true);
    } else {
      onAccusationComplete(players[0].id, false);
    }
  };

  const handleConfirmTieBreaker = () => {
    if (!selectedTieWinnerId) return;
    soundEngine.playClick();
    onAccusationComplete(selectedTieWinnerId, true);
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in">
      <div className="space-y-6 pt-2">
        {/* Header */}
        <div className="text-center space-y-2">
          <span className="px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
            Council Accusation Vote
          </span>
          <h2 className="text-2xl sm:text-3xl font-serif text-white font-normal">
            Point toward the suspected Spy!
          </h2>
          <p className="text-xs text-[#A6998A] font-sans">
            Point simultaneously! The scribe records the accusations made against each member.
          </p>
        </div>

        {/* Voting List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A6998A] px-1">
            <span>Recorded Accusations</span>
            <span className="text-[#D4AF37]">{totalVotesLogged} Accusations</span>
          </div>

          <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            {players.map((p) => {
              const count = votes[p.id] || 0;
              return (
                <div
                  key={p.id}
                  className="bg-[#0F0F0F] border border-white/10 p-3 rounded-2xl flex items-center justify-between shadow-sm"
                >
                  <div className="flex items-center space-x-3 font-serif">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <div className="font-semibold text-sm text-white">{p.name}</div>
                      {p.id === guesser.id && (
                        <span className="text-[9px] text-[#D4AF37] font-sans font-bold uppercase tracking-widest">
                          Exonerated Guesser
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 font-sans">
                    <button
                      onClick={() => handleDecrement(p.id)}
                      className="w-8 h-8 rounded-lg bg-[#070707] hover:bg-[#181818] border border-white/10 font-bold text-lg text-[#E0D7D0] flex items-center justify-center transition"
                    >
                      -
                    </button>

                    <span className="font-serif font-bold text-lg text-[#D4AF37] min-w-[24px] text-center">
                      {count}
                    </span>

                    <button
                      onClick={() => handleIncrement(p.id)}
                      className="w-8 h-8 rounded-lg bg-[#D4AF37] hover:brightness-110 font-bold text-lg text-black flex items-center justify-center transition shadow-md"
                    >
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="pt-4 pb-6">
        <button
          onClick={handleSubmitTally}
          disabled={totalVotesLogged === 0}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <Target className="w-5 h-5" />
          <span>SUBMIT ACCUSATIONS</span>
        </button>
      </div>

      {/* TIE-BREAKER MODAL */}
      {showTieBreaker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-fade-in">
          <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-md w-full p-6 space-y-6 text-center shadow-2xl gold-box-glow">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-2xl">
                ⚖️
              </div>
              <h3 className="text-2xl font-serif text-[#D4AF37]">Tie-Breaker Required!</h3>
              <p className="text-xs text-[#A6998A] font-sans">
                <span className="text-[#D4AF37] font-bold">{guesser.name}</span> (exonerated guesser) must break the deadlock between accused members.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-2.5 max-h-[35vh] overflow-y-auto p-1 font-sans">
              {tiedPlayerIds.map((pid) => {
                const p = players.find((pl) => pl.id === pid);
                if (!p) return null;
                const isSelected = selectedTieWinnerId === p.id;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedTieWinnerId(p.id)}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                      isSelected
                        ? 'bg-[#070707] border-[#D4AF37] text-[#D4AF37] gold-box-glow'
                        : 'bg-[#070707] border-white/10 text-[#E0D7D0] hover:bg-[#181818]'
                    }`}
                  >
                    <div className="flex items-center space-x-3 font-serif">
                      <span className="text-2xl">{p.avatar}</span>
                      <span className="font-semibold text-sm">{p.name}</span>
                    </div>

                    <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider">
                      Tied ({votes[p.id]} Accusations)
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={handleConfirmTieBreaker}
                disabled={!selectedTieWinnerId}
                className="w-full py-3.5 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg"
              >
                Confirm Tie-Breaker Selection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
