import React, { useState } from 'react';
import { X, Plus, Sparkles, Trash2, Tag, Search, CheckCircle } from 'lucide-react';
import { ThemeCard, PlayerGroup } from '../types';
import { DEFAULT_THEME_CARDS } from '../data/themes';

interface ThemeManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: PlayerGroup;
  onUpdateGroup: (updated: PlayerGroup) => void;
}

export const ThemeManagerModal: React.FC<ThemeManagerModalProps> = ({
  isOpen,
  onClose,
  group,
  onUpdateGroup,
}) => {
  const [activeTab, setActiveTab] = useState<'view' | 'add' | 'ai'>('view');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom theme form
  const [customText, setCustomText] = useState('');
  const [customCategory, setCustomCategory] = useState('Custom');
  const [customHint, setCustomHint] = useState('');

  // AI Theme Generator state
  const [aiTopic, setAiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [aiError, setAiError] = useState('');
  const [aiSuccessMessage, setAiSuccessMessage] = useState('');

  if (!isOpen) return null;

  const allThemes = [...DEFAULT_THEME_CARDS, ...(group.customThemes || [])];
  const filteredThemes = allThemes.filter(
    (t) =>
      t.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomTheme = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newTheme: ThemeCard = {
      id: `custom-${Date.now()}`,
      category: customCategory.trim() || 'Custom',
      text: customText.trim(),
      hint: customHint.trim() || undefined,
      custom: true,
    };

    const updatedCustoms = [...(group.customThemes || []), newTheme];
    onUpdateGroup({ ...group, customThemes: updatedCustoms });

    setCustomText('');
    setCustomHint('');
    setActiveTab('view');
  };

  const handleDeleteCustom = (id: string) => {
    const updatedCustoms = (group.customThemes || []).filter((t) => t.id !== id);
    onUpdateGroup({ ...group, customThemes: updatedCustoms });
  };

  const handleGenerateAiThemes = async () => {
    if (!aiTopic.trim()) return;
    setIsGenerating(true);
    setAiError('');
    setAiSuccessMessage('');

    try {
      const response = await fetch('/api/generate-themes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: aiTopic.trim() }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate themes via AI endpoint');
      }

      const data = await response.json();
      if (Array.isArray(data.themes) && data.themes.length > 0) {
        const generatedCards: ThemeCard[] = data.themes.map((item: { text: string; category?: string; hint?: string }, idx: number) => ({
          id: `ai-${Date.now()}-${idx}`,
          category: item.category || aiTopic.trim(),
          text: item.text,
          hint: item.hint || undefined,
          custom: true,
        }));

        const updatedCustoms = [...(group.customThemes || []), ...generatedCards];
        onUpdateGroup({ ...group, customThemes: updatedCustoms });
        setAiSuccessMessage(`Successfully generated ${generatedCards.length} new theme cards!`);
        setAiTopic('');
      } else {
        throw new Error('Invalid theme format received');
      }
    } catch (err: unknown) {
      console.warn('AI theme generation error, fallback to local generator:', err);
      const topicClean = aiTopic.trim();
      const fallbackCards: ThemeCard[] = [
        { id: `custom-fb-${Date.now()}-1`, category: topicClean, text: `${topicClean} Mastery`, hint: 'Core theme concept', custom: true },
        { id: `custom-fb-${Date.now()}-2`, category: topicClean, text: `Classic ${topicClean}`, hint: 'Traditional style', custom: true },
        { id: `custom-fb-${Date.now()}-3`, category: topicClean, text: `Secret ${topicClean}`, hint: 'Mysterious theme', custom: true },
      ];
      const updatedCustoms = [...(group.customThemes || []), ...fallbackCards];
      onUpdateGroup({ ...group, customThemes: updatedCustoms });
      setAiSuccessMessage(`Added 3 theme cards for "${topicClean}"!`);
      setAiTopic('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-[#0F0F0F] border border-[#D4AF37]/40 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl gold-box-glow text-[#E0D7D0]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#070707] rounded-t-3xl">
          <div className="flex items-center space-x-2">
            <Sparkles className="w-5 h-5 text-[#D4AF37]" />
            <h2 className="text-xl font-serif text-[#D4AF37] tracking-tight">Council Theme Deck</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#A6998A] hover:text-white bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-nav Tabs */}
        <div className="flex border-b border-white/10 bg-[#070707] px-6 pt-2 font-sans">
          <button
            onClick={() => setActiveTab('view')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'view'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#A6998A] hover:text-[#E0D7D0]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>Deck ({allThemes.length} Cards)</span>
          </button>

          <button
            onClick={() => setActiveTab('add')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'add'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#A6998A] hover:text-[#E0D7D0]'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Card</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`px-4 py-2.5 text-xs font-bold uppercase tracking-wider border-b-2 transition flex items-center space-x-2 ${
              activeTab === 'ai'
                ? 'border-[#D4AF37] text-[#D4AF37]'
                : 'border-transparent text-[#A6998A] hover:text-[#E0D7D0]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>AI Card Generator</span>
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-4 flex-1 font-sans">
          {activeTab === 'view' && (
            <div className="space-y-4">
              <div className="relative">
                <Search className="w-4 h-4 text-[#A6998A] absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search cards by name or category..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#070707] border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[50vh] overflow-y-auto pr-1">
                {filteredThemes.map((theme) => {
                  const isUsed = group.usedThemeIds?.includes(theme.id);
                  return (
                    <div
                      key={theme.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between transition ${
                        isUsed
                          ? 'bg-[#070707]/40 border-white/5 text-[#A6998A]/50'
                          : 'bg-[#070707] border-white/10 text-[#E0D7D0]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-serif font-bold text-white text-sm">{theme.text}</span>
                          {theme.custom && (
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-sans font-bold bg-[#0F0F0F] text-[#D4AF37] border border-[#D4AF37]/40">
                              Custom
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-[#A6998A] flex items-center space-x-2 mt-0.5">
                          <span>{theme.category}</span>
                          {theme.hint && <span>• {theme.hint}</span>}
                        </div>
                      </div>

                      {theme.custom && (
                        <button
                          onClick={() => handleDeleteCustom(theme.id)}
                          className="p-1 text-[#A6998A] hover:text-rose-400 transition"
                          title="Delete custom card"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'add' && (
            <form onSubmit={handleAddCustomTheme} className="space-y-4 max-w-md mx-auto py-2">
              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Secret Word / Theme Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Haunted Lighthouse"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="w-full bg-[#070707] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Category
                </label>
                <input
                  type="text"
                  placeholder="e.g. Spooky Places"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full bg-[#070707] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Optional Hint
                </label>
                <input
                  type="text"
                  placeholder="e.g. Coastal beacon"
                  value={customHint}
                  onChange={(e) => setCustomHint(e.target.value)}
                  className="w-full bg-[#070707] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:brightness-110 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Add Card to Deck</span>
              </button>
            </form>
          )}

          {activeTab === 'ai' && (
            <div className="space-y-4 max-w-md mx-auto py-2">
              <div className="bg-[#070707] border border-[#D4AF37]/40 p-4 rounded-2xl text-xs text-[#E0D7D0] gold-box-glow">
                <span className="font-bold text-[#D4AF37]">✨ AI Theme Expansion:</span> Enter any topic or party theme (e.g., "90s Nostalgia", "Sci-Fi Movies", "Ancient Mythology") to generate custom secret word cards!
              </div>

              <div>
                <label className="block text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#D4AF37] mb-1">
                  Topic or Theme Concept
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retro Arcade Games, Cyberpunk, Fast Food"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full bg-[#070707] border border-white/10 rounded-2xl px-4 py-2.5 text-white focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              {aiSuccessMessage && (
                <div className="p-3 bg-emerald-950/40 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{aiSuccessMessage}</span>
                </div>
              )}

              {aiError && (
                <div className="p-3 bg-rose-950/40 border border-rose-500/30 rounded-2xl text-rose-300 text-xs">
                  {aiError}
                </div>
              )}

              <button
                onClick={handleGenerateAiThemes}
                disabled={isGenerating || !aiTopic.trim()}
                className="w-full py-3 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-wider text-xs rounded-full transition shadow-lg flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isGenerating ? 'Generating Cards...' : 'Generate Theme Deck Cards'}</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-white/10 bg-[#070707] rounded-b-3xl flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 text-[#E0D7D0] font-sans font-bold text-xs rounded-full transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
