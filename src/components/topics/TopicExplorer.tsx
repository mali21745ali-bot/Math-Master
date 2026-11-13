import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { topicsList } from '../../data/topicsData';
import { TopicInfo } from '../../types';
import { sound } from '../../services/sound';
import {
  BookOpen,
  Search,
  HelpCircle,
  Hash,
  Plus,
  X,
  ArrowUpDown,
  DivideSquare,
  Percent,
  Layers,
  Superscript,
  Variable,
  FunctionSquare,
  Triangle,
  Activity,
  Grid,
  Compass,
  Maximize2,
  Waves,
  Radio,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

export const TopicExplorer: React.FC = () => {
  const {
    t,
    isUrdu,
    setActiveView,
    setSelectedTopicId,
    selectedTopicId,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'basic' | 'intermediate' | 'advanced' | 'university'>('all');
  const [expandedTopic, setExpandedTopic] = useState<TopicInfo | null>(() => {
    if (selectedTopicId) {
      return topicsList.find((tp) => tp.id === selectedTopicId) || topicsList[0];
    }
    return topicsList[0];
  });

  const getIcon = (name: string) => {
    switch (name) {
      case 'Hash': return Hash;
      case 'Plus': return Plus;
      case 'X': return X;
      case 'ArrowUpDown': return ArrowUpDown;
      case 'DivideSquare': return DivideSquare;
      case 'Percent': return Percent;
      case 'Layers': return Layers;
      case 'Superscript': return Superscript;
      case 'Variable': return Variable;
      case 'FunctionSquare': return FunctionSquare;
      case 'Triangle': return Triangle;
      case 'Activity': return Activity;
      case 'Grid': return Grid;
      case 'Compass': return Compass;
      case 'Maximize2': return Maximize2;
      case 'Waves': return Waves;
      case 'Radio': return Radio;
      default: return BookOpen;
    }
  };

  const categoryLabel = (cat: TopicInfo['category']) => {
    if (!isUrdu) return cat;
    if (cat === 'basic') return 'بنیادی';
    if (cat === 'intermediate') return 'درمیانہ';
    if (cat === 'advanced') return 'ایڈوانسڈ';
    return 'یونیورسٹی';
  };

  const filteredTopics = topicsList.filter((topic) => {
    const matchesCat = activeCategory === 'all' || topic.category === activeCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      topic.titleEn.toLowerCase().includes(q) ||
      topic.titleUr.includes(q) ||
      topic.descriptionEn.toLowerCase().includes(q) ||
      topic.descriptionUr.includes(q) ||
      (topic.formula && topic.formula.toLowerCase().includes(q));
    return matchesCat && matchesSearch;
  });

  const handleStartPractice = (topic: TopicInfo) => {
    sound.playClick();
    setSelectedTopicId(topic.id);
    setActiveView('quiz');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-5 pb-12 select-none">
      {/* 3D Wooden Header */}
      <div className="wood-board-3d p-5 sm:p-6 shadow-xl relative">
        <div className="absolute top-2 left-2 brass-rivet" />
        <div className="absolute top-2 right-2 brass-rivet" />
        <div className="absolute bottom-2 left-2 brass-rivet" />
        <div className="absolute bottom-2 right-2 brass-rivet" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/30 text-amber-300 text-xs font-bold mb-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>{isUrdu ? 'نصاب کا رہنما' : 'Curriculum Reference'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-amber-100 drop-shadow-md">
              {t.nav.topics}
            </h1>
            <p className="text-xs sm:text-sm text-amber-200/90 mt-0.5">
              {isUrdu
                ? 'فارمولے، اہم تصورات اور حل شدہ ریاضیاتی مثالیں۔'
                : 'Formulas, concepts, and worked mathematics examples.'}
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-amber-400 absolute ltr:left-3 rtl:right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isUrdu ? 'موضوع یا فارمولا تلاش کریں...' : 'Search concepts or formulas...'}
              className="w-full ltr:pl-9 ltr:pr-3 rtl:pr-9 rtl:pl-3 py-2 rounded-xl bg-amber-950/80 border border-amber-800 text-white text-xs sm:text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-yellow-400"
            />
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: t.common.all },
          { id: 'basic', label: isUrdu ? 'بنیادی ریاضی' : 'Basic Math' },
          { id: 'intermediate', label: isUrdu ? 'درمیانی سطح' : 'Intermediate' },
          { id: 'advanced', label: isUrdu ? 'اعلیٰ سطح' : 'Advanced' },
          { id: 'university', label: isUrdu ? 'یونیورسٹی' : 'University' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              sound.playClick();
              setActiveCategory(tab.id as typeof activeCategory);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-black whitespace-nowrap transition-all cursor-pointer ${
              activeCategory === tab.id
                ? 'gold-btn-3d text-amber-950 scale-102 shadow-md'
                : 'wood-btn-3d text-amber-100/90'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Topic List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto ltr:pr-1 rtl:pl-1">
          {filteredTopics.length === 0 ? (
            <div className="wood-panel-3d p-6 text-center text-xs text-amber-200 font-bold">
              {isUrdu ? 'کوئی موضوع نہیں ملا۔' : 'No matching topics found.'}
            </div>
          ) : (
            filteredTopics.map((item) => {
              const IconComp = getIcon(item.icon);
              const isSelected = expandedTopic?.id === item.id;
              const title = isUrdu ? item.titleUr : item.titleEn;

              return (
                <div
                  key={item.id}
                  onClick={() => {
                    sound.playClick();
                    setExpandedTopic(item);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition-all shadow-md ${
                    isSelected
                      ? 'wood-tile-3d ring-2 ring-yellow-400'
                      : 'wood-panel-3d border border-amber-900/70 hover:brightness-105'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl wood-board-inner flex items-center justify-center flex-shrink-0 border border-amber-800">
                      <IconComp className="w-5 h-5 text-amber-200" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-black text-sm text-amber-100 truncate drop-shadow-sm">{title}</h3>
                      <span className="text-[9px] uppercase font-bold text-amber-300">
                        {isUrdu ? `${categoryLabel(item.category)} سطح` : `${item.category} Level`}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right Topic Details */}
        <div className="lg:col-span-7">
          {expandedTopic && (
            <div className="wood-board-3d p-5 sm:p-6 shadow-xl space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-amber-800">
                <div>
                  <span className="text-[10px] font-black uppercase text-amber-300">
                    {isUrdu
                      ? `${categoryLabel(expandedTopic.category)} ریاضی`
                      : `${expandedTopic.category} Mathematics`}
                  </span>
                  <h2 className="text-xl sm:text-2xl font-black text-amber-100 drop-shadow-sm mt-0.5">
                    {isUrdu ? expandedTopic.titleUr : expandedTopic.titleEn}
                  </h2>
                </div>

                <button
                  onClick={() => handleStartPractice(expandedTopic)}
                  className="green-btn-3d px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer shadow-md flex-shrink-0"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>{t.common.practice}</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed">
                {isUrdu ? expandedTopic.descriptionUr : expandedTopic.descriptionEn}
              </p>

              {/* Formula Display */}
              {expandedTopic.formula && (
                <div className="wood-board-inner p-3.5 border border-amber-800 text-center">
                  <span className="text-[10px] font-bold uppercase text-amber-300 block mb-1">
                    {isUrdu ? 'اہم فارمولا' : 'Key Formula'}
                  </span>
                  <div className="font-mono text-base text-yellow-300 font-bold overflow-x-auto" dir="ltr">
                    {expandedTopic.formula}
                  </div>
                </div>
              )}

              {/* Key Takeaways */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-black uppercase text-amber-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isUrdu ? 'بنیادی اصول' : 'Core Rules'}</span>
                </h4>
                <ul className="space-y-1">
                  {(isUrdu ? expandedTopic.keyPointsUr : expandedTopic.keyPointsEn).map(
                    (pt, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-amber-100/90">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>

              {/* Solved Example */}
              <div className="wood-panel-3d p-3.5 border border-amber-800 space-y-1.5">
                <span className="text-[10px] font-black uppercase text-amber-300 block">
                  {isUrdu ? 'حل شدہ مثال' : 'Worked Example'}
                </span>
                <div className="font-bold text-xs sm:text-sm text-white">
                  {isUrdu
                    ? expandedTopic.sampleExampleUr.problem
                    : expandedTopic.sampleExampleEn.problem}
                </div>
                <div className="text-xs text-amber-200 wood-board-inner p-2.5 border border-amber-800 leading-relaxed">
                  <strong className="text-yellow-300 block mb-0.5">
                    {isUrdu ? 'حل:' : 'Solution:'}
                  </strong>
                  {isUrdu
                    ? expandedTopic.sampleExampleUr.solution
                    : expandedTopic.sampleExampleEn.solution}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
