import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Shuffle, Sparkles, Wand2 } from 'lucide-react';
import { CARD_BACK_IMAGE } from '../data/tarotDeck';
import type { SpreadDefinition, TarotCard } from '../types/tarot';

interface CardDeckDrawProps {
  spread: SpreadDefinition;
  question: string;
  shuffledDeck: TarotCard[];
  selectedIndices: number[];
  onTogglePickCard: (deckIndex: number) => void;
  onReshuffle: () => void;
  onAutoPickRemaining: () => void;
  onConfirmDraw: () => void;
  onBack: () => void;
}

export const CardDeckDraw: React.FC<CardDeckDrawProps> = ({
  spread,
  question,
  shuffledDeck,
  selectedIndices,
  onTogglePickCard,
  onReshuffle,
  onAutoPickRemaining,
  onConfirmDraw,
  onBack,
}) => {
  const [isShuffling, setIsShuffling] = useState(false);
  const railRef = useRef<HTMLDivElement>(null);

  const isComplete = selectedIndices.length === spread.cardCount;
  const nextPosition = spread.positions[selectedIndices.length];

  const handleShuffleClick = () => {
    setIsShuffling(true);
    onReshuffle();
    setTimeout(() => setIsShuffling(false), 450);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* Top context bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#131318] px-3 py-1.5 text-xs text-[#D8D4CA] transition-colors hover:border-white/25 hover:text-[#F4F1EA]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Đổi chủ đề</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShuffleClick}
            disabled={isShuffling}
            className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-[#131318] px-3 py-1.5 text-xs font-medium text-[#D8D4CA] transition-colors hover:border-[#C9A96E]/50 hover:text-[#F4F1EA] disabled:opacity-50"
          >
            <Shuffle className={`h-3.5 w-3.5 text-[#C9A96E] ${isShuffling ? 'animate-spin' : ''}`} />
            <span>Xào lại bài</span>
          </button>

          {!isComplete && (
            <button
              type="button"
              onClick={onAutoPickRemaining}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#C9A96E]/35 bg-[#C9A96E]/10 px-3 py-1.5 text-xs font-medium text-[#E5C88F] transition-colors hover:bg-[#C9A96E]/20"
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span>Rút ngẫu nhiên nhanh</span>
            </button>
          )}
        </div>
      </div>

      {/* Heading & current draw prompt */}
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.18em] text-[#C9A96E] uppercase">
          {spread.name} · Đã chọn {selectedIndices.length}/{spread.cardCount} lá
        </p>
        <h2 className="mt-1.5 font-serif text-2xl font-medium text-[#F4F1EA] sm:text-3xl">
          {isComplete
            ? 'Bạn đã chọn đủ số lá bài'
            : `Chọn lá thứ ${selectedIndices.length + 1}: ${nextPosition?.title}`}
        </h2>
        <p className="mx-auto mt-1.5 max-w-xl text-xs text-[#9A968E] sm:text-sm">
          {isComplete
            ? 'Nhấn "Mở trải bài & Luận giải" để lật bài và trò chuyện cùng AI Agent.'
            : nextPosition?.description}
        </p>
        {question.trim() && (
          <p className="mt-2 text-xs italic text-[#B8B3A8]">
            Câu hỏi: “{question.trim()}”
          </p>
        )}
      </div>

      {/* Position slots indicator */}
      <div className="flex flex-wrap justify-center gap-2">
        {spread.positions.map((pos, idx) => {
          const picked = idx < selectedIndices.length;
          const isCurrent = idx === selectedIndices.length;
          return (
            <div
              key={pos.index}
              className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs transition-all ${
                picked
                  ? 'border-[#C9A96E]/60 bg-[#C9A96E]/15 text-[#E8D2A6]'
                  : isCurrent
                  ? 'border-[#C9A96E]/40 bg-[#1A1A22] text-[#F4F1EA]'
                  : 'border-white/[0.07] bg-[#131318] text-[#7D7972]'
              }`}
            >
              {picked ? (
                <Check className="h-3.5 w-3.5 text-[#C9A96E]" />
              ) : (
                <span className="text-[11px] font-semibold">{idx + 1}.</span>
              )}
              <span>{pos.title}</span>
            </div>
          );
        })}
      </div>

      {/* 78-card interactive fanned/overlapping ribbon */}
      <div className="relative rounded-2xl border border-white/[0.08] bg-[#111116] px-3 py-6 sm:px-6">
        <div className="mb-3 flex items-center justify-between text-[11px] text-[#8E8A82]">
          <span>Bộ bài 78 lá đã được xào ngẫu nhiên — cuộn ngang và chạm vào bất kỳ lá nào</span>
          <span>{shuffledDeck.length} lá úp</span>
        </div>

        <div
          ref={railRef}
          className={`flex items-center overflow-x-auto px-4 pt-8 pb-6 transition-transform duration-300 ${
            isShuffling ? 'scale-[0.98] opacity-60' : 'scale-100 opacity-100'
          }`}
        >
          {shuffledDeck.map((card, deckIdx) => {
            const pickOrder = selectedIndices.indexOf(deckIdx);
            const isPicked = pickOrder !== -1;

            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onTogglePickCard(deckIdx)}
                disabled={!isPicked && isComplete}
                aria-label={`Lá bài úp số ${deckIdx + 1}`}
                style={{ marginLeft: deckIdx === 0 ? 0 : '-2.2rem' }}
                className={`group relative shrink-0 rounded-xl transition-all duration-200 focus:outline-none ${
                  isPicked
                    ? '-translate-y-6 z-20 ring-2 ring-[#C9A96E] shadow-[0_12px_28px_rgba(201,169,110,0.28)]'
                    : isComplete
                    ? 'cursor-not-allowed opacity-45'
                    : 'hover:-translate-y-4 hover:z-30 hover:ring-1 hover:ring-[#C9A96E]/70'
                }`}
              >
                <div className="aspect-[2208/4224] w-16 overflow-hidden rounded-xl border border-white/15 bg-[#191922] sm:w-20">
                  <img
                    src={CARD_BACK_IMAGE}
                    alt="Mặt sau lá bài Tarot"
                    loading="lazy"
                    draggable={false}
                    className="h-full w-full object-cover"
                  />
                </div>
                {isPicked && (
                  <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-[#C9A96E] px-2 py-0.5 text-[10px] font-bold text-[#0B0B0E] shadow">
                    #{pickOrder + 1}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Confirm CTA */}
      <div className="flex justify-center">
        <button
          type="button"
          disabled={!isComplete}
          onClick={onConfirmDraw}
          className={`inline-flex items-center gap-2 rounded-xl px-7 py-3.5 text-sm font-semibold transition-all ${
            isComplete
              ? 'bg-[#C9A96E] text-[#0B0B0E] shadow-[0_0_28px_rgba(201,169,110,0.25)] hover:bg-[#D8B97F] active:scale-[0.98]'
              : 'cursor-not-allowed border border-white/10 bg-[#131318] text-[#6B6760]'
          }`}
        >
          <Sparkles className="h-4 w-4" />
          <span>
            {isComplete
              ? 'Mở trải bài & Luận giải cùng AI'
              : `Hãy chọn thêm ${spread.cardCount - selectedIndices.length} lá nữa`}
          </span>
        </button>
      </div>
    </motion.div>
  );
};
