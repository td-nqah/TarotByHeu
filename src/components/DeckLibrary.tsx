import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import { TAROT_DECK } from '../data/tarotDeck';
import type { TarotCard } from '../types/tarot';

interface DeckLibraryProps {
  onSelectCard: (card: TarotCard) => void;
}

type FilterKey = 'all' | 'major' | 'wands' | 'cups' | 'swords' | 'pentacles';

const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Tất cả (78)' },
  { key: 'major', label: 'Đại Bí (22)' },
  { key: 'wands', label: 'Bộ Gậy (14)' },
  { key: 'cups', label: 'Bộ Cốc (14)' },
  { key: 'swords', label: 'Bộ Kiếm (14)' },
  { key: 'pentacles', label: 'Bộ Tiền (14)' },
];

export const DeckLibrary: React.FC<DeckLibraryProps> = ({ onSelectCard }) => {
  const [filter, setFilter] = useState<FilterKey>('all');
  const [search, setSearch] = useState('');

  const filteredCards = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TAROT_DECK.filter((card) => {
      if (filter === 'major' && card.arcana !== 'major') return false;
      if (filter !== 'all' && filter !== 'major' && card.suit !== filter) return false;
      if (!q) return true;
      return (
        card.nameVi.toLowerCase().includes(q) ||
        card.nameEn.toLowerCase().includes(q) ||
        card.upright.some((k) => k.toLowerCase().includes(q)) ||
        card.reversed.some((k) => k.toLowerCase().includes(q))
      );
    });
  }, [filter, search]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-xs font-medium tracking-[0.2em] text-[#C9A96E] uppercase">
          Chế độ học Tarot · Rider-Waite-Smith
        </p>
        <h1 className="mt-1.5 font-serif text-3xl font-semibold text-[#F4F1EA]">
          Thư viện 78 lá bài
        </h1>
        <p className="mt-2 text-sm text-[#9A968E]">
          Tra cứu ý nghĩa xuôi, ngược và nguyên tố của 22 lá Đại Bí cùng 56 lá Tiểu Bí.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col gap-3 rounded-2xl border border-white/[0.08] bg-[#131318] p-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                filter === f.key
                  ? 'bg-[#C9A96E] text-[#0B0B0E]'
                  : 'border border-white/10 bg-[#0B0B0E] text-[#D8D4CA] hover:border-white/25'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#9A968E]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm tên lá hoặc từ khóa..."
            className="w-full rounded-xl border border-white/10 bg-[#0B0B0E] py-2 pr-3 pl-9 text-xs text-[#F4F1EA] placeholder-[#6B6760] focus:border-[#C9A96E]/60 focus:outline-none"
          />
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6">
        {filteredCards.map((card) => (
          <button
            key={card.id}
            type="button"
            onClick={() => onSelectCard(card)}
            className="group flex flex-col items-center rounded-xl border border-white/[0.07] bg-[#131318] p-2.5 text-center transition-all hover:border-[#C9A96E]/50 hover:bg-[#17171E]"
          >
            <div className="aspect-[2208/4224] w-full overflow-hidden rounded-lg bg-[#0B0B0E]">
              <img
                src={card.image}
                alt={card.nameVi}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </div>
            <p className="mt-2 font-serif text-xs font-medium text-[#F4F1EA] line-clamp-1">
              {card.nameVi}
            </p>
            <p className="text-[10px] text-[#9A968E] line-clamp-1">{card.nameEn}</p>
          </button>
        ))}
      </div>

      {filteredCards.length === 0 && (
        <p className="py-12 text-center text-sm text-[#9A968E]">
          Không tìm thấy lá bài phù hợp với từ khóa “{search}”.
        </p>
      )}
    </div>
  );
};
