import React from 'react';
import { AlertCircle, RotateCw, X } from 'lucide-react';
import { SUIT_LABELS_VI } from '../data/tarotDeck';
import type { TarotCard } from '../types/tarot';

interface CardDetailModalProps {
  card: TarotCard | null;
  isReversed?: boolean;
  positionTitle?: string;
  onClose: () => void;
}

export const CardDetailModal: React.FC<CardDetailModalProps> = ({
  card,
  isReversed = false,
  positionTitle,
  onClose,
}) => {
  if (!card) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#131318] p-5 shadow-2xl sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Đóng chi tiết lá bài"
          className="absolute top-4 right-4 rounded-lg border border-white/10 bg-[#0B0B0E] p-1.5 text-[#9A968E] transition-colors hover:text-[#F4F1EA]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-6 sm:grid-cols-[200px_1fr]">
          <div className="mx-auto w-44 sm:w-full">
            <div className="aspect-[2208/4224] overflow-hidden rounded-xl border border-[#C9A96E]/50 bg-[#0B0B0E]">
              <img
                src={card.image}
                alt={card.nameVi}
                className={`h-full w-full object-cover ${isReversed ? 'rotate-180' : ''}`}
              />
            </div>
            {isReversed && (
              <p className="mt-2 flex items-center justify-center gap-1 text-xs font-medium text-[#E5C88F]">
                <RotateCw className="h-3 w-3" />
                Đang ở chiều Ngược
              </p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              {positionTitle && (
                <span className="mb-1 inline-block rounded-full border border-[#C9A96E]/35 bg-[#C9A96E]/10 px-2.5 py-0.5 text-[11px] font-medium text-[#E5C88F]">
                  Vị trí: {positionTitle}
                </span>
              )}
              <h2 className="font-serif text-2xl font-semibold text-[#F4F1EA]">{card.nameVi}</h2>
              <p className="text-sm text-[#9A968E]">{card.nameEn}</p>

              <div className="mt-2 flex flex-wrap gap-1.5 text-[11px]">
                <span className="rounded-md border border-white/10 bg-[#0B0B0E] px-2 py-0.5 text-[#D8D4CA]">
                  {card.arcana === 'major' ? 'Đại Bí (Major Arcana)' : SUIT_LABELS_VI[card.suit ?? '']}
                </span>
                <span className="rounded-md border border-white/10 bg-[#0B0B0E] px-2 py-0.5 text-[#D8D4CA]">
                  Nguyên tố: {card.element}
                </span>
                {card.astro && (
                  <span className="rounded-md border border-white/10 bg-[#0B0B0E] px-2 py-0.5 text-[#D8D4CA]">
                    Chiêm tinh: {card.astro}
                  </span>
                )}
              </div>
            </div>

            {card.warning && (
              <div className="flex gap-2 rounded-xl border border-[#C9A96E]/30 bg-[#C9A96E]/[0.07] p-3 text-xs leading-relaxed text-[#E7DEC8]">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-[#C9A96E]" />
                <p>{card.warning}</p>
              </div>
            )}

            <div className="space-y-3 text-sm">
              <div>
                <h3 className="mb-1 text-xs font-semibold tracking-wider text-[#C9A96E] uppercase">
                  Ý nghĩa Xuôi (Upright)
                </h3>
                <p className="ml-[1cm] text-[#D8D4CA]">
                  - {card.upright.join(' · ').replace(/^./, (c) => c.toUpperCase())}
                </p>
              </div>

              <div>
                <h3 className="mb-1 text-xs font-semibold tracking-wider text-[#C9A96E] uppercase">
                  Ý nghĩa Ngược (Reversed)
                </h3>
                <p className="ml-[1cm] text-[#D8D4CA]">
                  - {card.reversed.join(' · ').replace(/^./, (c) => c.toUpperCase())}
                </p>
              </div>

              {(card.imagery || card.loveHint || card.careerHint || card.moneyHint || card.adviceHint || card.reflectionQuestion) && (
                <div className="space-y-1.5 border-t border-white/[0.08] pt-3 text-xs leading-relaxed text-[#B8B3A8]">
                  {card.imagery && (
                    <p>
                      <strong className="text-[#F4F1EA]">Hình ảnh biểu tượng (RWS):</strong> {card.imagery}
                    </p>
                  )}
                  {card.loveHint && (
                    <p>
                      <strong className="text-[#F4F1EA]">Tình cảm:</strong> {card.loveHint}
                    </p>
                  )}
                  {card.careerHint && (
                    <p>
                      <strong className="text-[#F4F1EA]">Công việc:</strong> {card.careerHint}
                    </p>
                  )}
                  {card.moneyHint && (
                    <p>
                      <strong className="text-[#F4F1EA]">Tài chính:</strong> {card.moneyHint}
                    </p>
                  )}
                  {card.adviceHint && (
                    <p>
                      <strong className="text-[#F4F1EA]">Lời khuyên:</strong> {card.adviceHint}
                    </p>
                  )}
                  {card.reflectionQuestion && (
                    <p>
                      <strong className="text-[#C9A96E]">Câu hỏi tự vấn:</strong>{' '}
                      <em className="text-[#E7DEC8]">{card.reflectionQuestion}</em>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
