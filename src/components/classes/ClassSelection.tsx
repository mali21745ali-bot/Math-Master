import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { classesList } from '../../data/classesData';
import { ClassLevel } from '../../types';
import { sound } from '../../services/sound';
import {
  GraduationCap,
  Sparkles,
  HelpCircle,
  CheckCircle,
  Baby,
  Star,
  Clock,
  Calculator,
  Compass,
  Shapes,
  Binary,
  Divide,
  Sigma,
  Flame,
  Atom,
  Boxes,
  Play,
} from 'lucide-react';

export const ClassSelection: React.FC = () => {
  const {
    profile,
    updateProfile,
    setSelectedClass,
    setActiveView,
    t,
    isUrdu,
  } = useApp();

  const [filterCategory, setFilterCategory] = useState<'all' | 'early' | 'primary' | 'middle' | 'high' | 'university'>('all');

  const filteredClasses = classesList.filter((c) => {
    if (filterCategory === 'early') return ['nursery', 'kg'].includes(c.id);
    if (filterCategory === 'primary') return ['class1', 'class2', 'class3'].includes(c.id);
    if (filterCategory === 'middle') return ['class4', 'class5', 'class6', 'class7', 'class8'].includes(c.id);
    if (filterCategory === 'high') return ['class9', 'class10', 'class11', 'class12'].includes(c.id);
    if (filterCategory === 'university') return c.id === 'university';
    return true;
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Baby': return Baby;
      case 'Sparkles': return Sparkles;
      case 'Star': return Star;
      case 'Clock': return Clock;
      case 'Calculator': return Calculator;
      case 'Compass': return Compass;
      case 'Shapes': return Shapes;
      case 'Binary': return Binary;
      case 'Divide': return Divide;
      case 'Sigma': return Sigma;
      case 'Flame': return Flame;
      case 'Atom': return Atom;
      case 'Boxes': return Boxes;
      default: return GraduationCap;
    }
  };

  const handleSelectAsMyClass = (clsId: ClassLevel) => {
    sound.playClick();
    updateProfile({ classLevel: clsId });
    setSelectedClass(clsId);
  };

  const handleLaunchLevels = (clsId: ClassLevel) => {
    sound.playClick();
    setSelectedClass(clsId);
    setActiveView('level_select');
  };

  const handleLaunchQuiz = (clsId: ClassLevel) => {
    sound.playClick();
    setSelectedClass(clsId);
    setActiveView('quiz');
  };

  return (
    <div className="space-y-5 pb-12 select-none">
      {/* 3D Wooden Header */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1.5">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>{isUrdu ? '15 تعلیمی کلاسز اور درجات' : '15 Educational Grade Levels'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.selectClass}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              {isUrdu
                ? 'نرسری سے لے کر یونیورسٹی تک اپنی کلاس منتخب کریں۔ ہر کلاس میں لیول 1 تا 10 شامل ہیں!'
                : 'Choose your grade level from Nursery to University. Every class features progressive Levels 1 to 10!'}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t.common.all },
          { id: 'early', label: isUrdu ? 'ابتدائی (نرسری - KG)' : 'Early Years (Nursery - KG)' },
          { id: 'primary', label: isUrdu ? 'پرائمری (کلاس 1 - 3)' : 'Primary (Class 1 - 3)' },
          { id: 'middle', label: isUrdu ? 'مڈل (کلاس 4 - 8)' : 'Middle (Class 4 - 8)' },
          { id: 'high', label: isUrdu ? 'ہائی اسکول (کلاس 9 - 12)' : 'High School (Class 9 - 12)' },
          { id: 'university', label: isUrdu ? 'یونیورسٹی لیول' : 'University Level' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setFilterCategory(tab.id as typeof filterCategory);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              filterCategory === tab.id
                ? 'gold-btn-3d text-amber-950 scale-102 shadow-md'
                : 'wood-btn-3d text-amber-100/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Class Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredClasses.map((item) => {
          const isCurrent = profile.classLevel === item.id;
          const IconComp = getIcon(item.iconName);
          const localizedTitle = t.classes[item.id]?.title || item.titleEn;
          const localizedAge = t.classes[item.id]?.age || item.ageEn;
          const localizedDesc = t.classes[item.id]?.desc || item.descEn;
          const classProg = (profile.classProgress && profile.classProgress[item.id]) || {
            unlockedLevel: 1,
            levelStars: {},
            levelHighScores: {},
          };

          return (
            <div
              key={item.id}
              className={`wood-board-3d p-5 flex flex-col justify-between shadow-xl transition-all duration-200 ${
                isCurrent ? 'ring-4 ring-yellow-400' : 'hover:brightness-105'
              }`}
            >
              <div>
                {/* Header row */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl wood-tile-3d flex items-center justify-center shadow-md flex-shrink-0">
                      <IconComp className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-black text-base text-amber-100 drop-shadow-sm">{localizedTitle}</h3>
                      <span className="text-xs font-bold text-amber-300/90">{localizedAge}</span>
                    </div>
                  </div>

                  {isCurrent ? (
                    <span className="gold-badge text-[10px] px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xs flex-shrink-0">
                      <CheckCircle className="w-3 h-3 text-amber-950" />
                      <span>{isUrdu ? 'منتخب' : 'Active'}</span>
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSelectAsMyClass(item.id)}
                      className="text-xs font-bold text-amber-300 hover:text-white px-2 py-1 rounded-lg cursor-pointer flex-shrink-0"
                    >
                      {isUrdu ? 'منتخب کریں' : 'Set Active'}
                    </button>
                  )}
                </div>

                <p className="text-xs text-amber-100/90 line-clamp-2 mb-3">
                  {localizedDesc}
                </p>

                {/* Level Progress Indicator */}
                <div className="wood-board-inner p-2.5 mb-3 border border-amber-800 flex items-center justify-between text-xs">
                  <span className="font-bold text-amber-300">
                    {isUrdu ? 'لیول پیش رفت:' : 'Level Progress:'}
                  </span>
                  <span className="font-black text-yellow-300">
                    {isUrdu ? `لیول ${classProg.unlockedLevel} / 10` : `Level ${classProg.unlockedLevel} / 10`}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => handleLaunchLevels(item.id)}
                  className="green-btn-3d py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>{isUrdu ? 'لیولز کھیلیں' : 'Play Levels'}</span>
                </button>

                <button
                  onClick={() => handleLaunchQuiz(item.id)}
                  className="wood-btn-3d py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.common.takeQuiz}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
