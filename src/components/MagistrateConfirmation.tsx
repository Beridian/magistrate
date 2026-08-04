import React, { useState } from 'react';
import { Shield, ArrowRight, RotateCw, CheckCircle2, Edit3, Key, Lock, Eye, EyeOff } from 'lucide-react';
import { Player, GameSession, ThemeCard } from '../types';
import { soundEngine } from '../utils/audio';

interface MagistrateConfirmationProps {
  magistrate: Player;
  session: GameSession;
  onConfirm: (selectedTheme: ThemeCard) => void;
  onSkipMagistrate: () => void;
}

export const MagistrateConfirmation: React.FC<MagistrateConfirmationProps> = ({
  magistrate,
  session,
  onConfirm,
  onSkipMagistrate,
}) => {
  const candidateA = session.candidateThemes?.[0] || session.selectedTheme;
  const candidateB = session.candidateThemes?.[1] || {
    id: 'cand-fallback-b',
    category: 'General Knowledge',
    text: 'Ancient Pyramid',
  };

  // Selection mode: 'optionA' | 'optionB' | 'custom'
  const [selectionMode, setSelectionMode] = useState<'optionA' | 'optionB' | 'custom'>('optionA');
  const [customWord, setCustomWord] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [isWordVisible, setIsWordVisible] = useState(true);

  const handleProceed = () => {
    soundEngine.playClick();
    let chosenTheme: ThemeCard;

    if (selectionMode === 'optionA') {
      chosenTheme = candidateA;
    } else if (selectionMode === 'optionB') {
      chosenTheme = candidateB;
    } else {
      const trimmedWord = customWord.trim();
      const finalWord = trimmedWord || 'Secret Mystery';
      const finalCategory = customCategory.trim() || 'Magistrate Secret';
      chosenTheme = {
        id: `custom-magistrate-${Date.now()}`,
        category: finalCategory,
        text: finalWord,
        custom: true,
      };
    }

    onConfirm(chosenTheme);
  };

  const getActiveChosenText = (): string => {
    if (selectionMode === 'optionA') return candidateA.text;
    if (selectionMode === 'optionB') return candidateB.text;
    return customWord.trim() || 'Custom Word...';
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in text-center">
      <div className="space-y-4 pt-2">
        {/* Header Badge */}
        <div className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-[#0F0F0F] border border-[#D4AF37]/40 text-[#D4AF37] font-sans font-bold text-[10px] uppercase tracking-[0.3em]">
          <Shield className="w-3.5 h-3.5 mr-2" />
          <span>Presiding Magistrate Selection</span>
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-serif text-[#D4AF37] tracking-tight font-normal">
            Magistrate {magistrate.name}
          </h2>
          <p className="text-xs text-[#A6998A] font-sans max-w-md mx-auto">
            Choose or craft the Secret Word for this round. Only you and the Spy will know this decree!
          </p>
        </div>

        {/* Magistrate Identity Header */}
        <div className="bg-[#0F0F0F] border border-white/10 p-3 rounded-2xl flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-[#070707] border border-[#D4AF37] flex items-center justify-center text-xl shadow-md">
              {magistrate.avatar}
            </div>
            <div className="text-left">
              <div className="text-xs font-serif font-semibold text-white">{magistrate.name}</div>
              <div className="text-[10px] text-[#D4AF37] font-sans uppercase tracking-widest font-bold">
                Presiding Magistrate
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsWordVisible(!isWordVisible)}
            className="px-3 py-1.5 bg-[#070707] hover:bg-[#181818] border border-white/10 rounded-full text-[11px] text-[#A6998A] flex items-center space-x-1.5 transition font-sans"
          >
            {isWordVisible ? <EyeOff className="w-3.5 h-3.5 text-[#D4AF37]" /> : <Eye className="w-3.5 h-3.5 text-[#D4AF37]" />}
            <span>{isWordVisible ? 'Hide Choices' : 'Show Choices'}</span>
          </button>
        </div>

        {/* Secret Word Choice Cards */}
        {isWordVisible ? (
          <div className="space-y-2.5 text-left font-sans">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] px-1">
              Select Secret Word Option:
            </div>

            {/* Candidate Option A */}
            <div
              onClick={() => {
                soundEngine.playClick();
                setSelectionMode('optionA');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectionMode === 'optionA'
                  ? 'bg-[#0F0F0F] border-[#D4AF37] gold-box-glow text-white'
                  : 'bg-[#070707] border-white/10 text-[#A6998A] hover:bg-[#0F0F0F]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#070707] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    Option 1
                  </span>
                  <span className="text-xs text-[#A6998A]">{candidateA.category}</span>
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-white pt-1">{candidateA.text}</div>
                {candidateA.hint && <div className="text-[11px] text-[#A6998A] italic">Hint: {candidateA.hint}</div>}
              </div>

              <div className="ml-3 shrink-0">
                {selectionMode === 'optionA' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20" />
                )}
              </div>
            </div>

            {/* Candidate Option B */}
            <div
              onClick={() => {
                soundEngine.playClick();
                setSelectionMode('optionB');
              }}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                selectionMode === 'optionB'
                  ? 'bg-[#0F0F0F] border-[#D4AF37] gold-box-glow text-white'
                  : 'bg-[#070707] border-white/10 text-[#A6998A] hover:bg-[#0F0F0F]'
              }`}
            >
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#070707] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    Option 2
                  </span>
                  <span className="text-xs text-[#A6998A]">{candidateB.category}</span>
                </div>
                <div className="text-base sm:text-lg font-serif font-bold text-white pt-1">{candidateB.text}</div>
                {candidateB.hint && <div className="text-[11px] text-[#A6998A] italic">Hint: {candidateB.hint}</div>}
              </div>

              <div className="ml-3 shrink-0">
                {selectionMode === 'optionB' ? (
                  <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                ) : (
                  <div className="w-5 h-5 rounded-full border border-white/20" />
                )}
              </div>
            </div>

            {/* Custom Secret Word Option */}
            <div
              onClick={() => {
                if (selectionMode !== 'custom') {
                  soundEngine.playClick();
                  setSelectionMode('custom');
                }
              }}
              className={`p-3.5 rounded-2xl border transition-all ${
                selectionMode === 'custom'
                  ? 'bg-[#0F0F0F] border-[#D4AF37] gold-box-glow'
                  : 'bg-[#070707] border-white/10 text-[#A6998A] hover:bg-[#0F0F0F]'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#D4AF37] bg-[#070707] px-2 py-0.5 rounded-full border border-[#D4AF37]/30 flex items-center space-x-1">
                    <Edit3 className="w-3 h-3" />
                    <span>Custom Word</span>
                  </span>
                </div>

                <div className="shrink-0">
                  {selectionMode === 'custom' ? (
                    <CheckCircle2 className="w-6 h-6 text-[#D4AF37]" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border border-white/20" />
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-1">
                <input
                  type="text"
                  placeholder="Enter custom secret word..."
                  value={customWord}
                  onFocus={() => setSelectionMode('custom')}
                  onChange={(e) => {
                    setCustomWord(e.target.value);
                    setSelectionMode('custom');
                  }}
                  className="w-full bg-[#070707] border border-white/10 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
                <input
                  type="text"
                  placeholder="Optional Category (e.g. Movies, Food)"
                  value={customCategory}
                  onFocus={() => setSelectionMode('custom')}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    setSelectionMode('custom');
                  }}
                  className="w-full bg-[#070707] border border-white/10 rounded-xl px-3.5 py-1.5 text-xs text-[#A6998A] focus:outline-none focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-[#0F0F0F] border border-white/10 p-8 rounded-2xl text-center space-y-3 font-sans my-4">
            <Lock className="w-10 h-10 mx-auto text-[#D4AF37]" />
            <div className="text-sm font-serif text-white">Secret Word Options Concealed</div>
            <p className="text-xs text-[#A6998A]">
              Tap 'Show Choices' above when other council members are looking away.
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="space-y-2.5 pt-4 pb-6">
        <button
          onClick={handleProceed}
          disabled={selectionMode === 'custom' && !customWord.trim()}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <Key className="w-4 h-4 fill-current" />
          <span>LOCK IN SECRET WORD ({getActiveChosenText()})</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onSkipMagistrate}
          className="w-full py-2.5 bg-[#0F0F0F] hover:bg-[#181818] text-[#A6998A] hover:text-[#E0D7D0] text-xs font-sans font-bold uppercase tracking-wider rounded-full border border-white/10 transition flex items-center justify-center space-x-2"
        >
          <RotateCw className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>Pass Magistrate Role to Next Player</span>
        </button>
      </div>
    </div>
  );
};

