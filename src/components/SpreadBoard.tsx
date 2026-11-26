import React from 'react';
import { Eye, RotateCw, ZoomIn } from 'lucide-react';
import { CARD_BACK_IMAGE } from '../data/tarotDeck';
import type { DrawnCard, SpreadDefinition } from '../types/tarot';

interface SpreadBoardProps {
  spread: SpreadDefinition;
  drawnCards: DrawnCard[];
  onRevealCard: (positionIndex: number) => void;
  onRevealAll: () => void;
  onInspectCard: (drawn: DrawnCard) => void;
}

interface CardSlotProps {
  drawn: DrawnCard;
  compact?: boolean;
  onReveal: () => void;
  onInspect: () => void;
}

const CardSlot: React.FC<CardSlotProps> = ({ drawn, compact, onReveal, onInspect }) => {
  const { card, position, isReversed, isRevealed } = drawn;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-2 text-center">
        <span className="block text-[11px] font-medium tracking-wide text-[#C9A96E]">
          {position.title}
        </span>
      </div>

      <div
        className={`perspective-1200 relative ${
          compact ? 'w-28 sm:w-32' : 'w-36 sm:w-44'
        } aspect-[2208/4224]`}
      >
        <button
          type="button"
          onClick={() => (isRevealed ? onInspect() : onReveal())}
          className="preserve-3d relative h-full w-full cursor-pointer transition-transform duration-700 focus:outline-none"
          style={{ transform: isRevealed ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
          aria-label={
            isRevealed
              ? `Xem chi tiết lá ${card.nameVi}`
              : `Lật lá bài ở vị trí ${position.title}`
          }
        >
          {/* Face Down */}
          <div className="backface-hidden absolute inset-0 overflow-hidden rounded-xl border border-[#C9A96E]/35 bg-[#16161D] shadow-lg transition-shadow hover:shadow-[0_0_24px_rgba(201,169,110,0.2)]">
            <img
              src={CARD_BACK_IMAGE}
              alt="Mặt sau lá bài"
              className="h-full w-full object-cover"
            />
            <span className="absolute inset-x-2 bottom-2 flex items-center justify-center gap-1 rounded-lg bg-[#0B0B0E]/85 py-1 text-[10px] font-medium text-[#E5C88F] backdrop-blur-sm">
              <Eye className="h-3 w-3" />
              Chạm để lật
            </span>
          </div>

          {/* Face Up */}
          <div className="backface-hidden rotate-y-180 group absolute inset-0 overflow-hidden rounded-xl border border-[#C9A96E]/55 bg-[#121217] shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
            <img
              src={card.image}
              alt={`${card.nameVi} (${card.nameEn})`}
              className={`h-full w-full object-cover transition-transform duration-300 ${
                isReversed ? 'rotate-180' : ''
              }`}
            />
            <div className="absolute inset-x-0 top-0 flex justify-between p-1.5">
              {isReversed ? (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#0B0B0E]/85 px-2 py-0.5 text-[10px] font-medium text-[#E5C88F] backdrop-blur-sm">
                  <RotateCw className="h-2.5 w-2.5" />
                  Ngược
                </span>
              ) : (
                <span className="rounded-full bg-[#0B0B0E]/75 px-2 py-0.5 text-[10px] font-medium text-[#E5C88F] backdrop-blur-sm">
                  Xuôi
                </span>
              )}
              <span className="rounded-full bg-[#0B0B0E]/75 p-1 text-[#F4F1EA] opacity-0 transition-opacity group-hover:opacity-100">
                <ZoomIn className="h-3 w-3" />
              </span>
            </div>
          </div>
        </button>
      </div>

      <div className="mt-2.5 min-h-[2.25rem] text-center">
        {isRevealed ? (
          <>
            <p className="font-serif text-sm font-medium text-[#F4F1EA]">{card.nameVi}</p>
            <p className="text-[11px] text-[#9A968E]">{card.nameEn}</p>
          </>
        ) : (
          <p className="text-[11px] text-[#6B6760]">Chưa lật</p>
        )}
      </div>
    </div>
  );
};

export const SpreadBoard: React.FC<SpreadBoardProps> = ({
  spread,
  drawnCards,
  onRevealCard,
  onRevealAll,
  onInspectCard,
}) => {
  const allRevealed = drawnCards.every((d) => d.isRevealed);

  const gridClass =
    spread.layout === 'single'
      ? 'flex justify-center'
      : spread.layout === 'row3'
      ? 'grid grid-cols-1 gap-6 sm:grid-cols-3 justify-items-center'
      : spread.layout === 'grid4'
      ? 'grid grid-cols-2 gap-6 sm:grid-cols-4 justify-items-center'
      : spread.layout === 'decision5'
      ? 'grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-5 justify-items-center'
      : spread.layout === 'relationship6'
      ? 'grid grid-cols-2 gap-6 sm:grid-cols-3 justify-items-center'
      : 'grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-5 justify-items-center';

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#131318] p-5 sm:p-6">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div>
          <span className="text-[11px] font-medium tracking-wider text-[#C9A96E] uppercase">
            Trải bài {spread.cardCount} lá
          </span>
          <h2 className="font-serif text-xl text-[#F4F1EA]">{spread.name}</h2>
        </div>

        {!allRevealed ? (
          <button
            type="button"
            onClick={onRevealAll}
            className="inline-flex items-center gap-1.5 rounded-xl bg-[#C9A96E] px-4 py-2 text-xs font-semibold text-[#0B0B0E] transition-colors hover:bg-[#D8B97F]"
          >
            <Eye className="h-3.5 w-3.5" />
            <span>Lật tất cả lá bài</span>
          </button>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-[11px] text-[#9A968E]">
            Nhấn vào từng lá để xem chi tiết
          </span>
        )}
      </div>

      <div className={gridClass}>
        {drawnCards.map((drawn) => (
          <CardSlot
            key={drawn.position.index}
            drawn={drawn}
            compact={spread.cardCount >= 5}
            onReveal={() => onRevealCard(drawn.position.index)}
            onInspect={() => onInspectCard(drawn)}
          />
        ))}
      </div>
    </div>
  );
};
