import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { classesList } from '../../data/classesData';
import { sound } from '../../services/sound';
import {
  Settings,
  Languages,
  Volume2,
  VolumeX,
  GraduationCap,
  RotateCcw,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const {
    profile,
    updateProfile,
    setLanguage,
    toggleSound,
    t,
    resetProgress,
    isUrdu,
  } = useApp();

  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12 select-none">
      {/* 3D Wooden Header Plaque */}
      <div className="wood-board-3d p-6 relative overflow-hidden">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />
        <div className="brass-rivet bottom-2 left-2" />
        <div className="brass-rivet bottom-2 right-2" />

        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-200/60 shadow-md flex items-center justify-center text-amber-950 flex-shrink-0">
            <Settings className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 tracking-wide drop-shadow-md">
              {t.nav.settings}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/80 font-medium">
              {isUrdu
                ? 'زبان، صوتی اثرات اور اپنی بنیادی کلاس کی ترتیبات تبدیل کریں'
                : 'Customize language, audio sound effects, and default class levels'}
            </p>
          </div>
        </div>
      </div>

      {/* Language Switch Option */}
      <div className="wood-board-3d p-6 relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-300 flex items-center justify-center shadow-inner flex-shrink-0">
              <Languages className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100">Language / زبان کا انتخاب</h3>
              <p className="text-xs text-amber-200/70">
                {isUrdu
                  ? 'انگریزی (LTR) اور اردو (RTL) کے درمیان تبدیلی کریں'
                  : 'Toggle between English (LTR) and Urdu (RTL)'}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setLanguage('en');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-transform ${
                !isUrdu ? 'gold-btn-3d text-amber-950' : 'wood-btn-3d text-amber-100'
              }`}
            >
              English
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setLanguage('ur');
              }}
              className={`px-4 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-transform ${
                isUrdu ? 'gold-btn-3d text-amber-950' : 'wood-btn-3d text-amber-100'
              }`}
            >
              اردو (Urdu)
            </button>
          </div>
        </div>
      </div>

      {/* Audio Effects Toggle */}
      <div className="wood-board-3d p-6 relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-300 flex items-center justify-center shadow-inner flex-shrink-0">
              {profile.soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100">
                {isUrdu ? 'صوتی اثرات اور آواز' : 'Audio Feedback & Sound Effects'}
              </h3>
              <p className="text-xs text-amber-200/70">
                {isUrdu
                  ? 'درست جوابات، کلکس اور جیت پر خوشگوار آوازیں سنیں'
                  : 'Play pleasant chimes for correct answers, clicks, and celebratory fanfares'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              toggleSound();
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-black cursor-pointer transition-transform flex-shrink-0 ${
              profile.soundEnabled ? 'green-btn-3d text-white' : 'wood-btn-3d text-amber-200'
            }`}
          >
            {profile.soundEnabled
              ? (isUrdu ? '🔊 آواز آن ہے' : '🔊 Sound On')
              : (isUrdu ? '🔇 خاموش ہے' : '🔇 Muted')}
          </button>
        </div>
      </div>

      {/* Default Grade Level */}
      <div className="wood-board-3d p-6 relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-300 flex items-center justify-center shadow-inner flex-shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100">
                {isUrdu ? 'بنیادی کلاس لیول' : 'Default Class Level'}
              </h3>
              <p className="text-xs text-amber-200/70">
                {isUrdu
                  ? `موجودہ منتخب کلاس: ${t.classes[profile.classLevel]?.title}`
                  : `Currently set to ${t.classes[profile.classLevel]?.title}`}
              </p>
            </div>
          </div>

          <select
            value={profile.classLevel}
            onChange={(e) => {
              sound.playClick();
              updateProfile({ classLevel: e.target.value as typeof profile.classLevel });
            }}
            className="p-3 border-2 border-amber-700/80 rounded-xl text-xs sm:text-sm font-black bg-amber-950 text-amber-100 shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-400"
          >
            {classesList.map((c) => (
              <option key={c.id} value={c.id} className="bg-amber-950 text-amber-100">
                {t.classes[c.id]?.title || c.titleEn}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Data Storage & Reset */}
      <div className="wood-board-3d p-6 relative border-red-900/60 space-y-4">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-11 h-11 rounded-xl bg-red-950/70 border border-red-700/60 text-red-300 flex items-center justify-center shadow-inner flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-amber-100">
                {isUrdu ? 'محفوظ پیش رفت ری سیٹ کریں' : 'Reset Local Progress'}
              </h3>
              <p className="text-xs text-amber-200/70 mt-0.5">
                {isUrdu
                  ? 'اس براؤزر میں محفوظ تمام پوائنٹس، اسٹریکس، بیجز اور کھلے لیولز صاف کریں'
                  : 'Clear all points, streaks, badges, unlocked levels, and stats saved on this browser'}
              </p>
            </div>
          </div>

          {!confirmReset && (
            <button
              onClick={() => {
                sound.playClick();
                setConfirmReset(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-b from-red-600 to-red-800 border-2 border-red-400/50 shadow-md text-white font-black text-xs hover:from-red-500 hover:to-red-700 transition-all cursor-pointer flex-shrink-0"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'ڈیٹا ری سیٹ کریں' : 'Reset Data'}</span>
            </button>
          )}
        </div>

        {confirmReset && (
          <div className="wood-board-inner p-3.5 border border-rose-500/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs text-rose-200 font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>
                {isUrdu
                  ? 'کیا آپ واقعی تمام گیم ڈیٹا ختم کرنا چاہتے ہیں؟ یہ عمل واپس نہیں ہو سکے گا۔'
                  : 'Are you certain you want to reset all game data? This cannot be undone.'}
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
                className="px-3.5 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-600 border border-rose-400/50 text-white text-xs font-black cursor-pointer"
              >
                {isUrdu ? 'جی ہاں، ری سیٹ کریں' : 'Yes, Reset Everything'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
