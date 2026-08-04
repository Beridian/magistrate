export type Role = 'Magistrate' | 'Spy' | 'Townsfolk';

export interface Player {
  id: string;
  name: string;
  avatar: string; // Emoji or avatar identifier
  color: string;  // Color accent
}

export interface ThemeCard {
  id: string;
  category: string;
  text: string;
  hint?: string;
  custom?: boolean;
}

export interface PlayerStats {
  gamesPlayed: number;
  spyWins: number;
  townsfolkWins: number;
  coopWins: number;
  correctGuesses: number;
  timesAccused: number;
  timesMagistrate: number;
}

export interface PlayerGroup {
  id: string;
  name: string;
  players: Player[];
  turnOrder: string[]; // List of player IDs in Magistrate rotation order
  magistrateRotationIndex: number;
  noSpyVariantChance: number; // 0.0 to 0.3 (default 0.10)
  qaTimePerPlayerSec: number; // default 30s per player (e.g. 5 players = 150s)
  usedThemeIds: string[];
  customThemes: ThemeCard[];
  stats: Record<string, PlayerStats>; // Keyed by playerId
}

export interface QAResponse {
  id: string;
  type: 'Yes' | 'No' | 'IDK';
  timestamp: number;
}

export type GameOutcome =
  | 'TownsfolkWin_SpyCaught'
  | 'TownsfolkWin_SpyUnmasked'
  | 'TownsfolkWin_CoopGuessed'
  | 'SpyWin_InnocentExiled'
  | 'SpyWin_SpyEscaped'
  | 'SpyWin_TimeExpired'
  | 'TimeExpiredLoss_NoSpy';

export interface GameSession {
  id: string;
  magistratePlayerId: string;
  hasSpy: boolean; // Silently rolled during round config
  spyPlayerId: string | null; // Null if hasSpy is false
  roleAssignments: Record<string, Role>; // playerId -> Role
  candidateThemes?: [ThemeCard, ThemeCard];
  selectedTheme: ThemeCard;
  guesserPlayerId: string | null;
  qaLog: QAResponse[];
  
  // Phase 5 Result
  phase5Result?: {
    votesYes: number;
    votesNo: number;
    guesserWasSpy: boolean;
    outcome: 'SpyCaught' | 'SpyEscapedMajority' | 'ProceedToPhase6';
  };

  // Phase 6 Result
  phase6Result?: {
    votesPerPlayer: Record<string, number>;
    accusedPlayerId: string;
    tieBreakerUsed: boolean;
    accusedWasSpy: boolean;
  };

  gameOutcome?: GameOutcome;
  startTime: number;
  endTime?: number;
}

export type GamePhase =
  | 'MainMenu'
  | 'PlayerSetup'
  | 'MagistrateConfirmation'
  | 'RevealLap'
  | 'QAPhase'
  | 'DiscussionPhase'
  | 'JudgmentVote'
  | 'AccusationVote'
  | 'EndGameReveal'
  | 'PostGameSummary';

export interface GameSettings {
  soundEnabled: boolean;
  ttsEnabled: boolean;
  vibrationEnabled: boolean;
  skipMagistrateToggle: boolean;
}
