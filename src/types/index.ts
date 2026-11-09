export type Language = 'en' | 'ur';

export type ClassLevel =
  | 'nursery'
  | 'kg'
  | 'class1'
  | 'class2'
  | 'class3'
  | 'class4'
  | 'class5'
  | 'class6'
  | 'class7'
  | 'class8'
  | 'class9'
  | 'class10'
  | 'class11'
  | 'class12'
  | 'university';

export type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';

export type LevelTier = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type GameMode =
  | 'addition'
  | 'subtraction'
  | 'multiplication'
  | 'division'
  | 'mixed'
  | 'sliding_puzzle';

export interface LevelInfo {
  level: LevelTier;
  difficulty: Difficulty;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  questionsCount: number;
  timeLimitSec: number;
}

export interface ClassProgressData {
  unlockedLevel: number; // 1 to 10
  levelStars: Record<number, number>; // level (1..10) -> stars (0..3)
  levelHighScores: Record<number, number>;
}

export type QuestionType =
  | 'mcq'
  | 'true_false'
  | 'fill_blank'
  | 'type_answer'
  | 'match'
  | 'complete_equation'
  | 'missing_number'
  | 'word_problem'
  | 'picture_based';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  classLevel: ClassLevel;
  topic: string;
  difficulty: Difficulty;
  questionEn: string;
  questionUr: string;
  visualEmoji?: string;
  visualCount?: number;
  visualItem?: string;
  optionsEn?: string[];
  optionsUr?: string[];
  correctAnswerEn: string;
  correctAnswerUr: string;
  explanationEn: string;
  explanationUr: string;
  equationParts?: { left: string; op: string; right?: string; result: string };
  matchPairsEn?: { left: string; right: string }[];
  matchPairsUr?: { left: string; right: string }[];
  hintEn?: string;
  hintUr?: string;
}

export interface StudentProfile {
  name: string;
  avatar: string;
  classLevel: ClassLevel;
  language: Language;
  points: number;
  coins: number;
  level: number;
  streakDays: number;
  lastActiveDate: string;
  quizzesCompleted: number;
  totalQuestionsAnswered: number;
  totalCorrectAnswers: number;
  puzzlesSolved: number;
  gamesPlayed: number;
  soundEnabled: boolean;
  unlockedBadges: string[];
  dailyChallengeCompletedDates: string[];
  classProgress: Record<ClassLevel, ClassProgressData>;
}

export interface AchievementBadge {
  id: string;
  titleEn: string;
  titleUr: string;
  descriptionEn: string;
  descriptionUr: string;
  icon: string;
  requiredPoints: number;
  category: 'points' | 'quiz' | 'puzzle' | 'streak' | 'mastery';
  conditionType: 'points' | 'quizzes' | 'accuracy' | 'puzzles' | 'streak' | 'games';
  conditionValue: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  avatar: string;
  classLevel: ClassLevel;
  points: number;
  quizzesCompleted: number;
  isCurrentUser?: boolean;
}

export interface TopicInfo {
  id: string;
  titleEn: string;
  titleUr: string;
  category: 'basic' | 'intermediate' | 'advanced' | 'university';
  descriptionEn: string;
  descriptionUr: string;
  icon: string;
  formula?: string;
  suitableClasses: ClassLevel[];
  keyPointsEn: string[];
  keyPointsUr: string[];
  sampleExampleEn: { problem: string; solution: string };
  sampleExampleUr: { problem: string; solution: string };
}

export type ViewType =
  | 'home'
  | 'select_class'
  | 'topics'
  | 'games'
  | 'puzzle'
  | 'quiz'
  | 'daily_challenge'
  | 'progress'
  | 'achievements'
  | 'leaderboard'
  | 'settings'
  | 'about'
  | 'level_select'
  | 'addition_game'
  | 'subtraction_game'
  | 'multiplication_game'
  | 'division_game'
  | 'math_mix_game';
