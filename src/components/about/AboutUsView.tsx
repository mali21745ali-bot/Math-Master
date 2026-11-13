import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  GraduationCap,
  Heart,
  CheckCircle2,
  Code2,
  Layers,
} from 'lucide-react';

export const AboutUsView: React.FC = () => {
  const { t, isUrdu } = useApp();

  const highlights = isUrdu
    ? ['100% مکمل ویب ایپ', 'آف لائن محفوظ پیش رفت', 'ویب آڈیو ساؤنڈ انجن', '3D لکڑی کا گیم ڈیزائن']
    : ['100% Client-Side Ready', 'Offline Resilient', 'Web Audio Synthesizer', '3D Wooden Game Aesthetic'];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* 3D Wooden Hero Banner */}
      <div className="wood-board-3d p-8 text-center relative overflow-hidden shadow-2xl">
        <div className="brass-rivet top-3 left-3" />
        <div className="brass-rivet top-3 right-3" />
        <div className="brass-rivet bottom-3 left-3" />
        <div className="brass-rivet bottom-3 right-3" />

        <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-amber-950/70 border border-amber-600/50 text-xs font-black text-amber-300 shadow-inner mb-3">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{t.tagline}</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-amber-100 tracking-wide drop-shadow-md">
          {t.appName} – {t.appSubtitle}
        </h1>
        <p className="text-sm sm:text-base text-amber-200/90 max-w-2xl mx-auto leading-relaxed mt-2 font-medium">
          {isUrdu
            ? 'ایک مکمل دو لسانی (اردو اور انگریزی) 3D لکڑی کا تعلیمی ریاضی گیم جو نرسری کے بچوں سے لے کر یونیورسٹی کے طلبہ تک سب کو ریاضی سے محبت کرنے کی ترغیب دیتا ہے۔'
            : 'A dedicated bilingual (Urdu & English) 3D wooden mathematical learning adventure designed to inspire learners of every age — from toddlers mastering numbers to university scholars exploring abstract algebra.'}
        </p>
      </div>

      {/* Mission & Pedagogy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="wood-board-3d p-6 relative">
          <div className="brass-rivet top-2 left-2" />
          <div className="brass-rivet top-2 right-2" />

          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-600/50 text-amber-300 flex items-center justify-center shadow-inner mb-3">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-amber-100">
            {isUrdu ? 'تدریسی نقطہ نظر' : 'Pedagogical Philosophy'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed mt-2">
            {isUrdu
              ? 'ریاضی رٹہ لگانے کا نام نہیں بلکہ پیٹرن پہچاننے، منطقی سوچ اور مسائل حل کرنے کی مہارت ہے۔ 3D گیمز کے ذریعے طلبہ کا خوف ختم ہو کر اعتماد بڑھتا ہے۔'
              : 'Mathematics is not about memorization; it is about pattern recognition, spatial reasoning, and logical problem-solving. By combining gamified challenges with tactile 3D wooden boards, Math Master eliminates math anxiety and fosters joyful confidence.'}
          </p>
        </div>

        <div className="wood-board-3d p-6 relative">
          <div className="brass-rivet top-2 left-2" />
          <div className="brass-rivet top-2 right-2" />

          <div className="w-12 h-12 rounded-2xl bg-amber-950/70 border border-amber-600/50 text-amber-300 flex items-center justify-center shadow-inner mb-3">
            <Heart className="w-6 h-6 text-rose-400" />
          </div>
          <h2 className="text-lg font-black text-amber-100">
            {isUrdu ? 'مکمل دو لسانی شمولیت' : 'Full Bilingual Inclusivity'}
          </h2>
          <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed mt-2">
            {isUrdu
              ? 'ہر اسکرین، مساوات، وضاحت اور مینو اردو (RTL) اور انگریزی (LTR) دونوں زبانوں میں دستیاب ہے تاکہ زبان سیکھنے کی راہ میں رکاوٹ نہ بنے۔'
              : 'Every screen, equation, explanation, and menu item is natively available in both English and Urdu (with native Right-To-Left typography). Language should never be an obstacle to mathematical excellence.'}
          </p>
        </div>
      </div>

      {/* 15 Grade Levels Overview */}
      <div className="wood-board-3d p-6 sm:p-8 relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />
        <div className="brass-rivet bottom-2 left-2" />
        <div className="brass-rivet bottom-2 right-2" />

        <h2 className="text-lg font-black text-amber-100 flex items-center gap-2 mb-4">
          <Layers className="w-5 h-5 text-amber-400" />
          <span>{isUrdu ? '15 بتدریج تعلیمی درجات' : '15 Progressive Curriculum Levels'}</span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="wood-board-inner p-4 space-y-1">
            <span className="text-xs font-black text-pink-300 uppercase tracking-wider">
              {isUrdu ? 'ابتدائی سال' : 'Early Years'}
            </span>
            <div className="font-bold text-sm text-amber-100">
              {isUrdu ? 'نرسری اور کے جی' : 'Nursery & Kindergarten'}
            </div>
            <p className="text-[11px] text-amber-200/70">
              {isUrdu
                ? 'تصویری گنتی، پھلوں کے سوالات، اشکال کی پہچان، اور چھوٹے بڑے اعداد کا موازنہ۔'
                : 'Visual counting, fruit counting, geometric shapes, bigger/smaller comparisons.'}
            </p>
          </div>

          <div className="wood-board-inner p-4 space-y-1">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider">
              {isUrdu ? 'پرائمری و مڈل' : 'Primary & Middle'}
            </span>
            <div className="font-bold text-sm text-amber-100">
              {isUrdu ? 'کلاس 1 تا 8' : 'Classes 1 through 8'}
            </div>
            <p className="text-[11px] text-amber-200/70">
              {isUrdu
                ? 'بنیادی چار عملیات، پہاڑے، کسور، اعشاریہ، ذواضعاف اقل، تناسب اور جیومیٹری۔'
                : 'Four basic operations, times tables, fractions, decimals, LCM/HCF, ratios, geometry.'}
            </p>
          </div>

          <div className="wood-board-inner p-4 space-y-1">
            <span className="text-xs font-black text-amber-300 uppercase tracking-wider">
              {isUrdu ? 'سیکنڈری و یونیورسٹی' : 'Secondary & University'}
            </span>
            <div className="font-bold text-sm text-amber-100">
              {isUrdu ? 'کلاس 9 - 12 اور یونیورسٹی' : 'Classes 9 - 12 & University'}
            </div>
            <p className="text-[11px] text-amber-200/70">
              {isUrdu
                ? 'دو درجی مساواتیں، مثلثیات، کیلکولس، لکیری الجبرا اور ریاضیاتی تجزیہ۔'
                : 'Quadratic equations, Trigonometry, Calculus, Linear Algebra, Real Analysis.'}
            </p>
          </div>
        </div>
      </div>

      {/* Technical Architecture */}
      <div className="wood-board-3d p-6 sm:p-8 relative">
        <div className="brass-rivet top-2 left-2" />
        <div className="brass-rivet top-2 right-2" />

        <div className="flex items-center gap-2 mb-2">
          <Code2 className="w-5 h-5 text-amber-400" />
          <h2 className="text-lg font-black text-amber-100">
            {isUrdu ? 'تکنیکی خصوصیات اور ڈھانچہ' : 'Technical Foundation & Features'}
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-amber-200/80 leading-relaxed">
          {isUrdu
            ? 'React 19، TypeScript اور 3D CSS اسٹائلنگ کے ساتھ تیار کردہ۔ تمام اسکورز، ستارے اور کھلے لیولز خودکار طور پر محفوظ رہتے ہیں اور Web Audio انجن خوشگوار آوازیں پیدا کرتا ہے۔'
            : 'Crafted with React 19, TypeScript, and 3D CSS shaders. Progress, stars, and high scores are persisted automatically in local storage, and the Web Audio synthesizer produces pleasant chimes and victory fanfares without external audio dependencies.'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4">
          {highlights.map((feat, i) => (
            <div key={i} className="flex items-center gap-1.5 text-[11px] font-bold text-amber-100 bg-amber-950/70 border border-amber-800/60 p-2.5 rounded-xl shadow-inner">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              <span>{feat}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
