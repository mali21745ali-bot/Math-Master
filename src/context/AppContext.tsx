import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import {
  ClassLevel,
  Difficulty,
  Language,
  StudentProfile,
  ViewType,
  GameMode,
  ClassProgressData,
} from '../types';
import { translations, AppTranslations } from '../i18n/translations';
import { achievementsList } from '../data/achievementsData';
import { sound } from '../services/sound';
import confetti from 'canvas-confetti';

interface AppContextValue {
  profile: StudentProfile;
  activeView: ViewType;
  selectedClass: ClassLevel;
  selectedDifficulty: Difficulty;
  selectedTopicId: string | null;
  selectedGameId: string | null;
  selectedLevel: number;
  selectedGameMode: GameMode;
  t: AppTranslations;
  isUrdu: boolean;
  setActiveView: (view: ViewType) => void;
  setSelectedClass: (cls: ClassLevel) => void;
  setSelectedDifficulty: (diff: Difficulty) => void;
  setSelectedTopicId: (id: string | null) => void;
  setSelectedGameId: (id: string | null) => void;
  setSelectedLevel: (lvl: number) => void;
  setSelectedGameMode: (mode: GameMode) => void;
  setLanguage: (lang: Language) => void;
  updateProfile: (partial: Partial<StudentProfile>) => void;
  unlockNextLevel: (cls: ClassLevel, currentLvl: number, starsEarned: number, scoreEarned: number) => void;
  addPoints: (amount: number) => void;
  recordQuizResult: (correct: number, total: number) => void;
  recordPuzzleSolved: (moves: number, timeSec: number) => void;
  recordGamePlayed: () => void;
  recordDailyChallengeCompleted: () => void;
  toggleSound: () => void;
  resetProgress: () => void;
  triggerConfetti: () => void;
}

const STORAGE_KEY = 'math_master_profile_v2';

const createDefaultClassProgress = (): Record<ClassLevel, ClassProgressData> => {
  const classes: ClassLevel[] = [
    'nursery',
    'kg',
    'class1',
    'class2',
    'class3',
    'class4',
    'class5',
    'class6',
    'class7',
    'class8',
    'class9',
    'class10',
    'class11',
    'class12',
    'university',
  ];
  const obj: Partial<Record<ClassLevel, ClassProgressData>> = {};
  classes.forEach((c) => {
    obj[c] = {
      unlockedLevel: c === 'class3' ? 2 : 1,
      levelStars: c === 'class3' ? { 1: 3, 2: 0 } : { 1: 0 },
      levelHighScores: c === 'class3' ? { 1: 50 } : {},
    };
  });
  return obj as Record<ClassLevel, ClassProgressData>;
};

const defaultProfile: StudentProfile = {
  name: 'Math Explorer',
  avatar: '🦁',
  classLevel: 'class3',
  language: 'en',
  points: 150,
  coins: 45,
  level: 1,
  streakDays: 3,
  lastActiveDate: new Date().toISOString().split('T')[0],
  quizzesCompleted: 2,
  totalQuestionsAnswered: 20,
  totalCorrectAnswers: 18,
  puzzlesSolved: 0,
  gamesPlayed: 3,
  soundEnabled: true,
  unlockedBadges: ['math_beginner'],
  dailyChallengeCompletedDates: [],
  classProgress: createDefaultClassProgress(),
};

const AppContext = createContext<AppContextValue | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<StudentProfile>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return {
          ...defaultProfile,
          ...parsed,
          classProgress: {
            ...createDefaultClassProgress(),
            ...(parsed.classProgress || {}),
          },
        };
      }
      // Migrate v1 if available
      const storedV1 = localStorage.getItem('math_master_profile_v1');
      if (storedV1) {
        const parsedV1 = JSON.parse(storedV1);
        return {
          ...defaultProfile,
          ...parsedV1,
          classProgress: createDefaultClassProgress(),
        };
      }
    } catch {
      // Fallback
    }
    return defaultProfile;
  });

  const [activeView, setActiveView] = useState<ViewType>('home');
  const [selectedClass, setSelectedClass] = useState<ClassLevel>(profile.classLevel);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>('medium');
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<number>(1);
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>('addition');

  // Sync profile changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    } catch {
      // storage unavailable
    }
  }, [profile]);

  // Synchronize document dir and lang attributes for full RTL/LTR switching
  useEffect(() => {
    const isUrdu = profile.language === 'ur';
    document.documentElement.setAttribute('dir', isUrdu ? 'rtl' : 'ltr');
    document.documentElement.setAttribute('lang', isUrdu ? 'ur' : 'en');
    sound.setEnabled(profile.soundEnabled);
  }, [profile.language, profile.soundEnabled]);

  const isUrdu = profile.language === 'ur';
  const t = useMemo(() => translations[profile.language], [profile.language]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // fallback
    }
  };

  const updateProfile = (partial: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const updated = { ...prev, ...partial };
      // Check level upgrades (e.g. 1 level per 200 pts)
      const calculatedLevel = Math.max(1, Math.floor(updated.points / 200) + 1);
      updated.level = calculatedLevel;
      return updated;
    });
  };

  const unlockNextLevel = (
    cls: ClassLevel,
    currentLvl: number,
    starsEarned: number,
    scoreEarned: number
  ) => {
    setProfile((prev) => {
      const currentProgress = prev.classProgress[cls] || {
        unlockedLevel: 1,
        levelStars: {},
        levelHighScores: {},
      };

      const nextLevel = Math.min(10, Math.max(currentProgress.unlockedLevel, currentLvl + 1));
      const oldStars = currentProgress.levelStars[currentLvl] || 0;
      const bestStars = Math.max(oldStars, starsEarned);
      const oldHigh = currentProgress.levelHighScores[currentLvl] || 0;
      const bestHigh = Math.max(oldHigh, scoreEarned);

      const updatedProgress: Record<ClassLevel, ClassProgressData> = {
        ...prev.classProgress,
        [cls]: {
          ...currentProgress,
          unlockedLevel: nextLevel,
          levelStars: {
            ...currentProgress.levelStars,
            [currentLvl]: bestStars,
          },
          levelHighScores: {
            ...currentProgress.levelHighScores,
            [currentLvl]: bestHigh,
          },
        },
      };

      const bonusPoints = starsEarned * 15 + scoreEarned;
      const intermediate = {
        ...prev,
        points: prev.points + bonusPoints,
        coins: prev.coins + starsEarned * 5,
        classProgress: updatedProgress,
      };
      intermediate.unlockedBadges = checkBadges(intermediate);
      return intermediate;
    });
  };

  const setLanguage = (lang: Language) => {
    sound.playClick();
    updateProfile({ language: lang });
  };

  const toggleSound = () => {
    const nextVal = !profile.soundEnabled;
    sound.setEnabled(nextVal);
    if (nextVal) sound.playClick();
    updateProfile({ soundEnabled: nextVal });
  };

  const checkBadges = (updated: StudentProfile) => {
    const newlyUnlocked: string[] = [...updated.unlockedBadges];
    let added = false;

    achievementsList.forEach((ach) => {
      if (newlyUnlocked.includes(ach.id)) return;
      let qualifies = false;

      switch (ach.conditionType) {
        case 'points':
          qualifies = updated.points >= ach.conditionValue;
          break;
        case 'accuracy':
          qualifies = updated.totalCorrectAnswers >= ach.conditionValue;
          break;
        case 'quizzes':
          qualifies = updated.quizzesCompleted >= ach.conditionValue;
          break;
        case 'puzzles':
          qualifies = updated.puzzlesSolved >= ach.conditionValue;
          break;
        case 'games':
          qualifies = updated.gamesPlayed >= ach.conditionValue;
          break;
        case 'streak':
          qualifies = updated.streakDays >= ach.conditionValue;
          break;
      }

      if (qualifies) {
        newlyUnlocked.push(ach.id);
        added = true;
      }
    });

    if (added) {
      sound.playVictory();
      triggerConfetti();
      return newlyUnlocked;
    }
    return updated.unlockedBadges;
  };

  const addPoints = (amount: number) => {
    setProfile((prev) => {
      const newPoints = prev.points + amount;
      const newCoins = prev.coins + Math.floor(amount / 5);
      const intermediate = { ...prev, points: newPoints, coins: newCoins };
      const badges = checkBadges(intermediate);
      return { ...intermediate, unlockedBadges: badges };
    });
  };

  const recordQuizResult = (correct: number, total: number) => {
    setProfile((prev) => {
      const earned = correct * 10 + (correct === total && total >= 5 ? 50 : 0);
      const updated: StudentProfile = {
        ...prev,
        points: prev.points + earned,
        coins: prev.coins + correct * 2,
        quizzesCompleted: prev.quizzesCompleted + 1,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + total,
        totalCorrectAnswers: prev.totalCorrectAnswers + correct,
      };
      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });
  };

  const recordPuzzleSolved = (_moves: number, _timeSec: number) => {
    setProfile((prev) => {
      const bonusPoints = 50;
      const updated: StudentProfile = {
        ...prev,
        points: prev.points + bonusPoints,
        coins: prev.coins + 15,
        puzzlesSolved: prev.puzzlesSolved + 1,
      };
      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });
    triggerConfetti();
  };

  const recordGamePlayed = () => {
    setProfile((prev) => {
      const updated: StudentProfile = {
        ...prev,
        gamesPlayed: prev.gamesPlayed + 1,
        points: prev.points + 15,
      };
      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });
  };

  const recordDailyChallengeCompleted = () => {
    const today = new Date().toISOString().split('T')[0];
    setProfile((prev) => {
      if (prev.dailyChallengeCompletedDates.includes(today)) return prev;
      const dates = [...prev.dailyChallengeCompletedDates, today];
      const newStreak = prev.streakDays + 1;
      const updated: StudentProfile = {
        ...prev,
        points: prev.points + 100,
        coins: prev.coins + 25,
        streakDays: newStreak,
        dailyChallengeCompletedDates: dates,
      };
      updated.unlockedBadges = checkBadges(updated);
      return updated;
    });
    sound.playVictory();
    triggerConfetti();
  };

  const resetProgress = () => {
    const resetProf: StudentProfile = {
      ...defaultProfile,
      name: profile.name,
      avatar: profile.avatar,
      classLevel: profile.classLevel,
      language: profile.language,
      soundEnabled: profile.soundEnabled,
      classProgress: createDefaultClassProgress(),
    };
    setProfile(resetProf);
  };

  return (
    <AppContext.Provider
      value={{
        profile,
        activeView,
        selectedClass,
        selectedDifficulty,
        selectedTopicId,
        selectedGameId,
        selectedLevel,
        selectedGameMode,
        t,
        isUrdu,
        setActiveView,
        setSelectedClass,
        setSelectedDifficulty,
        setSelectedTopicId,
        setSelectedGameId,
        setSelectedLevel,
        setSelectedGameMode,
        setLanguage,
        updateProfile,
        unlockNextLevel,
        addPoints,
        recordQuizResult,
        recordPuzzleSolved,
        recordGamePlayed,
        recordDailyChallengeCompleted,
        toggleSound,
        resetProgress,
        triggerConfetti,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
