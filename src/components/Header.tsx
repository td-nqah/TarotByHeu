import React from 'react';
import { BookOpen, History, Settings2 } from 'lucide-react';
import type { AISettings, AppView } from '../types/tarot';

interface HeaderProps {
  activeView: AppView;
  onSelectView: (view: AppView) => void;
  onGoHome: () => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
  aiSettings: AISettings;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  onSelectView,
  onGoHome,
  onOpenHistory,
  onOpenSettings,
  historyCount,
  aiSettings,
}) => {
  const aiLabel =
    aiSettings.mode === 'builtin' || !aiSettings.apiKey.trim()
      ? 'Agent nội bộ'
      : aiSettings.mode === 'gemini'
      ? 'Gemini AI'
      : 'OpenAI AI';

  return (
    <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#0B0B0E]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <button
          type="button"
          onClick={onGoHome}
          className="group flex items-center gap-2.5 text-left transition-opacity hover:opacity-90"
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-[#C9A96E]/35 bg-[#C9A96E]/10 text-[#C9A96E]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="h-4.5 w-4.5"
              aria-hidden="true"
            >
              <rect
                x="5"
                y="2.5"
                width="14"
                height="19"
                rx="2.2"
                stroke="currentColor"
                strokeWidth="1.5"
              />
              <path
                d="M13.6 7.4a4.2 4.2 0 1 0 3 6.9 3.4 3.4 0 0 1-3-6.9Z"
                fill="currentColor"
              />
              <path
                d="M12 14.3l.65 1.55 1.55.65-1.55.65L12 18.7l-.65-1.55-1.55-.65 1.55-.65L12 14.3Z"
                fill="currentColor"
              />
            </svg>
          </span>
          <div>
            <span className="font-serif text-lg font-semibold tracking-tight text-[#F4F1EA]">
              TarotByHeu
            </span>
            <span className="hidden text-[11px] tracking-wider text-[#9A968E] uppercase sm:block">
              78 lá Rider-Waite-Smith
            </span>
          </div>
        </button>

        <nav className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            onClick={() => onSelectView('reading')}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              activeView === 'reading'
                ? 'bg-white/[0.08] text-[#F4F1EA]'
                : 'text-[#9A968E] hover:bg-white/[0.04] hover:text-[#F4F1EA]'
            }`}
          >
            Trải bài
          </button>

          <button
            type="button"
            onClick={() => onSelectView('library')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors sm:text-sm ${
              activeView === 'library'
                ? 'bg-white/[0.08] text-[#F4F1EA]'
                : 'text-[#9A968E] hover:bg-white/[0.04] hover:text-[#F4F1EA]'
            }`}
          >
            <BookOpen className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Thư viện 78 lá</span>
            <span className="sm:hidden">78 lá</span>
          </button>

          <div className="mx-1 h-4 w-px bg-white/10" />

          <button
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#131318] px-2.5 py-1.5 text-xs text-[#D8D4CA] transition-colors hover:border-[#C9A96E]/40 hover:text-[#F4F1EA]"
            title="Lịch sử trải bài"
          >
            <History className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="hidden md:inline">Lịch sử</span>
            {historyCount > 0 && (
              <span className="rounded-full bg-[#C9A96E]/20 px-1.5 py-0.2 text-[10px] font-medium text-[#E5C88F]">
                {historyCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenSettings}
            className="flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-[#131318] px-2.5 py-1.5 text-xs text-[#D8D4CA] transition-colors hover:border-[#C9A96E]/40 hover:text-[#F4F1EA]"
            title="Cài đặt AI Agent"
          >
            <Settings2 className="h-3.5 w-3.5 text-[#C9A96E]" />
            <span className="hidden sm:inline">{aiLabel}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
