import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { classesList } from '../../data/classesData';
import { sound } from '../../services/sound';
import {
  LineChart,
  Trophy,
  Target,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  RotateCcw,
  User,
  GraduationCap,
  Save,
  Printer,
  Sparkles,
  Coins,
} from 'lucide-react';

export const ProgressReport: React.FC = () => {
  const {
    profile,
    updateProfile,
    t,
    resetProgress,
    triggerConfetti,
    selectedClass,
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [studentName, setStudentName] = useState(profile.name);
  const [selectedAvatar, setSelectedAvatar] = useState(profile.avatar);
  const [editingClass, setEditingClass] = useState(profile.classLevel);

  const avatars = ['🦁', '🚀', '🦉', '🦊', '🐼', '🦄', '🐬', '🐯', '🌟', '⚡'];

  const accuracy = profile.totalQuestionsAnswered > 0
    ? Math.round((profile.totalCorrectAnswers / profile.totalQuestionsAnswered) * 100)
    : 100;

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
              <span>Student Performance</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.progress}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              Review your 3D game achievements, unlocked levels, and mathematical mastery.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="wood-btn-3d px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Student Profile Identity Card in 3D Wood */}
      <div className="wood-board-3d p-5 sm:p-7 shadow-xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl wood-tile-3d flex items-center justify-center text-4xl shadow-lg border-2 border-amber-300">
              {profile.avatar}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-sm">{profile.name}</h2>
                <span className="gold-badge text-[10px] px-2.5 py-0.5 rounded-full">
                  Level {profile.level}
                </span>
              </div>
              <p className="text-xs sm:text-sm text-amber-300 font-bold mt-1">
                {t.classes[profile.classLevel]?.title} • {classProg.unlockedLevel}/10 Levels Unlocked
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              setIsEditing(!isEditing);
            }}
            className="wood-btn-3d px-4 py-2 rounded-xl text-xs sm:text-sm font-bold cursor-pointer"
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {/* Profile Editing Form */}
        {isEditing && (
          <div className="mt-5 pt-4 border-t border-amber-800 space-y-3">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">
                Student Name:
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
                Choose Avatar:
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
                Class Level:
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
          <div className="text-[10px] font-bold text-amber-300 uppercase">Total Points</div>
          <div className="text-2xl sm:text-3xl font-black text-yellow-300 mt-1">{profile.points}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">{profile.coins} Coins</div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">Accuracy</div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">{accuracy}%</div>
          <div className="text-[10px] text-amber-200 mt-0.5">{profile.totalCorrectAnswers} Correct</div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">Games Played</div>
          <div className="text-2xl sm:text-3xl font-black text-amber-100 mt-1">{profile.gamesPlayed}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">{profile.quizzesCompleted} Quizzes</div>
        </div>

        <div className="wood-board-3d p-4 text-center shadow-lg">
          <div className="text-[10px] font-bold text-amber-300 uppercase">Puzzles Solved</div>
          <div className="text-2xl sm:text-3xl font-black text-orange-400 mt-1">{profile.puzzlesSolved}</div>
          <div className="text-[10px] text-amber-200 mt-0.5">3D Sliding Puzzle</div>
        </div>
      </div>

      {/* Curriculum Mastery in 3D Wood */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl space-y-4">
        <h3 className="font-black text-base sm:text-lg text-amber-100 drop-shadow-sm flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          Mathematical Skills Mastery
        </h3>

        <div className="space-y-3">
          {[
            { name: 'Addition & Sums (+)', pct: 92 },
            { name: 'Subtraction & Differences (−)', pct: 88 },
            { name: 'Multiplication & Times Tables (×)', pct: 85 },
            { name: 'Division & Fractions (÷)', pct: 80 },
            { name: 'Number Sequences & Puzzles', pct: 86 },
          ].map((subj, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs font-bold text-amber-200">
                <span>{subj.name}</span>
                <span className="text-yellow-300 font-black">{subj.pct}%</span>
              </div>
              <div className="w-full h-3 bg-black/40 rounded-full overflow-hidden border border-amber-950">
                <div
                  className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 rounded-full"
                  style={{ width: `${subj.pct}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Reset Progress Button */}
      <div className="wood-board-3d p-4 flex items-center justify-between shadow-lg">
        <div>
          <span className="text-xs font-bold text-amber-200 block">Reset Progress Data</span>
          <span className="text-[10px] text-amber-300/80">Restart Levels 1 to 10 from scratch.</span>
        </div>
        <button
          onClick={() => {
            if (window.confirm('Reset all game progress and unlocked levels?')) {
              sound.playClick();
              resetProgress();
            }
          }}
          className="wood-btn-3d px-3 py-1.5 rounded-xl text-xs font-bold text-rose-200 cursor-pointer"
        >
          Reset Data
        </button>
      </div>
    </div>
  );
};
