import { LevelInfo, LevelTier, Difficulty } from '../types';

export const levelsData: LevelInfo[] = [
  {
    level: 1,
    difficulty: 'easy',
    titleEn: 'Level 1: Gentle Start',
    titleUr: 'لیول 1: آسان شروعات',
    descriptionEn: 'Single step arithmetic with picture and number guidance (20 Questions)',
    descriptionUr: 'آسان بنیادی ریاضی اور تصویری رہنمائی (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 300,
  },
  {
    level: 2,
    difficulty: 'easy',
    titleEn: 'Level 2: Building Speed',
    titleUr: 'لیول 2: رفتار بڑھائیں',
    descriptionEn: 'Quick recognition and fundamental number combinations (20 Questions)',
    descriptionUr: 'تیز تر عدد شناسی اور بنیادی جوڑ (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 280,
  },
  {
    level: 3,
    difficulty: 'medium',
    titleEn: 'Level 3: Normal Warmup',
    titleUr: 'لیول 3: نارمل مشق',
    descriptionEn: 'Two-digit fundamentals and steady mental pace (20 Questions)',
    descriptionUr: 'دو ہندسی بنیادی سوالات اور ذہنی رفتار (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 260,
  },
  {
    level: 4,
    difficulty: 'medium',
    titleEn: 'Level 4: Stepping Up',
    titleUr: 'لیول 4: قدم آگے بڑھائیں',
    descriptionEn: 'Mixed patterns and slightly larger values (20 Questions)',
    descriptionUr: 'مختلف اعداد کے ساتھ تھوڑی بڑی رقمیں (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 240,
  },
  {
    level: 5,
    difficulty: 'medium',
    titleEn: 'Level 5: Medium Challenge',
    titleUr: 'لیول 5: درمیانی چیلنج',
    descriptionEn: 'Carrying over, borrowing, and table fluency (20 Questions)',
    descriptionUr: 'حاصل والے اور ادھار والے سوالات کی روانی (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 220,
  },
  {
    level: 6,
    difficulty: 'medium',
    titleEn: 'Level 6: Sharp Mind',
    titleUr: 'لیول 6: تیز دماغ',
    descriptionEn: 'Fast calculations with timed pressure (20 Questions)',
    descriptionUr: 'وقت کے دباؤ میں فوری حسابی فیصلے (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 200,
  },
  {
    level: 7,
    difficulty: 'hard',
    titleEn: 'Level 7: Hard Tier',
    titleUr: 'لیول 7: مشکل مرحلہ',
    descriptionEn: 'Complex multi-step arithmetic and mental regrouping (20 Questions)',
    descriptionUr: 'کثیر مرحلہ پیچیدہ سوالات اور گروپ بندی (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 190,
  },
  {
    level: 8,
    difficulty: 'hard',
    titleEn: 'Level 8: Master Tactician',
    titleUr: 'لیول 8: ماہر ریاضی دان',
    descriptionEn: 'Deep focus, fast carry calculations, and high accuracy (20 Questions)',
    descriptionUr: 'مکمل توجہ، تیز رفتار حساب اور درستی (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 180,
  },
  {
    level: 9,
    difficulty: 'expert',
    titleEn: 'Level 9: Expert Trial',
    titleUr: 'لیول 9: ماہرانہ امتحان',
    descriptionEn: 'High-speed advanced calculations (20 Questions)',
    descriptionUr: 'تیز ترین رفتار اور بڑے اعداد کا امتحان (20 سوالات)',
    questionsCount: 20,
    timeLimitSec: 160,
  },
  {
    level: 10,
    difficulty: 'expert',
    titleEn: 'Level 10: Grand Challenge',
    titleUr: 'لیول 10: عظیم الشان چیلنج',
    descriptionEn: 'The ultimate 20-question mastery challenge with gold stars',
    descriptionUr: '20 سوالات پر مشتمل حتمی چیلنج اور سنہری ستارے',
    questionsCount: 20,
    timeLimitSec: 150,
  },
];

export const getDifficultyForLevel = (level: number): Difficulty => {
  if (level <= 2) return 'easy';
  if (level <= 6) return 'medium';
  if (level <= 8) return 'hard';
  return 'expert';
};

export const classLevelsConfig = levelsData;
