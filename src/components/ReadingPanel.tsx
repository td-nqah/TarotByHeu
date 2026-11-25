import React, { useState } from 'react';
import { Bot, Loader2, RefreshCw, Send, Sparkles } from 'lucide-react';
import type { AISettings, ChatMessage } from '../types/tarot';
import { MarkdownView } from './MarkdownView';

interface ReadingPanelProps {
  allRevealed: boolean;
  isGenerating: boolean;
  initialReading: string;
  messages: ChatMessage[];
  fallbackNotice: string | null;
  aiSettings: AISettings;
  onSendFollowUp: (text: string) => void;
  onNewReading: () => void;
}

const QUICK_PROMPTS = [
  'Giải thích sâu hơn về tổ hợp bài này',
  'Hành động cụ thể tuần này mình nên làm là gì?',
  'Ý nghĩa lá ngược trong trải bài này thế nào?',
  'Ước lượng khung thời gian theo quy ước?',
];

export const ReadingPanel: React.FC<ReadingPanelProps> = ({
  allRevealed,
  isGenerating,
  initialReading,
  messages,
  fallbackNotice,
  aiSettings,
  onSendFollowUp,
  onNewReading,
}) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (!trimmed || isGenerating) return;
    onSendFollowUp(trimmed);
    setInput('');
  };

  const engineLabel =
    aiSettings.mode === 'builtin' || !aiSettings.apiKey.trim()
      ? 'TarotByHeu Agent (Nội bộ)'
      : aiSettings.mode === 'gemini'
      ? `Gemini · ${aiSettings.model || 'gemini-2.5-flash'}`
      : `OpenAI · ${aiSettings.model || 'gpt-4o-mini'}`;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#131318] p-5 sm:p-6">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#C9A96E]/40 bg-[#C9A96E]/10 text-[#C9A96E]">
            <Bot className="h-4 w-4" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-medium text-[#F4F1EA]">
              Luận giải từ AI Agent
            </h3>
            <p className="text-[11px] text-[#9A968E]">{engineLabel}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={onNewReading}
          className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#0B0B0E] px-3.5 py-2 text-xs font-medium text-[#D8D4CA] transition-colors hover:border-[#C9A96E]/40 hover:text-[#F4F1EA]"
        >
          <RefreshCw className="h-3.5 w-3.5 text-[#C9A96E]" />
          <span>Trải bài mới</span>
        </button>
      </div>

      {!allRevealed ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-[#0B0B0E]/60 px-4 py-10 text-center">
          <Sparkles className="mb-2 h-6 w-6 text-[#C9A96E]/80" />
          <p className="font-serif text-base text-[#F4F1EA]">
            Hãy lật toàn bộ các lá bài phía trên để bắt đầu luận giải
          </p>
          <p className="mt-1 text-xs text-[#9A968E]">
            Bạn có thể chạm từng lá để cảm nhận trước hoặc bấm “Lật tất cả lá bài”.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {fallbackNotice && (
            <div className="rounded-xl border border-amber-400/25 bg-amber-400/10 px-4 py-2.5 text-xs text-amber-200">
              {fallbackNotice}
            </div>
          )}

          {isGenerating && !initialReading ? (
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-[#0B0B0E] px-4 py-6 text-sm text-[#D8D4CA]">
              <Loader2 className="h-4 w-4 animate-spin text-[#C9A96E]" />
              <span>AI Agent đang kết nối ý nghĩa các lá bài theo câu hỏi của bạn...</span>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.06] bg-[#0B0B0E]/70 p-4 sm:p-5">
              <MarkdownView content={initialReading} />
            </div>
          )}

          {/* Follow-up conversation */}
          {messages.length > 0 && (
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <p className="text-[11px] font-medium tracking-wider text-[#9A968E] uppercase">
                Trao đổi thêm cùng Agent
              </p>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`rounded-xl px-4 py-3 text-sm ${
                    msg.role === 'user'
                      ? 'ml-auto max-w-[85%] border border-[#C9A96E]/30 bg-[#C9A96E]/10 text-[#F4F1EA]'
                      : 'border border-white/[0.06] bg-[#0B0B0E]/70 text-[#D8D4CA]'
                  }`}
                >
                  {msg.role === 'user' ? (
                    <p>{msg.content}</p>
                  ) : (
                    <MarkdownView content={msg.content} />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Quick prompts + Chat input */}
          {initialReading && (
            <div className="space-y-3 border-t border-white/[0.06] pt-4">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_PROMPTS.map((q) => (
                  <button
                    key={q}
                    type="button"
                    disabled={isGenerating}
                    onClick={() => onSendFollowUp(q)}
                    className="rounded-full border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-[11px] text-[#C8C3B8] transition-colors hover:border-[#C9A96E]/40 hover:text-[#F4F1EA] disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>

              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={isGenerating}
                  placeholder="Hỏi thêm về một lá bài, hành động cụ thể, hoặc góc nhìn khác..."
                  className="flex-1 rounded-xl border border-white/[0.1] bg-[#0B0B0E] px-4 py-2.5 text-sm text-[#F4F1EA] placeholder-[#6B6760] focus:border-[#C9A96E]/60 focus:outline-none disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isGenerating || !input.trim()}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#C9A96E] px-4 py-2.5 text-xs font-semibold text-[#0B0B0E] transition-colors hover:bg-[#D8B97F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  <span className="hidden sm:inline">Gửi</span>
                </button>
              </form>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
