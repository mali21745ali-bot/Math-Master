import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { classesList } from '../../data/classesData';
import { sound } from '../../services/sound';
import {
  LineChart,
  BookOpen,
  Save,
  Printer,
  AlertTriangle,
} from 'lucide-react';

export const ProgressReport: React.FC = () => {
  const {
    profile,
    updateProfile,
    t,
    isUrdu,
    resetProgress,
    triggerConfetti,
    selectedClass,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [studentName, setStudentName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [editingClass, setEditingClass] = useState(profile.classLevel);
  const [confirmReset, setConfirmReset] = useState(false);

  const avatars = ['🦁', '🚀', '🦉', '🦊', '🐼', '🦄', '🐬', '🐯', '🌟', '⚡'];

  const accuracy =
    profile.totalQuestionsAnswered > 0
      ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsAnswered) * 100)
      : 0;

  const handleSaveProfile = () => {
    sound.playClick();
    updateProfile({
      name: studentName.trim() || 'Math Explorer',
      avatar: selectedAvatar,
      classLevel: editingClass,
    });
    setIsEditing(false);
    triggerConfetti();
  };

  const classProg = (profile.classProgress && profile.classProgress[selectedClass]) || {
    unlockedLevel: 1,
    levelStars: {},
    levelHighScores: {},
  };

  const levelPct = Math.min(100, Math.round(((classProg.unlockedLevel - 1) / 9) * 100));
  const puzzlePct = Math.min(100, profile.puzzlesSolved * 20);
  const quizPct = Math.min(100, profile.quizzesCompleted * 15);
  const speedPct = Math.min(100, profile.gamesPlayed * 10);

  const skillMasteries = [
    {
      name: isUrdu ? 'عمومی حساب کی درستگی (+ − × ÷)' : 'Overall Calculation Accuracy (+ − × ÷)',
      pct: accuracy,
    },
    {
      name: isUrdu ? 'کلاس لیول کی پیش رفت (لیول 1 تا 10)' : 'Class Curriculum Progression (Levels 1 - 10)',
      pct: levelPct,
    },
    {
      name: isUrdu ? 'گیمز اور رفتار کی مشق' : 'Interactive Games & Speed Practice',
      pct: speedPct,
    },
    {
      name: isUrdu ? 'ریاضی کوئیز مہارت' : 'Mathematics Quiz Mastery',
      pct: quizPct,
    },
    {
      name: isUrdu ? '3D سلائیڈنگ پزل منطق' : '3D Sliding Puzzle Logic',
      pct: puzzlePct,
    },
  ];

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
              <LineChart className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'طالب علم کی کارکردگی' : 'Student Performance'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.progress}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              {isUrdu
                ? 'اپنی کامیابیاں، کھلے ہوئے لیولز اور ریاضی کی مہارت کا جائزہ لیں۔'
                : 'Review your 3D game achievements, unlocked levels, and mathematical mastery.'}
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="wood-btn-3d px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>{isUrdu ? 'رپورٹ پرنٹ کریں' : 'Print Report'}</span>
          </button>
        </div>
      </div>

      {/* Student Profile Identity Card in 3D Wood */}
      <div className="wood-board-3d p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl wood-tile-3d flex items-center justify-center text-4xl shadow-lg border-2 border-amber-300 flex-shrink-0">
              {profile.avatar}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-sm">
                  {profile.name}
                </h2>
                <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full">
                  {t.common.level} {profile.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-300 font-bold mt-1">
                {t.classes[profile.classLevel]?.title} •{' '}
                {isUrdu
                  ? `${classProg.unlockedLevel}/10 لیولز کھلے ہیں`
                  : `${classProg.unlockedLevel}/10 Levels Unlocked`}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setStudentName(profile.name);
              setSelectedAvatar(profile.avatar);
              setEditingClass(profile.classLevel);
              setIsEditing(!isEditing);
            }}
            className="wood-btn-3d px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
          >
            {isEditing
              ? (isUrdu ? 'منسوخ کریں' : 'Cancel Edit')
              : (isUrdu ? 'پروفائل ترمیم' : 'Edit Profile')}
          </button>
        </div>

        {/* Profile Editing Form */}
        {isEditing && (
          <div className="mt-5 pt-4 border-t border-amber-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                {isUrdu ? 'طالب علم کا نام:' : 'Student Name:'}
              </label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                className="w-full sm:w-80 p-2.5 border border-amber-800 bg-amber-950 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                {isUrdu ? 'اوتار منتخب کریں:' : 'Choose Avatar:'}
              </label>
              <div className="flex flex-wrap gap-2">
                {avatars.map((av) => (
                  <button
                    key={av}
                    onClick={() => setSelectedAvatar(av)}
                    className={`w-10 h-10 rounded-xl text-xl flex items-center justify-center transition-all cursor-pointer ${
                      selectedAvatar === av
                        ? 'wood-tile-3d ring-2 ring-yellow-400 scale-110'
                        : 'wood-panel-3d hover:brightness-110'
                    }`}
                  >
                    {av}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                {isUrdu ? 'کلاس کا انتخاب:' : 'Class Level:'}
              </label>
              <select
                value={editingClass}
                onChange={(e) => setEditingClass(e.target.value as typeof editingClass)}
                className="w-full sm:w-80 p-2.5 border border-amber-800 bg-amber-950 text-white rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
              >
                {classesList.map((c) => (
                  <option key={c.id} value={c.id}>
                    {t.classes[c.id]?.title || c.titleEn}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSaveProfile}
              className="green-btn-3d px-5 py-2.5 rounded-xl text-xs sm:text-sm font-black flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Save className="w-4 h-4" />
              <span>{t.common.save}</span>
            </button>
          </div>
        )}
      </div>

      {/* Analytics KPI Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">
            {isUrdu ? 'کل پوائنٹس' : 'Total Points'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-yellow-300 mt-1">{profile.points}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">
            {profile.coins} {t.common.coins}
          </div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">
            {t.common.accuracy}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1" dir="ltr">
            {accuracy}%
          </div>
          <div className="text-[10px] text-amber-200 mt-0.5">
            {profile.totalCorrectAnswers} {isUrdu ? 'درست جوابات' : 'Correct'}
          </div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">
            {isUrdu ? 'کھیلے گئے گیمز' : 'Games Played'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-100 mt-1">{profile.gamesPlayed}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">
            {profile.quizzesCompleted} {isUrdu ? 'کوئیز' : 'Quizzes'}
          </div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">
            {isUrdu ? 'حل شدہ پزلز' : 'Puzzles Solved'}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-1">{profile.puzzlesSolved}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">
            {isUrdu ? '3D سلائیڈنگ پزل' : '3D Sliding Puzzle'}
          </div>
        </div>
      </div>

      {/* Curriculum Mastery in 3D Wood (Dynamic real data) */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-black text-base sm:text-lg text-amber-100 drop-shadow-sm flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>{isUrdu ? 'ریاضی کی مہارتوں کا جائزہ' : 'Mathematical Skills Mastery'}</span>
        </h3>

        <div className="space-y-3">
          {skillMasteries.map((subj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>{subj.name}</span>
                <span className="text-yellow-300 font-black" dir="ltr">{subj.pct}%</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-amber-950">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full transition-all duration-500"
                  style={{ width: `${subj.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Progress Button with Inline Confirmation */}
      <div className="wood-board-3d p-4 shadow-lg space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-200 block">
              {isUrdu ? 'پیش رفت کا ڈیٹا ری سیٹ کریں' : 'Reset Progress Data'}
            </span>
            <span className="text-[10px] text-amber-300/80">
              {isUrdu ? 'تمام پوائنٹس اور لیول 1 سے 10 دوبارہ شروع کریں۔' : 'Restart Levels 1 to 10 from scratch.'}
            </span>
          </div>
          {!confirmReset && (
            <button
              onClick={() => {
                sound.playClick();
                setConfirmReset(true);
              }}
              className="wood-btn-3d px-3.5 py-2 rounded-xl text-xs font-bold text-rose-200 cursor-pointer"
            >
              {isUrdu ? 'ڈیٹا ری سیٹ کریں' : 'Reset Data'}
            </button>
          )}
        </div>

        {confirmReset && (
          <div className="wood-board-inner p-3 border border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-rose-200 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                {isUrdu
                  ? 'کیا آپ واقعی تمام گیم ڈیٹا اور کھلے ہوئے لیولز صاف کرنا چاہتے ہیں؟'
                  : 'Reset all game progress, scores, and unlocked levels?'}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => {
                  sound.playClick();
                  setConfirmReset(false);
                }}
                className="wood-btn-3d px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer"
              >
                {t.common.cancel}
              </button>
              <button
                onClick={() => {
                  sound.playClick();
                  resetProgress();
                  setConfirmReset(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 border border-rose-400/50 text-white text-xs font-black cursor-pointer"
              >
                {isUrdu ? 'جی ہاں، ری سیٹ کریں' : 'Yes, Reset'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
