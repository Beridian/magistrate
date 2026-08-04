import { PlayerGroup, PlayerStats, GameSettings, ThemeCard } from '../types';
import { DEFAULT_THEME_CARDS, AVATAR_OPTIONS, PLAYER_COLORS } from '../data/themes';

const STORAGE_KEYS = {
  ACTIVE_GROUP: 'spy_hunt_active_group_v1',
  SETTINGS: 'spy_hunt_settings_v1',
};

export const DEFAULT_INITIAL_PLAYERS = [
  { id: 'p1', name: 'Alice', avatar: '🕵️', color: PLAYER_COLORS[0] },
  { id: 'p2', name: 'Bob', avatar: '🦁', color: PLAYER_COLORS[1] },
  { id: 'p3', name: 'Charlie', avatar: '🤖', color: PLAYER_COLORS[2] },
  { id: 'p4', name: 'Diana', avatar: '🧙‍♂️', color: PLAYER_COLORS[3] },
  { id: 'p5', name: 'Evan', avatar: '🦊', color: PLAYER_COLORS[4] },
];

export function getInitialStatsForPlayers(playerIds: string[]): Record<string, PlayerStats> {
  const stats: Record<string, PlayerStats> = {};
  playerIds.forEach((id) => {
    stats[id] = {
      gamesPlayed: 0,
      spyWins: 0,
      townsfolkWins: 0,
      coopWins: 0,
      correctGuesses: 0,
      timesAccused: 0,
      timesMagistrate: 0,
    };
  });
  return stats;
}

export function loadSavedGroup(): PlayerGroup {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_GROUP);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.players && parsed.players.length >= 4) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse saved group from localStorage:', e);
  }

  // Create default fallback group
  const defaultPlayers = DEFAULT_INITIAL_PLAYERS;
  const playerIds = defaultPlayers.map((p) => p.id);

  return {
    id: 'group-default',
    name: 'Party Crew',
    players: defaultPlayers,
    turnOrder: playerIds,
    magistrateRotationIndex: 0,
    noSpyVariantChance: 0.10, // 10% chance for No-Spy variant
    qaTimePerPlayerSec: 30, // 30s per player (150s for 5 players)
    usedThemeIds: [],
    customThemes: [],
    stats: getInitialStatsForPlayers(playerIds),
  };
}

export function saveGroup(group: PlayerGroup): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ACTIVE_GROUP, JSON.stringify(group));
  } catch (e) {
    console.error('Failed to save group to localStorage:', e);
  }
}

export function loadSavedSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Failed to load settings:', e);
  }

  return {
    soundEnabled: true,
    ttsEnabled: true,
    vibrationEnabled: true,
    skipMagistrateToggle: false,
  };
}

export function saveSettings(settings: GameSettings): void {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings:', e);
  }
}

export function getAllAvailableThemes(group: PlayerGroup): ThemeCard[] {
  return [...DEFAULT_THEME_CARDS, ...(group.customThemes || [])];
}
