import React from 'react';
import { Clock, Trash2, X } from 'lucide-react';
import type { ReadingSession } from '../types/tarot';

interface HistoryDrawerProps {
  isOpen: boolean;
  sessions: ReadingSession[];
  onClose: () => void;
  onSelectSession: (session: ReadingSession) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  sessions,
  onClose,
  onSelectSession,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#131318] p-5 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h2 className="font-serif text-xl font-semibold text-[#F4F1EA]">Lịch sử trải bài</h2>
            <p className="text-xs text-[#9A968E]">Lưu cục bộ trên trình duyệt của bạn</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-[#0B0B0E] p-1.5 text-[#9A968E] hover:text-[#F4F1EA]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 flex-1 space-y-3 overflow-y-auto pr-1">
          {sessions.length === 0 ? (
            <div className="py-16 text-center text-sm text-[#8E8A82]">
              Chưa có lượt trải bài nào được lưu.
            </div>
          ) : (
            sessions.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  onSelectSession(s);
                  onClose();
                }}
                className="w-full rounded-xl border border-white/[0.08] bg-[#0B0B0E] p-3.5 text-left transition-colors hover:border-[#C9A96E]/50"
              >
                <div className="flex items-center justify-between gap-2 text-[11px] text-[#C9A96E]">
                  <span className="font-medium">{s.spreadName}</span>
                  <span className="flex items-center gap-1 text-[#8E8A82]">
                    <Clock className="h-3 w-3" />
                    {new Date(s.createdAt).toLocaleString('vi-VN', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
                <p className="mt-1.5 text-xs font-medium text-[#F4F1EA] line-clamp-2">
                  “{s.question}”
                </p>
                <p className="mt-1.5 text-[11px] text-[#9A968E] line-clamp-1">
                  {s.drawnCards.map((d) => d.card.nameVi).join(' · ')}
                </p>
              </button>
            ))
          )}
        </div>

        {sessions.length > 0 && (
          <div className="mt-4 border-t border-white/10 pt-3">
            <button
              type="button"
              onClick={onClearHistory}
              className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-red-400/20 bg-red-500/10 py-2 text-xs font-medium text-red-300 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Xóa toàn bộ lịch sử</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
