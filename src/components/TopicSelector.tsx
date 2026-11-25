import React from 'react';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Briefcase,
  Compass,
  Heart,
  Layers,
  Moon,
  Sparkles,
  Sun,
  Wind,
} from 'lucide-react';
import type { SpreadDefinition } from '../types/tarot';

interface TopicSelectorProps {
  spreads: SpreadDefinition[];
  selectedSpread: SpreadDefinition;
  onSelectSpread: (spread: SpreadDefinition) => void;
  question: string;
  onChangeQuestion: (q: string) => void;
  allowReversed: boolean;
  onToggleReversed: (val: boolean) => void;
  onStartReading: () => void;
}

const SPREAD_ICONS: Record<string, React.ReactNode> = {
  'past-present-future': <Compass className="h-4 w-4" />,
  love: <Heart className="h-4 w-4" />,
  career: <Briefcase className="h-4 w-4" />,
  decision: <Layers className="h-4 w-4" />,
  'self-care': <Wind className="h-4 w-4" />,
  'shadow-work': <Moon className="h-4 w-4" />,
  daily: <Sun className="h-4 w-4" />,
  'celtic-cross': <Sparkles className="h-4 w-4" />,
};

export const TopicSelector: React.FC<TopicSelectorProps> = ({
  spreads,
  selectedSpread,
  onSelectSpread,
  question,
  onChangeQuestion,
  allowReversed,
  onToggleReversed,
  onStartReading,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8"
    >
      {/* Hero header */}
      <section className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-xs font-medium tracking-[0.2em] text-[#C9A96E] uppercase">
          Không gian chiêm nghiệm tối giản
        </p>
        <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#F4F1EA] sm:text-4xl">
          Bạn muốn soi chiếu điều gì hôm nay?
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[#9A968E] sm:text-base">
          Chọn một chủ đề trải bài, đặt câu hỏi mở và tự tay rút những lá bài từ bộ 78 lá
          (22 Đại Bí &amp; 56 Tiểu Bí). AI Agent sẽ đồng hành luận giải nhẹ nhàng, khách quan.
        </p>
      </section>

      {/* Spreads grid */}
      <section className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-3">
        {spreads.map((spread) => {
          const isActive = spread.id === selectedSpread.id;
          return (
            <button
              key={spread.id}
              type="button"
              onClick={() => onSelectSpread(spread)}
              className={`group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-200 ${
                isActive
                  ? 'border-[#C9A96E]/70 bg-[#17171E] shadow-[0_0_32px_rgba(201,169,110,0.08)]'
                  : 'border-white/[0.08] bg-[#131318] hover:border-white/20 hover:bg-[#17171E]'
              }`}
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-lg border transition-colors ${
                      isActive
                        ? 'border-[#C9A96E]/50 bg-[#C9A96E]/15 text-[#E5C88F]'
                        : 'border-white/10 bg-white/[0.03] text-[#9A968E] group-hover:text-[#F4F1EA]'
                    }`}
                  >
                    {SPREAD_ICONS[spread.id] ?? <Sparkles className="h-4 w-4" />}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {spread.badge && (
                      <span className="rounded-full border border-[#C9A96E]/30 bg-[#C9A96E]/10 px-2 py-0.5 text-[10px] font-medium text-[#E5C88F]">
                        {spread.badge}
                      </span>
                    )}
                    <span className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-0.5 text-[11px] font-medium text-[#D8D4CA]">
                      {spread.cardCount} lá
                    </span>
                  </div>
                </div>

                <h2 className="font-serif text-lg font-medium text-[#F4F1EA]">{spread.name}</h2>
                <p className="mt-1.5 text-xs leading-relaxed text-[#9A968E]">{spread.subtitle}</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3 text-[11px] text-[#9A968E]">
                <span>{spread.category}</span>
                <span className={isActive ? 'text-[#C9A96E]' : 'opacity-60 group-hover:opacity-100'}>
                  {isActive ? 'Đang chọn' : 'Chọn trải bài →'}
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {/* Question & Options panel */}
      <section className="mx-auto max-w-3xl rounded-2xl border border-white/[0.08] bg-[#131318] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="text-xs font-medium tracking-wider text-[#C9A96E] uppercase">
              Trải bài đã chọn
            </span>
            <h3 className="font-serif text-xl text-[#F4F1EA]">
              {selectedSpread.name} · {selectedSpread.cardCount} lá
            </h3>
          </div>

          <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-white/[0.08] bg-[#0B0B0E] px-3 py-2 text-xs text-[#D8D4CA]">
            <input
              type="checkbox"
              checked={allowReversed}
              onChange={(e) => onToggleReversed(e.target.checked)}
              className="h-3.5 w-3.5 accent-[#C9A96E]"
            />
            <span>Cho phép bài ngược (Reversed)</span>
          </label>
        </div>

        <div className="mt-4">
          <label htmlFor="tarot-question" className="mb-1.5 block text-xs font-medium text-[#D8D4CA]">
            Câu hỏi hoặc điều bạn đang băn khoăn (khuyên dùng câu hỏi mở)
          </label>
          <textarea
            id="tarot-question"
            rows={2}
            value={question}
            onChange={(e) => onChangeQuestion(e.target.value)}
            placeholder={selectedSpread.sampleQuestions[0]}
            className="w-full resize-none rounded-xl border border-white/[0.1] bg-[#0B0B0E] px-4 py-3 text-sm text-[#F4F1EA] placeholder-[#6B6760] focus:border-[#C9A96E]/60 focus:outline-none"
          />
        </div>

        {/* Sample question chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          <span className="py-1 text-[11px] text-[#9A968E]">Gợi ý:</span>
          {selectedSpread.sampleQuestions.map((sample, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onChangeQuestion(sample)}
              className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-left text-[11px] text-[#C8C3B8] transition-colors hover:border-[#C9A96E]/40 hover:text-[#F4F1EA]"
            >
              {sample}
            </button>
          ))}
        </div>

        {/* Positions preview */}
        <div className="mt-5 border-t border-white/[0.06] pt-4">
          <p className="mb-2 text-[11px] font-medium tracking-wider text-[#9A968E] uppercase">
            Các vị trí bạn sẽ bốc
          </p>
          <div className="flex flex-wrap gap-2">
            {selectedSpread.positions.map((pos) => (
              <span
                key={pos.index}
                className="rounded-lg border border-white/[0.07] bg-[#0B0B0E] px-2.5 py-1 text-xs text-[#D8D4CA]"
              >
                {pos.index + 1}. {pos.title}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-6 flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
          <p className="text-[11px] text-[#8E8A82]">
            Tarot là công cụ phản chiếu tâm lý &amp; góc nhìn, không thay thế quyết định y tế, pháp lý hay tài chính.
          </p>
          <button
            type="button"
            onClick={onStartReading}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#C9A96E] px-6 py-3 text-sm font-semibold text-[#0B0B0E] transition-all hover:bg-[#D8B97F] active:scale-[0.98]"
          >
            <span>Xào bài &amp; Bốc {selectedSpread.cardCount} lá</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>
    </motion.div>
  );
};
