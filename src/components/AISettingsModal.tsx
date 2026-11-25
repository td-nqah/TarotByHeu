import React, { useState } from 'react';
import { Check, KeyRound, X } from 'lucide-react';
import type { AIMode, AISettings } from '../types/tarot';

interface AISettingsModalProps {
  isOpen: boolean;
  settings: AISettings;
  onSave: (next: AISettings) => void;
  onClose: () => void;
}

export const AISettingsModal: React.FC<AISettingsModalProps> = ({
  isOpen,
  settings,
  onSave,
  onClose,
}) => {
  const [draft, setDraft] = useState<AISettings>(settings);

  if (!isOpen) return null;

  const modes: { id: AIMode; title: string; desc: string }[] = [
    {
      id: 'builtin',
      title: 'Agent Nội bộ (Mặc định)',
      desc: 'Hoạt động ngay không cần API key, áp dụng đầy đủ cơ sở tri thức 78 lá và quy tắc tổ hợp.',
    },
    {
      id: 'gemini',
      title: 'Google Gemini API',
      desc: 'Dùng API key Gemini cá nhân để luận giải linh hoạt sâu theo ngữ cảnh hội thoại.',
    },
    {
      id: 'openai',
      title: 'OpenAI / Tương thích',
      desc: 'Kết nối OpenAI hoặc endpoint tương thích chuẩn Chat Completions.',
    },
  ];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(draft);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <form
        onSubmit={handleSave}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-white/15 bg-[#131318] p-5 shadow-2xl sm:p-6"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-[#C9A96E]" />
            <h2 className="font-serif text-xl font-semibold text-[#F4F1EA]">
              Cài đặt AI Tarot Agent
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-white/10 bg-[#0B0B0E] p-1.5 text-[#9A968E] hover:text-[#F4F1EA]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() =>
                setDraft((prev) => ({
                  ...prev,
                  mode: m.id,
                  model:
                    m.id === 'gemini'
                      ? prev.model.includes('gemini')
                        ? prev.model
                        : 'gemini-2.5-flash'
                      : m.id === 'openai'
                      ? prev.model.includes('gpt')
                        ? prev.model
                        : 'gpt-4o-mini'
                      : prev.model,
                }))
              }
              className={`w-full rounded-xl border p-3.5 text-left transition-colors ${
                draft.mode === m.id
                  ? 'border-[#C9A96E]/65 bg-[#C9A96E]/10'
                  : 'border-white/[0.08] bg-[#0B0B0E] hover:border-white/20'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[#F4F1EA]">{m.title}</span>
                {draft.mode === m.id && <Check className="h-4 w-4 text-[#C9A96E]" />}
              </div>
              <p className="mt-1 text-xs text-[#9A968E]">{m.desc}</p>
            </button>
          ))}
        </div>

        {draft.mode !== 'builtin' && (
          <div className="mt-4 space-y-3 border-t border-white/10 pt-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-[#D8D4CA]">API Key</label>
              <input
                type="password"
                value={draft.apiKey}
                onChange={(e) => setDraft({ ...draft, apiKey: e.target.value })}
                placeholder={draft.mode === 'gemini' ? 'AIza...' : 'sk-...'}
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0E] px-3.5 py-2 text-xs text-[#F4F1EA] focus:border-[#C9A96E]/60 focus:outline-none"
              />
              <p className="mt-1 text-[11px] text-[#8E8A82]">
                Key chỉ được lưu trên trình duyệt của bạn (localStorage) và gọi trực tiếp từ trình duyệt.
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-[#D8D4CA]">Model</label>
              <input
                type="text"
                value={draft.model}
                onChange={(e) => setDraft({ ...draft, model: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-[#0B0B0E] px-3.5 py-2 text-xs text-[#F4F1EA] focus:border-[#C9A96E]/60 focus:outline-none"
              />
            </div>

            {draft.mode === 'openai' && (
              <div>
                <label className="mb-1 block text-xs font-medium text-[#D8D4CA]">
                  Base URL (tùy chọn)
                </label>
                <input
                  type="text"
                  value={draft.baseUrl ?? ''}
                  onChange={(e) => setDraft({ ...draft, baseUrl: e.target.value })}
                  placeholder="https://api.openai.com/v1"
                  className="w-full rounded-xl border border-white/10 bg-[#0B0B0E] px-3.5 py-2 text-xs text-[#F4F1EA] focus:border-[#C9A96E]/60 focus:outline-none"
                />
              </div>
            )}
          </div>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-white/10 px-4 py-2 text-xs font-medium text-[#D8D4CA] hover:bg-white/5"
          >
            Hủy
          </button>
          <button
            type="submit"
            className="rounded-xl bg-[#C9A96E] px-5 py-2 text-xs font-semibold text-[#0B0B0E] hover:bg-[#D8B97F]"
          >
            Lưu cài đặt
          </button>
        </div>
      </form>
    </div>
  );
};
