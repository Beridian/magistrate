import React from 'react';
import { Play, Users, Home, Award, RefreshCw } from 'lucide-react';
import { PlayerGroup, GameSession } from '../types';

interface PostGameSummaryProps {
  group: PlayerGroup;
  lastSession: GameSession;
  onNextRound: () => void;
  onNewGroup: () => void;
  onMainMenu: () => void;
}

export const PostGameSummary: React.FC<PostGameSummaryProps> = ({
  group,
  lastSession,
  onNextRound,
  onNewGroup,
  onMainMenu,
}) => {
  const nextMagistrateIndex = (group.magistrateRotationIndex + 1) % group.turnOrder.length;
  const nextMagistrateId = group.turnOrder[nextMagistrateIndex];
  const nextMagistrate = group.players.find((p) => p.id === nextMagistrateId) || group.players[0];

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in">
      <div className="space-y-6 pt-2">
        {/* Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center space-x-1 px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
            <Award className="w-3.5 h-3.5" />
            <span>Council Leaderboard</span>
          </div>
          <h2 className="text-2xl font-serif text-white">Session Standings</h2>
        </div>

        {/* Next Magistrate Banner */}
        <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 p-3.5 rounded-2xl flex items-center justify-between shadow-lg gold-box-glow">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-xl">
              {nextMagistrate.avatar}
            </div>
            <div>
              <div className="text-[9px] uppercase font-sans font-bold text-[#D4AF37] tracking-widest">Next Presiding Magistrate</div>
              <div className="font-serif text-white text-sm">{nextMagistrate.name}</div>
            </div>
          </div>

          <div className="text-xs text-[#A6998A] font-sans flex items-center space-x-1">
            <RefreshCw className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Auto-rotates</span>
          </div>
        </div>

        {/* Player Stats Table */}
        <div className="space-y-2">
          <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A6998A] px-1">
            Council Scorecard
          </div>

          <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1 font-sans">
            {group.players.map((p) => {
              const st = group.stats[p.id] || {
                gamesPlayed: 0,
                spyWins: 0,
                townsfolkWins: 0,
                coopWins: 0,
                correctGuesses: 0,
                timesAccused: 0,
                timesMagistrate: 0,
              };

              const totalWins = st.spyWins + st.townsfolkWins + st.coopWins;

              return (
                <div
                  key={p.id}
                  className="bg-[#0F0F0F] border border-white/10 p-3 rounded-2xl flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{p.avatar}</span>
                    <div>
                      <div className="font-serif font-semibold text-sm text-white">{p.name}</div>
                      <div className="text-[11px] text-[#A6998A] flex items-center space-x-2">
                        <span>🕵️ Spy Wins: {st.spyWins}</span>
                        <span>•</span>
                        <span>Correct Guesses: {st.correctGuesses}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-serif font-bold text-[#D4AF37]">{totalWins} Wins</div>
                    <div className="text-[10px] text-[#A6998A]">{st.gamesPlayed} Games</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer Navigation Buttons */}
      <div className="space-y-2.5 pt-4 pb-6">
        <button
          onClick={onNextRound}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <Play className="w-4 h-4 fill-current" />
          <span>NEXT ROUND ({nextMagistrate.name} AS MAGISTRATE)</span>
        </button>

        <div className="grid grid-cols-2 gap-2.5">
          <button
            onClick={onNewGroup}
            className="py-3 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 text-[#E0D7D0] font-sans font-bold uppercase tracking-wider rounded-full transition text-xs flex items-center justify-center space-x-1.5"
          >
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Edit Roster</span>
          </button>

          <button
            onClick={onMainMenu}
            className="py-3 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 text-[#E0D7D0] font-sans font-bold uppercase tracking-wider rounded-full transition text-xs flex items-center justify-center space-x-1.5"
          >
            <Home className="w-4 h-4 text-[#D4AF37]" />
            <span>Main Menu</span>
          </button>
        </div>
      </div>
    </div>
  );
};
