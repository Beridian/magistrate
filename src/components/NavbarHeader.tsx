import React from 'react';
import { Volume2, VolumeX, BookOpen, Settings as SettingsIcon, Sparkles } from 'lucide-react';
import { GameSettings } from '../types';
import { soundEngine } from '../utils/audio';

interface NavbarHeaderProps {
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  onOpenRules: () => void;
  onOpenSettings: () => void;
  onOpenThemeManager: () => void;
  currentPhaseName?: string;
}

export const NavbarHeader: React.FC<NavbarHeaderProps> = ({
  settings,
  onUpdateSettings,
  onOpenRules,
  onOpenSettings,
  onOpenThemeManager,
  currentPhaseName,
}) => {
  const toggleSound = () => {
    const updated = { ...settings, soundEnabled: !settings.soundEnabled };
    onUpdateSettings(updated);
    soundEngine.setSoundEnabled(updated.soundEnabled);
    soundEngine.playClick();
  };

  return (
    <header className="w-full bg-[#070707]/95 backdrop-blur border-b border-white/10 text-[#E0D7D0] px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-xl z-30">
      <div className="flex items-center space-x-3">
        <div className="w-9 h-9 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 flex items-center justify-center font-bold text-lg shadow-md text-[#D4AF37]">
          🕵️
        </div>
        <div>
          <h1 className="font-serif text-lg sm:text-xl font-normal tracking-tight text-[#D4AF37] leading-none">
            Spy Hunt
          </h1>
          {currentPhaseName && (
            <span className="text-[10px] text-[#A6998A] font-sans uppercase tracking-[0.2em] font-bold block mt-1">
              {currentPhaseName}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onOpenThemeManager}
          className="px-3 py-1.5 rounded-full bg-[#0F0F0F] hover:bg-[#181818] text-[#D4AF37] transition text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 shadow-sm"
          title="Themes Deck & AI Generator"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span className="hidden sm:inline">Themes</span>
        </button>

        <button
          onClick={onOpenRules}
          className="px-3 py-1.5 rounded-full bg-[#0F0F0F] hover:bg-[#181818] text-[#A6998A] hover:text-[#E0D7D0] transition text-xs font-sans font-bold uppercase tracking-wider flex items-center space-x-1.5 border border-white/10 hover:border-white/20"
          title="Game Rules"
        >
          <BookOpen className="w-3.5 h-3.5 text-[#A6998A]" />
          <span className="hidden sm:inline">Rules</span>
        </button>

        <button
          onClick={toggleSound}
          className={`p-2 rounded-full transition border ${
            settings.soundEnabled
              ? 'bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/40'
              : 'bg-[#0F0F0F] text-[#A6998A]/60 border-white/10'
          }`}
          title={settings.soundEnabled ? 'Mute Audio' : 'Unmute Audio'}
        >
          {settings.soundEnabled ? (
            <Volume2 className="w-4 h-4 text-[#D4AF37]" />
          ) : (
            <VolumeX className="w-4 h-4 text-[#A6998A]" />
          )}
        </button>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-full bg-[#0F0F0F] hover:bg-[#181818] text-[#A6998A] hover:text-[#E0D7D0] transition border border-white/10 hover:border-white/20"
          title="Settings"
        >
          <SettingsIcon className="w-4 h-4 text-[#A6998A]" />
        </button>
      </div>
    </header>
  );
};
