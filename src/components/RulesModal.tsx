import React from 'react';
import { X, ShieldAlert, Eye, HelpCircle, Award, Sparkles } from 'lucide-react';

interface RulesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RulesModal: React.FC<RulesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl gold-box-glow text-[#E0D7D0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070707] rounded-t-3xl">
          <div className="flex items-center space-x-3 font-serif">
            <span className="text-2xl">📖</span>
            <h2 className="text-xl sm:text-2xl font-serif text-[#D4AF37] tracking-tight">Council Rules & Laws</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A6998A] hover:text-white bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed font-sans">
          {/* Roles Overview */}
          <section className="bg-[#070707] p-4 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-serif font-semibold text-base text-[#D4AF37] flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-[#D4AF37]" />
              <span>1. Roles & Objectives</span>
            </h3>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li className="flex items-start space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F0F0F] text-[#D4AF37] border border-[#D4AF37]/40 shrink-0 mt-0.5 tracking-wider uppercase">
                  Magistrate
                </span>
                <span>
                  <strong className="text-white font-serif">Public Leader.</strong> Known to all. Holds the Secret Word. Conducts the Interrogation phase and responds with Affirmative, Negative, or Unclear.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F0F0F] text-rose-300 border border-[#8B0000] shrink-0 mt-0.5 tracking-wider uppercase">
                  The Spy
                </span>
                <span>
                  <strong className="text-white font-serif">Clandestine Impostor.</strong> ALSO holds the Secret Word! Objective: blend seamlessly during questioning or mislead the council toward an innocent target.
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#0F0F0F] text-emerald-300 border border-emerald-500/40 shrink-0 mt-0.5 tracking-wider uppercase">
                  Townsfolk
                </span>
                <span>
                  <strong className="text-white font-serif">Innocent Members.</strong> Unaware of the Secret Word. Objective: ask perceptive questions to discover the word and expose the Spy.
                </span>
              </li>
            </ul>
          </section>

          {/* Pass & Peek Lap */}
          <section className="bg-[#070707] p-4 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-serif font-semibold text-base text-[#D4AF37] flex items-center space-x-2">
              <Eye className="w-4 h-4 text-[#D4AF37]" />
              <span>2. Secret Decree Unveiling</span>
            </h3>
            <p className="text-[#A6998A] text-xs sm:text-sm">
              Pass the device player by player. When received, confirm your identity and press & hold <strong className="text-white">"Hold to Reveal"</strong> with your thumb. Releasing instantly conceals your role.
            </p>
          </section>

          {/* Q&A Timer */}
          <section className="bg-[#070707] p-4 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-serif font-semibold text-base text-[#D4AF37] flex items-center space-x-2">
              <HelpCircle className="w-4 h-4 text-[#D4AF37]" />
              <span>3. Interrogation Phase</span>
            </h3>
            <p className="text-[#A6998A] text-xs sm:text-sm">
              Place the device flat on the table. The countdown is public. Members direct Yes/No inquiries to the Magistrate to uncover the secret word.
            </p>
            <p className="text-[#A6998A] text-xs sm:text-sm">
              When a player speaks the correct word, the Magistrate taps <strong className="text-[#D4AF37]">"Secret Word Guessed!"</strong> to halt the timer.
            </p>
          </section>

          {/* Rare No Spy Variant */}
          <section className="bg-[#070707] border border-[#D4AF37]/40 p-4 rounded-2xl space-y-2 gold-box-glow">
            <h3 className="font-serif font-semibold text-base text-[#D4AF37] flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>4. Rare "No Spy" Cooperative Twist</span>
            </h3>
            <p className="text-[#E0D7D0] text-xs sm:text-sm">
              Occasionally (~10% probability), the council has <strong className="text-[#D4AF37]">NO SPY AT ALL</strong>! If the secret word is guessed before time expires, all members share in cooperative triumph!
            </p>
          </section>

          {/* Voting Phases */}
          <section className="bg-[#070707] p-4 rounded-2xl border border-white/10 space-y-3">
            <h3 className="font-serif font-semibold text-base text-[#D4AF37] flex items-center space-x-2">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>5. Judgment & Accusation</span>
            </h3>
            <div className="space-y-2 text-xs sm:text-sm">
              <p>
                <strong className="text-white font-serif">Phase 5 (Judgment Vote):</strong> The council votes on whether the Guesser guessed because they were the Spy holding the word!
              </p>
              <ul className="list-disc pl-5 space-y-1 text-[#A6998A]">
                <li>If majority votes <strong className="text-rose-300">YES</strong> & Guesser WAS the Spy → <strong className="text-[#D4AF37]">Townsfolk Win!</strong></li>
                <li>If majority votes <strong className="text-rose-300">YES</strong> & Guesser WAS Innocent → <strong className="text-rose-300">Spy Wins!</strong></li>
                <li>If majority votes <strong className="text-emerald-300">NO</strong> → Proceed to Phase 6!</li>
              </ul>
              <p className="pt-2">
                <strong className="text-white font-serif">Phase 6 (Accusation Vote):</strong> All members point toward their primary suspect. The scribe logs the tally on screen. Unmasking the true Spy grants victory to Townsfolk!
              </p>
            </div>
          </section>
        </div>

        <div className="p-4 border-t border-white/10 bg-[#070707] rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg"
          >
            I Understand the Laws
          </button>
        </div>
      </div>
    </div>
  );
};
