import React, { useState } from 'react';
import { ArrowLeft, Plus, Trash2, ArrowUp, ArrowDown, Shuffle, Check } from 'lucide-react';
import { Player, PlayerGroup } from '../types';
import { AVATAR_OPTIONS, PLAYER_COLORS } from '../data/themes';

interface PlayerSetupProps {
  group: PlayerGroup;
  onSaveGroup: (group: PlayerGroup) => void;
  onBack: () => void;
}

export const PlayerSetup: React.FC<PlayerSetupProps> = ({ group, onSaveGroup, onBack }) => {
  const [players, setPlayers] = useState<Player[]>(group.players);
  const [newPlayerName, setNewPlayerName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(AVATAR_OPTIONS[0]);

  const handleAddPlayer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlayerName.trim()) return;
    if (players.length >= 8) return;

    const newPlayer: Player = {
      id: `p-${Date.now()}`,
      name: newPlayerName.trim(),
      avatar: selectedAvatar,
      color: PLAYER_COLORS[players.length % PLAYER_COLORS.length],
    };

    const updated = [...players, newPlayer];
    setPlayers(updated);
    setNewPlayerName('');
    const nextAvatarIdx = (AVATAR_OPTIONS.indexOf(selectedAvatar) + 1) % AVATAR_OPTIONS.length;
    setSelectedAvatar(AVATAR_OPTIONS[nextAvatarIdx]);
  };

  const handleRemovePlayer = (id: string) => {
    if (players.length <= 4) return;
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleMovePlayer = (index: number, direction: 'up' | 'down') => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= players.length) return;

    const copy = [...players];
    const temp = copy[index];
    copy[index] = copy[newIdx];
    copy[newIdx] = temp;
    setPlayers(copy);
  };

  const handleShuffleOrder = () => {
    const copy = [...players];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setPlayers(copy);
  };

  const handleSave = () => {
    if (players.length < 4) return;

    const newTurnOrder = players.map((p) => p.id);
    const existingStats = { ...group.stats };

    players.forEach((p) => {
      if (!existingStats[p.id]) {
        existingStats[p.id] = {
          gamesPlayed: 0,
          spyWins: 0,
          townsfolkWins: 0,
          coopWins: 0,
          correctGuesses: 0,
          timesAccused: 0,
          timesMagistrate: 0,
        };
      }
    });

    onSaveGroup({
      ...group,
      players,
      turnOrder: newTurnOrder,
      magistrateRotationIndex: 0,
      stats: existingStats,
    });

    onBack();
  };

  return (
    <div className="flex-1 max-w-xl w-full mx-auto p-4 sm:p-6 flex flex-col justify-between text-[#E0D7D0] animate-fade-in">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="px-3 py-1.5 bg-[#0F0F0F] hover:bg-[#181818] border border-white/10 text-[#E0D7D0] rounded-full transition flex items-center space-x-1.5 text-xs font-sans font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          <h2 className="text-xl font-serif text-[#D4AF37]">Council Roster (4–8)</h2>

          <button
            onClick={handleShuffleOrder}
            className="px-3 py-1.5 bg-[#0F0F0F] hover:bg-[#181818] border border-[#D4AF37]/30 text-[#D4AF37] rounded-full transition flex items-center space-x-1.5 text-xs font-sans font-bold uppercase tracking-wider"
            title="Randomize Turn Order"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span>Shuffle</span>
          </button>
        </div>

        {/* Add Player Form */}
        {players.length < 8 ? (
          <form onSubmit={handleAddPlayer} className="bg-[#0F0F0F] border border-white/10 p-4 rounded-2xl space-y-3 shadow-lg">
            <div className="text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A6998A]">Add New Member</div>

            <div className="flex items-center space-x-2">
              <select
                value={selectedAvatar}
                onChange={(e) => setSelectedAvatar(e.target.value)}
                className="bg-[#070707] border border-white/10 text-2xl p-2 rounded-xl focus:outline-none focus:border-[#D4AF37]"
              >
                {AVATAR_OPTIONS.map((av) => (
                  <option key={av} value={av}>
                    {av}
                  </option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Player Name..."
                value={newPlayerName}
                onChange={(e) => setNewPlayerName(e.target.value)}
                className="flex-1 bg-[#070707] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#D4AF37] font-sans"
              />

              <button
                type="submit"
                className="p-2.5 bg-[#D4AF37] hover:brightness-110 text-black rounded-xl transition shadow-md font-bold"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3 bg-[#0F0F0F] border border-[#D4AF37]/30 rounded-xl text-xs text-[#D4AF37] text-center font-sans font-semibold">
            Maximum 8 players reached.
          </div>
        )}

        {/* Current Roster List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-[10px] font-sans font-bold uppercase tracking-[0.2em] text-[#A6998A] px-1">
            <span>Turn Order / Magistrate Rotation</span>
            <span>{players.length} / 8 Players</span>
          </div>

          <div className="space-y-2 max-h-[45vh] overflow-y-auto pr-1">
            {players.map((p, idx) => (
              <div
                key={p.id}
                className="bg-[#0F0F0F] border border-white/10 p-3 rounded-xl flex items-center justify-between shadow-sm"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-xs font-mono font-bold text-[#A6998A] w-4">{idx + 1}.</span>
                  <div className="w-9 h-9 rounded-full bg-[#070707] border border-white/10 flex items-center justify-center text-lg">
                    {p.avatar}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-white font-sans">{p.name}</div>
                    {idx === 0 && (
                      <span className="text-[9px] text-[#D4AF37] font-sans font-extrabold uppercase tracking-widest">
                        1st Magistrate
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleMovePlayer(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 bg-[#070707] hover:bg-[#181818] disabled:opacity-30 text-[#E0D7D0] border border-white/10 rounded-lg transition"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleMovePlayer(idx, 'down')}
                    disabled={idx === players.length - 1}
                    className="p-1.5 bg-[#070707] hover:bg-[#181818] disabled:opacity-30 text-[#E0D7D0] border border-white/10 rounded-lg transition"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleRemovePlayer(p.id)}
                    disabled={players.length <= 4}
                    className="p-1.5 bg-[#070707] hover:bg-[#8B0000]/40 border border-white/10 disabled:opacity-30 text-[#A6998A] hover:text-rose-300 rounded-lg transition ml-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 pb-4">
        <button
          onClick={handleSave}
          disabled={players.length < 4}
          className="w-full py-4 bg-[#D4AF37] hover:brightness-110 disabled:opacity-50 text-black font-sans font-bold uppercase tracking-[0.15em] text-sm rounded-full transition shadow-xl flex items-center justify-center space-x-2"
        >
          <Check className="w-5 h-5" />
          <span>SAVE ROSTER ({players.length} PLAYERS)</span>
        </button>
      </div>
    </div>
  );
};
