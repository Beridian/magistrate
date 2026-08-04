import React from 'react';
import { Play, Users, Award, Sparkles, ChevronRight, ShieldCheck, RefreshCw } from 'lucide-react';
import { PlayerGroup } from '../types';

interface MainMenuProps {
  group: PlayerGroup;
  onStartGame: () => void;
  onOpenPlayerSetup: () => void;
  onOpenRules: () => void;
  onOpenThemeManager: () => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  group,
  onStartGame,
  onOpenPlayerSetup,
  onOpenRules,
  onOpenThemeManager,
}) => {
  // Find upcoming Magistrate
  const upcomingMagistrateId = group.turnOrder[group.magistrateRotationIndex % group.turnOrder.length];
  const upcomingMagistrate = group.players.find((p) => p.id === upcomingMagistrateId) || group.players[0];

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in">
      {/* Title & Branding */}
      <div className="text-center space-y-3 pt-4 sm:pt-8">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#0F0F0F] border-2 border-[#D4AF37]/50 text-4xl mb-2 gold-box-glow animate-bounce-slow">
          🕵️
        </div>
        <span className="block text-[10px] uppercase tracking-[0.4em] text-[#A6998A] font-sans font-bold">
          Pass-and-Play Social Deduction
        </span>
        <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-[#D4AF37] gold-glow">
          SPY HUNT
        </h1>
        <p className="text-xs sm:text-sm text-[#A6998A] max-w-sm mx-auto font-sans leading-relaxed">
          The Masquerade Council awaits. Expose the hidden intruder or evade capture together on a single device.
        </p>
      </div>

      {/* Roster & Magistrate Preview Card */}
      <div className="bg-[#0F0F0F] border border-white/10 rounded-2xl p-5 space-y-4 shadow-2xl">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2 text-[#E0D7D0] font-sans font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4 text-[#D4AF37]" />
            <span>Council Roster ({group.players.length} Players)</span>
          </div>
          <button
            onClick={onOpenPlayerSetup}
            className="text-xs text-[#D4AF37] hover:text-[#f3d97f] font-sans font-bold uppercase tracking-wider flex items-center space-x-1 transition"
          >
            <span>Edit Roster</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Next Magistrate Banner */}
        <div className="bg-[#070707] border border-[#D4AF37]/30 p-4 rounded-xl flex items-center justify-between shadow-inner">
          <div className="flex items-center space-x-3.5">
            <div className="w-11 h-11 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/60 flex items-center justify-center text-2xl">
              {upcomingMagistrate.avatar}
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-[#A6998A] font-sans font-bold flex items-center space-x-1">
                <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
                <span>Presiding Magistrate</span>
              </div>
              <div className="font-serif text-lg text-white font-normal mt-0.5">{upcomingMagistrate.name}</div>
            </div>
          </div>
          <div className="text-[10px] text-[#A6998A] font-sans uppercase tracking-widest flex items-center space-x-1">
            <RefreshCw className="w-3 h-3 text-[#D4AF37]" />
            <span>Auto-Rotates</span>
          </div>
        </div>

        {/* Player Avatar Strip */}
        <div className="flex items-center justify-start space-x-2.5 overflow-x-auto py-1">
          {group.turnOrder.map((pid) => {
            const p = group.players.find((pl) => pl.id === pid);
            if (!p) return null;
            const isMag = pid === upcomingMagistrate.id;
            return (
              <div
                key={p.id}
                className={`flex flex-col items-center p-2.5 rounded-xl border min-w-[68px] transition ${
                  isMag
                    ? 'bg-[#D4AF37]/15 border-[#D4AF37]/60 text-[#D4AF37]'
                    : 'bg-[#070707] border-white/10 text-[#E0D7D0]'
                }`}
              >
                <span className="text-xl">{p.avatar}</span>
                <span className="text-[11px] font-sans font-bold truncate max-w-[58px] mt-1">{p.name}</span>
                {isMag && <span className="text-[8px] font-sans uppercase font-extrabold text-[#D4AF37] tracking-wider">MAG</span>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Action Buttons */}
      <div className="space-y-3 pt-4 pb-6">
        <button
          onClick={onStartGame}
          className="w-full py-4 rounded-full bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm transition shadow-lg flex items-center justify-center space-x-3 group"
        >
          <Play className="w-5 h-5 fill-current group-hover:scale-110 transition-transform" />
          <span>BEGIN COUNCIL SESSION</span>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenRules}
            className="py-3 px-4 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 hover:border-white/20 text-[#E0D7D0] font-sans font-bold uppercase tracking-wider rounded-full transition text-xs flex items-center justify-center space-x-2"
          >
            <Award className="w-4 h-4 text-[#D4AF37]" />
            <span>How to Play</span>
          </button>

          <button
            onClick={onOpenThemeManager}
            className="py-3 px-4 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 hover:border-white/20 text-[#E0D7D0] font-sans font-bold uppercase tracking-wider rounded-full transition text-xs flex items-center justify-center space-x-2"
          >
            <Sparkles className="w-4 h-4 text-[#D4AF37]" />
            <span>Themes Deck</span>
          </button>
        </div>
      </div>
    </div>
  );
};
