import type { AISettings, ReadingSession } from '../types/tarot';

const HISTORY_KEY = 'tarotbyheu_history_v1';
const SETTINGS_KEY = 'tarotbyheu_ai_settings_v1';

export const DEFAULT_AI_SETTINGS: AISettings = {
  mode: 'builtin',
  apiKey: '',
  model: 'gemini-2.5-flash',
  baseUrl: 'https://api.openai.com/v1',
};

export function loadHistory(): ReadingSession[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveHistory(sessions: ReadingSession[]): void {
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions.slice(0, 25)));
  } catch {
    // Ignore storage quota errors
  }
}

export function loadAISettings(): AISettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_AI_SETTINGS;
    return { ...DEFAULT_AI_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_AI_SETTINGS;
  }
}

export function saveAISettings(settings: AISettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    // Ignore storage quota errors
  }
}
