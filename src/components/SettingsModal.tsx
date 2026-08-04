import React from 'react';
import { X, Volume2, Mic, Smartphone, Percent, Clock } from 'lucide-react';
import { GameSettings, PlayerGroup } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: GameSettings;
  onUpdateSettings: (newSettings: GameSettings) => void;
  group: PlayerGroup;
  onUpdateGroup: (newGroup: PlayerGroup) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  group,
  onUpdateGroup,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-lg w-full flex flex-col shadow-2xl gold-box-glow text-[#E0D7D0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070707] rounded-t-3xl">
          <h2 className="text-xl font-serif text-[#D4AF37] tracking-tight flex items-center space-x-2">
            <span>⚙️</span>
            <span>Council Configuration</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A6998A] hover:text-white bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 text-sm font-sans">
          {/* Audio & Haptics */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Audio & Sensory Feedback</h3>
            
            <div className="flex items-center justify-between p-3.5 bg-[#070707] rounded-2xl border border-white/10">
              <div className="flex items-center space-x-3">
                <Volume2 className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="font-semibold text-white">Chimes & Fanfares</div>
                  <div className="text-xs text-[#A6998A]">Acoustic feedback for votes and timer</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, soundEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#070707] rounded-2xl border border-white/10">
              <div className="flex items-center space-x-3">
                <Mic className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="font-semibold text-white">Voice Synthesizer (TTS)</div>
                  <div className="text-xs text-[#A6998A]">Announce "Affirmative" and "Negative" aloud</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.ttsEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, ttsEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
              />
            </div>

            <div className="flex items-center justify-between p-3.5 bg-[#070707] rounded-2xl border border-white/10">
              <div className="flex items-center space-x-3">
                <Smartphone className="w-5 h-5 text-[#D4AF37]" />
                <div>
                  <div className="font-semibold text-white">Tactile Vibration</div>
                  <div className="text-xs text-[#A6998A]">Buzz on secret unmasking and warnings</div>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.vibrationEnabled}
                onChange={(e) => onUpdateSettings({ ...settings, vibrationEnabled: e.target.checked })}
                className="w-5 h-5 accent-[#D4AF37] rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Game Balancing Options */}
          <div className="space-y-4">
            <h3 className="text-[10px] font-sans font-bold uppercase tracking-[0.25em] text-[#D4AF37]">Council Laws & Balancing</h3>

            <div className="p-3.5 bg-[#070707] rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Percent className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="font-semibold text-white">"No Spy" Variant Probability</div>
                    <div className="text-xs text-[#A6998A]">Likelihood a round has zero spies</div>
                  </div>
                </div>
                <span className="font-serif font-bold text-[#D4AF37]">
                  {Math.round((group.noSpyVariantChance || 0.1) * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[0, 0.1, 0.2, 0.3].map((val) => (
                  <button
                    key={val}
                    onClick={() => onUpdateGroup({ ...group, noSpyVariantChance: val })}
                    className={`py-1.5 rounded-full text-xs font-sans font-bold border transition ${
                      group.noSpyVariantChance === val
                        ? 'bg-[#0F0F0F] text-[#D4AF37] border-[#D4AF37]'
                        : 'bg-[#0F0F0F] text-[#A6998A] border-white/10 hover:bg-[#181818]'
                    }`}
                  >
                    {val === 0 ? 'Off (0%)' : `${Math.round(val * 100)}%`}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-3.5 bg-[#070707] rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="w-5 h-5 text-[#D4AF37]" />
                  <div>
                    <div className="font-semibold text-white">Interrogation Time Per Member</div>
                    <div className="text-xs text-[#A6998A]">
                      Total duration = ({group.players.length} members × {group.qaTimePerPlayerSec || 30}s) ={' '}
                      {Math.round((group.players.length * (group.qaTimePerPlayerSec || 30)) / 60 * 10) / 10}m
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[20, 30, 45].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => onUpdateGroup({ ...group, qaTimePerPlayerSec: sec })}
                    className={`py-1.5 rounded-full text-xs font-sans font-bold border transition ${
                      (group.qaTimePerPlayerSec || 30) === sec
                        ? 'bg-[#0F0F0F] text-[#D4AF37] border-[#D4AF37]'
                        : 'bg-[#0F0F0F] text-[#A6998A] border-white/10 hover:bg-[#181818]'
                    }`}
                  >
                    {sec}s / member
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#070707] rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg"
          >
            Save & Close
          </button>
        </div>
      </div>
    </div>
  );
};
