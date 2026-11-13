import React from 'react';
import { useApp } from '../../context/AppContext';
import { achievementsList } from '../../data/achievementsData';
import {
  Trophy,
  Sparkles,
  Hash,
  Grid,
  Zap,
  X,
  Flame,
  GraduationCap,
  Lock,
  CheckCircle2,
} from 'lucide-react';

export const AchievementsView: React.FC = () => {
  const { profile, t, isUrdu } = useApp();

  const getBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles': return Sparkles;
      case 'Hash': return Hash;
      case 'Grid': return Grid;
      case 'Zap': return Zap;
      case 'X': return X;
      case 'Flame': return Flame;
      case 'GraduationCap': return GraduationCap;
      default: return Trophy;
    }
  };

  const getProgress = (badge: typeof achievementsList[0]) => {
    let currentVal = 0;
    switch (badge.conditionType) {
      case 'points': currentVal = profile.points; break;
      case 'accuracy': currentVal = profile.totalCorrectAnswers; break;
      case 'quizzes': currentVal = profile.quizzesCompleted; break;
      case 'puzzles': currentVal = profile.puzzlesSolved; break;
      case 'games': currentVal = profile.gamesPlayed; break;
      case 'streak': currentVal = profile.streakDays; break;
    }
    const pct = Math.min(100, Math.round((currentVal / badge.conditionValue) * 100));
    return { currentVal, target: badge.conditionValue, pct };
  };

  const unlockedCount = profile.unlockedBadges.length;

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 select-none">
      {/* 3D Wooden Header */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1.5">
              <Trophy className="w-3.5 h-3.5 text-yellow-400" />
              <span>{isUrdu ? 'تمغے اور اعزازات' : 'Honors & Milestones'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.achievements}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              {isUrdu
                ? 'ریاضی میں مہارت حاصل کرتے جائیں اور شاندار 3D تمغے جیتیں!'
                : 'Unlock prestigious 3D wooden milestone badges as you master mathematics!'}
            </p>
          </div>

          <div className="gold-btn-3d px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-md flex-shrink-0">
            <span>
              {isUrdu
                ? `${achievementsList.length} میں سے ${unlockedCount} حاصل`
                : `${unlockedCount} of ${achievementsList.length} Unlocked`}
            </span>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-5">
        {achievementsList.map((badge) => {
          const isUnlocked = profile.unlockedBadges.includes(badge.id);
          const Icon = getBadgeIcon(badge.icon);
          const progress = getProgress(badge);

          const title = isUrdu ? badge.titleUr : badge.titleEn;
          const desc = isUrdu ? badge.descriptionUr : badge.descriptionEn;

          return (
            <div
              key={badge.id}
              className={`wood-board-3d p-5 flex flex-col justify-between shadow-xl transition-all duration-200 ${
                isUnlocked ? 'border-amber-500' : 'opacity-65 brightness-90'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-md ${
                      isUnlocked ? 'wood-tile-3d' : 'bg-black/40 text-amber-700 border border-amber-900'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>

                  {isUnlocked ? (
                    <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-amber-950" />
                      <span>{isUrdu ? 'حاصل شدہ' : 'Unlocked'}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/40 text-amber-400/80 flex items-center gap-1 border border-amber-900">
                      <Lock className="w-3 h-3" />
                      <span>{isUrdu ? 'مقفل' : 'Locked'}</span>
                    </span>
                  )}
                </div>

                <h3 className="font-black text-base text-amber-100 drop-shadow-sm">{title}</h3>
                <p className="text-xs text-amber-200/80 mt-1 line-clamp-2">{desc}</p>
              </div>

              {/* Progress Bar */}
              <div className="mt-4 pt-3 border-t border-amber-800 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                  <span>{isUrdu ? 'پیش رفت' : 'Progress'}</span>
                  <span dir="ltr">{isUnlocked ? '100%' : `${progress.currentVal} / ${progress.target}`}</span>
                </div>
                <div className="w-full h-2.5 bg-black/40 rounded-full overflow-hidden border border-amber-950">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      isUnlocked ? 'bg-gradient-to-r from-yellow-400 to-amber-500' : 'bg-amber-600'
                    }`}
                    style={{ width: `${isUnlocked ? 100 : progress.pct}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
