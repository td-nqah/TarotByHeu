export type ArcanaType = 'major' | 'minor';
export type SuitType = 'wands' | 'cups' | 'swords' | 'pentacles';

export interface TarotCard {
  id: number;
  slug: string;
  nameEn: string;
  nameVi: string;
  arcana: ArcanaType;
  suit: SuitType | null;
  number: number; // 0-21 for major, 1-14 for minor (1=Ace, 11=Page, 12=Knight, 13=Queen, 14=King)
  rank: string; // "0".."21" or "ace","02".."10","page","knight","queen","king"
  element: string;
  astro?: string;
  imagery?: string;
  image: string;
  upright: string[];
  reversed: string[];
  loveHint?: string;
  careerHint?: string;
  moneyHint?: string;
  adviceHint?: string;
  reflectionQuestion?: string;
  warning?: string;
}

export interface SpreadPosition {
  index: number;
  title: string;
  description: string;
}

export type SpreadLayout =
  | 'single'
  | 'row3'
  | 'grid4'
  | 'decision5'
  | 'relationship6'
  | 'celtic10';

export interface SpreadDefinition {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  cardCount: number;
  layout: SpreadLayout;
  positions: SpreadPosition[];
  sampleQuestions: string[];
  badge?: string;
}

export interface DrawnCard {
  card: TarotCard;
  position: SpreadPosition;
  isReversed: boolean;
  isRevealed: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface ReadingSession {
  id: string;
  createdAt: number;
  spreadId: string;
  spreadName: string;
  question: string;
  allowReversed: boolean;
  drawnCards: DrawnCard[];
  initialReading: string;
  messages: ChatMessage[];
}

export type AIMode = 'builtin' | 'gemini' | 'openai';

export interface AISettings {
  mode: AIMode;
  apiKey: string;
  model: string;
  baseUrl?: string;
}

export type AppView = 'reading' | 'library';
export type ReadingStage = 'topic' | 'draw' | 'result';
