import React, { useState, useEffect } from 'react';
import {
  GamePhase,
  GameSession,
  PlayerGroup,
  GameSettings,
  Role,
  GameOutcome,
  ThemeCard,
} from './types';
import {
  loadSavedGroup,
  saveGroup,
  loadSavedSettings,
  saveSettings,
  getAllAvailableThemes,
} from './utils/storage';
import { soundEngine } from './utils/audio';

import { NavbarHeader } from './components/NavbarHeader';
import { RulesModal } from './components/RulesModal';
import { SettingsModal } from './components/SettingsModal';
import { ThemeManagerModal } from './components/ThemeManagerModal';

import { MainMenu } from './components/MainMenu';
import { PlayerSetup } from './components/PlayerSetup';
import { MagistrateConfirmation } from './components/MagistrateConfirmation';
import { RevealLap } from './components/RevealLap';
import { QAPhase } from './components/QAPhase';
import { DiscussionPhase } from './components/DiscussionPhase';
import { JudgmentVote } from './components/JudgmentVote';
import { AccusationVote } from './components/AccusationVote';
import { EndGameReveal } from './components/EndGameReveal';
import { PostGameSummary } from './components/PostGameSummary';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('MainMenu');
  const [group, setGroup] = useState<PlayerGroup>(() => loadSavedGroup());
  const [settings, setSettings] = useState<GameSettings>(() => loadSavedSettings());
  const [session, setSession] = useState<GameSession | null>(null);

  // Modals state
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isThemeManagerOpen, setIsThemeManagerOpen] = useState(false);

  // Sync settings with audio engine
  useEffect(() => {
    soundEngine.setSoundEnabled(settings.soundEnabled);
    soundEngine.setTtsEnabled(settings.ttsEnabled);
  }, [settings]);

  // Save group whenever changed
  const handleUpdateGroup = (updated: PlayerGroup) => {
    setGroup(updated);
    saveGroup(updated);
  };

  const handleUpdateSettings = (updated: GameSettings) => {
    setSettings(updated);
    saveSettings(updated);
  };

  // Start new round logic
  const handleStartRound = (isNextRound = false) => {
    soundEngine.playClick();

    let newMagistrateIdx = group.magistrateRotationIndex;
    if (isNextRound) {
      newMagistrateIdx = (group.magistrateRotationIndex + 1) % group.turnOrder.length;
    }

    const magistrateId = group.turnOrder[newMagistrateIdx % group.turnOrder.length];
    const magistratePlayer = group.players.find((p) => p.id === magistrateId) || group.players[0];

    // Roll for No-Spy variant (e.g. 10% chance)
    const roll = Math.random();
    const hasSpy = roll >= group.noSpyVariantChance;

    // Remaining non-magistrate players
    const remainingPlayers = group.players.filter((p) => p.id !== magistratePlayer.id);

    // Assign Spy if present
    let spyPlayerId: string | null = null;
    if (hasSpy && remainingPlayers.length > 0) {
      const randomSpyIdx = Math.floor(Math.random() * remainingPlayers.length);
      spyPlayerId = remainingPlayers[randomSpyIdx].id;
    }

    // Assign role map
    const roleAssignments: Record<string, Role> = {};
    group.players.forEach((p) => {
      if (p.id === magistratePlayer.id) {
        roleAssignments[p.id] = 'Magistrate';
      } else if (p.id === spyPlayerId) {
        roleAssignments[p.id] = 'Spy';
      } else {
        roleAssignments[p.id] = 'Townsfolk';
      }
    });

    // Pick 2 candidate theme cards with no-repeat tracking
    const availableThemes = getAllAvailableThemes(group);
    let unusedThemes = availableThemes.filter((t) => !group.usedThemeIds.includes(t.id));

    if (unusedThemes.length < 2) {
      // Reset used themes history when fewer than 2 available
      unusedThemes = availableThemes;
    }

    const shuffled = [...unusedThemes].sort(() => 0.5 - Math.random());
    const candidateThemes: [ThemeCard, ThemeCard] = [
      shuffled[0] || availableThemes[0],
      shuffled[1] || availableThemes[1] || availableThemes[0],
    ];

    const selectedTheme = candidateThemes[0];

    // Update group state with rotation index
    const updatedGroup = {
      ...group,
      magistrateRotationIndex: newMagistrateIdx,
    };
    handleUpdateGroup(updatedGroup);

    // Create GameSession
    const newSession: GameSession = {
      id: `session-${Date.now()}`,
      magistratePlayerId: magistratePlayer.id,
      hasSpy,
      spyPlayerId,
      roleAssignments,
      candidateThemes,
      selectedTheme,
      guesserPlayerId: null,
      qaLog: [],
      startTime: Date.now(),
    };

    setSession(newSession);
    setPhase('MagistrateConfirmation');
  };

  // Skip magistrate toggle
  const handleSkipMagistrate = () => {
    soundEngine.playClick();
    const nextIdx = (group.magistrateRotationIndex + 1) % group.turnOrder.length;
    handleUpdateGroup({ ...group, magistrateRotationIndex: nextIdx });
    handleStartRound(false);
  };

  // Phase transition handlers
  const handleConfirmMagistrate = (chosenTheme: ThemeCard) => {
    if (!session) return;

    // Lock in chosen theme
    const updatedSession: GameSession = { ...session, selectedTheme: chosenTheme };
    setSession(updatedSession);

    // Update usedThemeIds in group tracking
    const updatedUsedThemes = Array.from(new Set([...group.usedThemeIds, chosenTheme.id]));
    handleUpdateGroup({ ...group, usedThemeIds: updatedUsedThemes });

    setPhase('RevealLap');
  };

  const handleRevealLapComplete = () => {
    setPhase('QAPhase');
  };

  // Q&A Correct Guess Handler
  const handleCorrectGuess = (guesserId: string) => {
    if (!session) return;
    const updatedSession = { ...session, guesserPlayerId: guesserId };
    setSession(updatedSession);

    if (!session.hasSpy) {
      // Rare No-Spy variant -> Immediate Cooperative Win!
      finishGame(updatedSession, 'TownsfolkWin_CoopGuessed');
    } else {
      // Proceed to Discussion Phase
      setPhase('DiscussionPhase');
    }
  };

  // Q&A Timer Expired
  const handleTimerExpired = () => {
    if (!session) return;
    if (!session.hasSpy) {
      finishGame(session, 'TimeExpiredLoss_NoSpy');
    } else {
      finishGame(session, 'SpyWin_TimeExpired');
    }
  };

  // Discussion -> Voting
  const handleProceedToVoting = () => {
    setPhase('JudgmentVote');
  };

  // Phase 5 Judgment Vote
  const handleJudgmentVoteComplete = (votesYes: number, votesNo: number) => {
    if (!session || !session.guesserPlayerId) return;

    const guesserWasSpy = session.guesserPlayerId === session.spyPlayerId;
    const majorityYes = votesYes > votesNo;

    let outcome: 'SpyCaught' | 'SpyEscapedMajority' | 'ProceedToPhase6' = 'ProceedToPhase6';

    if (majorityYes) {
      outcome = guesserWasSpy ? 'SpyCaught' : 'SpyEscapedMajority';
      const finalOutcome: GameOutcome = guesserWasSpy
        ? 'TownsfolkWin_SpyCaught'
        : 'SpyWin_InnocentExiled';

      const updatedSession: GameSession = {
        ...session,
        phase5Result: { votesYes, votesNo, guesserWasSpy, outcome },
      };
      setSession(updatedSession);
      finishGame(updatedSession, finalOutcome);
    } else {
      // Majority NO -> proceed to Phase 6 Accusation Vote
      const updatedSession: GameSession = {
        ...session,
        phase5Result: { votesYes, votesNo, guesserWasSpy, outcome: 'ProceedToPhase6' },
      };
      setSession(updatedSession);
      setPhase('AccusationVote');
    }
  };

  // Phase 6 Accusation Vote
  const handleAccusationComplete = (accusedPlayerId: string, tieBreakerUsed: boolean) => {
    if (!session) return;

    const accusedWasSpy = accusedPlayerId === session.spyPlayerId;
    const finalOutcome: GameOutcome = accusedWasSpy
      ? 'TownsfolkWin_SpyUnmasked'
      : 'SpyWin_SpyEscaped';

    const updatedSession: GameSession = {
      ...session,
      phase6Result: {
        votesPerPlayer: {},
        accusedPlayerId,
        tieBreakerUsed,
        accusedWasSpy,
      },
    };
    setSession(updatedSession);
    finishGame(updatedSession, finalOutcome);
  };

  // Update Stats & Move to EndGameReveal
  const finishGame = (sess: GameSession, outcome: GameOutcome) => {
    const finalSession: GameSession = { ...sess, gameOutcome: outcome, endTime: Date.now() };
    setSession(finalSession);

    // Update group stats
    const statsCopy = { ...group.stats };

    group.players.forEach((p) => {
      if (!statsCopy[p.id]) {
        statsCopy[p.id] = {
          gamesPlayed: 0,
          spyWins: 0,
          townsfolkWins: 0,
          coopWins: 0,
          correctGuesses: 0,
          timesAccused: 0,
          timesMagistrate: 0,
        };
      }

      const st = { ...statsCopy[p.id] };
      st.gamesPlayed += 1;

      if (p.id === sess.magistratePlayerId) {
        st.timesMagistrate += 1;
      }

      if (p.id === sess.guesserPlayerId) {
        st.correctGuesses += 1;
      }

      if (sess.phase6Result?.accusedPlayerId === p.id) {
        st.timesAccused += 1;
      }

      const isTownsfolkWin =
        outcome === 'TownsfolkWin_SpyCaught' ||
        outcome === 'TownsfolkWin_SpyUnmasked' ||
        outcome === 'TownsfolkWin_CoopGuessed';

      if (isTownsfolkWin) {
        if (outcome === 'TownsfolkWin_CoopGuessed') {
          st.coopWins += 1;
        } else if (p.id !== sess.spyPlayerId) {
          st.townsfolkWins += 1;
        }
      } else if (p.id === sess.spyPlayerId) {
        st.spyWins += 1;
      }

      statsCopy[p.id] = st;
    });

    handleUpdateGroup({ ...group, stats: statsCopy });
    setPhase('EndGameReveal');
  };

  // Helper for current phase human-readable name
  const getPhaseName = (): string | undefined => {
    switch (phase) {
      case 'PlayerSetup':
        return 'Roster Setup';
      case 'MagistrateConfirmation':
        return 'Magistrate';
      case 'RevealLap':
        return 'Secret Role Pass';
      case 'QAPhase':
        return 'Public Q&A Timer';
      case 'DiscussionPhase':
        return 'Discussion';
      case 'JudgmentVote':
        return 'Judgment Vote';
      case 'AccusationVote':
        return 'Accusation Vote';
      case 'EndGameReveal':
        return 'Reveal & Outcome';
      case 'PostGameSummary':
        return 'Leaderboard';
      default:
        return undefined;
    }
  };

  const magistratePlayer = session
    ? group.players.find((p) => p.id === session.magistratePlayerId) || group.players[0]
    : group.players[0];

  const guesserPlayer = session?.guesserPlayerId
    ? group.players.find((p) => p.id === session.guesserPlayerId) || group.players[0]
    : group.players[0];

  const qaTotalTimeSec = (group.players.length || 5) * (group.qaTimePerPlayerSec || 30);

  return (
    <div className="min-h-screen bg-[#070707] text-[#E0D7D0] flex flex-col font-sans antialiased selection:bg-[#D4AF37] selection:text-black">
      {/* Top Navbar */}
      <NavbarHeader
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onOpenRules={() => setIsRulesOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenThemeManager={() => setIsThemeManagerOpen(true)}
        currentPhaseName={getPhaseName()}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        {phase === 'MainMenu' && (
          <MainMenu
            group={group}
            onStartGame={() => handleStartRound(false)}
            onOpenPlayerSetup={() => setPhase('PlayerSetup')}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenThemeManager={() => setIsThemeManagerOpen(true)}
          />
        )}

        {phase === 'PlayerSetup' && (
          <PlayerSetup
            group={group}
            onSaveGroup={handleUpdateGroup}
            onBack={() => setPhase('MainMenu')}
          />
        )}

        {phase === 'MagistrateConfirmation' && session && (
          <MagistrateConfirmation
            magistrate={magistratePlayer}
            session={session}
            onConfirm={handleConfirmMagistrate}
            onSkipMagistrate={handleSkipMagistrate}
          />
        )}

        {phase === 'RevealLap' && session && (
          <RevealLap
            session={session}
            players={group.players}
            onLapComplete={handleRevealLapComplete}
          />
        )}

        {phase === 'QAPhase' && session && (
          <QAPhase
            session={session}
            players={group.players}
            magistrate={magistratePlayer}
            totalTimeSec={qaTotalTimeSec}
            onCorrectGuess={handleCorrectGuess}
            onTimerExpired={handleTimerExpired}
          />
        )}

        {phase === 'DiscussionPhase' && session && (
          <DiscussionPhase
            session={session}
            guesser={guesserPlayer}
            onProceedToVoting={handleProceedToVoting}
          />
        )}

        {phase === 'JudgmentVote' && session && (
          <JudgmentVote
            session={session}
            players={group.players}
            guesser={guesserPlayer}
            onVoteComplete={handleJudgmentVoteComplete}
          />
        )}

        {phase === 'AccusationVote' && session && (
          <AccusationVote
            session={session}
            players={group.players}
            guesser={guesserPlayer}
            onAccusationComplete={handleAccusationComplete}
          />
        )}

        {phase === 'EndGameReveal' && session && (
          <EndGameReveal
            session={session}
            players={group.players}
            onProceedToSummary={() => setPhase('PostGameSummary')}
          />
        )}

        {phase === 'PostGameSummary' && session && (
          <PostGameSummary
            group={group}
            lastSession={session}
            onNextRound={() => handleStartRound(true)}
            onNewGroup={() => setPhase('PlayerSetup')}
            onMainMenu={() => setPhase('MainMenu')}
          />
        )}
      </main>

      {/* Global Modals */}
      <RulesModal isOpen={isRulesOpen} onClose={() => setIsRulesOpen(false)} />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        group={group}
        onUpdateGroup={handleUpdateGroup}
      />

      <ThemeManagerModal
        isOpen={isThemeManagerOpen}
        onClose={() => setIsThemeManagerOpen(false)}
        group={group}
        onUpdateGroup={handleUpdateGroup}
      />
    </div>
  );
}
