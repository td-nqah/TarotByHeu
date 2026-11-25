import { useEffect, useState } from 'react';
import { AISettingsModal } from './components/AISettingsModal';
import { CardDeckDraw } from './components/CardDeckDraw';
import { CardDetailModal } from './components/CardDetailModal';
import { DeckLibrary } from './components/DeckLibrary';
import { Header } from './components/Header';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ReadingPanel } from './components/ReadingPanel';
import { SpreadBoard } from './components/SpreadBoard';
import { TopicSelector } from './components/TopicSelector';
import { SPREADS } from './data/spreads';
import { TAROT_DECK } from './data/tarotDeck';
import { drawOrientation, shuffleDeck } from './lib/shuffle';
import { loadAISettings, loadHistory, saveAISettings, saveHistory } from './lib/storage';
import { runFollowUpChat, runInitialReading } from './lib/tarotAgent';
import type {
  AISettings,
  AppView,
  ChatMessage,
  DrawnCard,
  ReadingSession,
  ReadingStage,
  SpreadDefinition,
  TarotCard,
} from './types/tarot';

export function App() {
  const [activeView, setActiveView] = useState<AppView>('reading');
  const [stage, setStage] = useState<ReadingStage>('topic');

  const [selectedSpread, setSelectedSpread] = useState<SpreadDefinition>(SPREADS[0]);
  const [question, setQuestion] = useState('');
  const [allowReversed, setAllowReversed] = useState(true);

  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>(() => shuffleDeck(TAROT_DECK));
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [drawnCards, setDrawnCards] = useState<DrawnCard[]>([]);

  const [initialReading, setInitialReading] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [fallbackNotice, setFallbackNotice] = useState<string | null>(null);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);

  const [history, setHistory] = useState<ReadingSession[]>(() => loadHistory());
  const [aiSettings, setAISettings] = useState<AISettings>(() => loadAISettings());
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const [inspectedCard, setInspectedCard] = useState<{
    card: TarotCard;
    isReversed?: boolean;
    positionTitle?: string;
  } | null>(null);

  // Persist history whenever changed
  useEffect(() => {
    saveHistory(history);
  }, [history]);

  const handleStartReading = () => {
    setShuffledDeck(shuffleDeck(TAROT_DECK));
    setSelectedIndices([]);
    setDrawnCards([]);
    setInitialReading('');
    setMessages([]);
    setFallbackNotice(null);
    setActiveSessionId(null);
    setStage('draw');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleReshuffle = () => {
    setShuffledDeck(shuffleDeck(TAROT_DECK));
    setSelectedIndices([]);
  };

  const handleTogglePickCard = (deckIdx: number) => {
    setSelectedIndices((prev) => {
      if (prev.includes(deckIdx)) {
        return prev.filter((i) => i !== deckIdx);
      }
      if (prev.length >= selectedSpread.cardCount) return prev;
      return [...prev, deckIdx];
    });
  };

  const handleAutoPickRemaining = () => {
    const needed = selectedSpread.cardCount - selectedIndices.length;
    if (needed <= 0) return;

    const availableIndices: number[] = [];
    for (let i = 0; i < shuffledDeck.length; i++) {
      if (!selectedIndices.includes(i)) availableIndices.push(i);
    }

    // Use crypto random selection among remaining indices
    const picked: number[] = [];
    const pool = [...availableIndices];
    const randBuf = new Uint32Array(1);
    for (let k = 0; k < needed && pool.length > 0; k++) {
      window.crypto.getRandomValues(randBuf);
      const r = randBuf[0] % pool.length;
      picked.push(pool[r]);
      pool.splice(r, 1);
    }

    setSelectedIndices((prev) => [...prev, ...picked]);
  };

  const handleConfirmDraw = () => {
    if (selectedIndices.length !== selectedSpread.cardCount) return;

    const drawn: DrawnCard[] = selectedIndices.map((deckIdx, posIdx) => ({
      card: shuffledDeck[deckIdx],
      position: selectedSpread.positions[posIdx],
      isReversed: drawOrientation(allowReversed),
      isRevealed: false,
    }));

    setDrawnCards(drawn);
    setInitialReading('');
    setMessages([]);
    setFallbackNotice(null);
    setActiveSessionId(null);
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerInitialReading = async (cardsToRead: DrawnCard[]) => {
    if (isGenerating || initialReading) return;
    setIsGenerating(true);
    setFallbackNotice(null);

    const effectiveQuestion = question.trim() || selectedSpread.sampleQuestions[0];
    const res = await runInitialReading(selectedSpread, effectiveQuestion, cardsToRead, aiSettings);

    setInitialReading(res.content);
    if (res.usedFallback && res.fallbackReason) {
      setFallbackNotice(
        `Không kết nối được AI ngoài (${res.fallbackReason}). Đã tự động dùng Agent Nội bộ để không gián đoạn trải bài.`
      );
    }

    const newSessionId = `session-${Date.now()}`;
    setActiveSessionId(newSessionId);
    const session: ReadingSession = {
      id: newSessionId,
      createdAt: Date.now(),
      spreadId: selectedSpread.id,
      spreadName: selectedSpread.name,
      question: effectiveQuestion,
      allowReversed,
      drawnCards: cardsToRead,
      initialReading: res.content,
      messages: [],
    };
    setHistory((prev) => [session, ...prev]);
    setIsGenerating(false);
  };

  const handleRevealCard = (posIdx: number) => {
    setDrawnCards((prev) => {
      const next = prev.map((d) =>
        d.position.index === posIdx ? { ...d, isRevealed: true } : d
      );
      if (next.every((d) => d.isRevealed) && !initialReading) {
        void triggerInitialReading(next);
      }
      return next;
    });
  };

  const handleRevealAll = () => {
    setDrawnCards((prev) => {
      const next = prev.map((d) => ({ ...d, isRevealed: true }));
      if (!initialReading) {
        void triggerInitialReading(next);
      }
      return next;
    });
  };

  const handleSendFollowUp = async (text: string) => {
    if (isGenerating || !initialReading) return;

    const userMsg: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };
    const nextHistory = [...messages, userMsg];
    setMessages(nextHistory);
    setIsGenerating(true);

    const effectiveQuestion = question.trim() || selectedSpread.sampleQuestions[0];
    const res = await runFollowUpChat(
      text,
      selectedSpread,
      effectiveQuestion,
      drawnCards,
      initialReading,
      messages,
      aiSettings
    );

    if (res.usedFallback && res.fallbackReason) {
      setFallbackNotice(
        `Không kết nối được AI ngoài (${res.fallbackReason}). Đã dùng Agent Nội bộ phản hồi.`
      );
    }

    const assistantMsg: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      content: res.content,
      timestamp: Date.now(),
    };
    const finalMessages = [...nextHistory, assistantMsg];
    setMessages(finalMessages);

    if (activeSessionId) {
      setHistory((prev) =>
        prev.map((s) => (s.id === activeSessionId ? { ...s, messages: finalMessages } : s))
      );
    }
    setIsGenerating(false);
  };

  const handleRestoreSession = (session: ReadingSession) => {
    const foundSpread = SPREADS.find((sp) => sp.id === session.spreadId) ?? SPREADS[0];
    setActiveView('reading');
    setSelectedSpread(foundSpread);
    setQuestion(session.question);
    setAllowReversed(session.allowReversed);
    setDrawnCards(session.drawnCards.map((d) => ({ ...d, isRevealed: true })));
    setInitialReading(session.initialReading);
    setMessages(session.messages);
    setActiveSessionId(session.id);
    setFallbackNotice(null);
    setStage('result');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoHome = () => {
    setActiveView('reading');
    setStage('topic');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveSettings = (next: AISettings) => {
    setAISettings(next);
    saveAISettings(next);
  };

  const allRevealed = drawnCards.length > 0 && drawnCards.every((d) => d.isRevealed);

  return (
    <div className="ambient-glow min-h-screen bg-[#0B0B0E] text-[#F4F1EA]">
      <Header
        activeView={activeView}
        onSelectView={setActiveView}
        onGoHome={handleGoHome}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        historyCount={history.length}
        aiSettings={aiSettings}
      />

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-10">
        {activeView === 'library' ? (
          <DeckLibrary
            onSelectCard={(card) => setInspectedCard({ card })}
          />
        ) : stage === 'topic' ? (
          <TopicSelector
            spreads={SPREADS}
            selectedSpread={selectedSpread}
            onSelectSpread={(spread) => {
              setSelectedSpread(spread);
              setQuestion('');
            }}
            question={question}
            onChangeQuestion={setQuestion}
            allowReversed={allowReversed}
            onToggleReversed={setAllowReversed}
            onStartReading={handleStartReading}
          />
        ) : stage === 'draw' ? (
          <CardDeckDraw
            spread={selectedSpread}
            question={question}
            shuffledDeck={shuffledDeck}
            selectedIndices={selectedIndices}
            onTogglePickCard={handleTogglePickCard}
            onReshuffle={handleReshuffle}
            onAutoPickRemaining={handleAutoPickRemaining}
            onConfirmDraw={handleConfirmDraw}
            onBack={() => setStage('topic')}
          />
        ) : (
          <div className="space-y-6">
            <SpreadBoard
              spread={selectedSpread}
              drawnCards={drawnCards}
              onRevealCard={handleRevealCard}
              onRevealAll={handleRevealAll}
              onInspectCard={(drawn) =>
                setInspectedCard({
                  card: drawn.card,
                  isReversed: drawn.isReversed,
                  positionTitle: drawn.position.title,
                })
              }
            />

            <ReadingPanel
              allRevealed={allRevealed}
              isGenerating={isGenerating}
              initialReading={initialReading}
              messages={messages}
              fallbackNotice={fallbackNotice}
              aiSettings={aiSettings}
              onSendFollowUp={handleSendFollowUp}
              onNewReading={handleGoHome}
            />
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-white/[0.06] py-6 text-center text-xs text-[#7D7972]">
        <p>TarotByHeu · Bộ bài 78 lá Rider-Waite-Smith · Công cụ chiêm nghiệm và phản chiếu bản thân</p>
      </footer>

      <CardDetailModal
        card={inspectedCard?.card ?? null}
        isReversed={inspectedCard?.isReversed}
        positionTitle={inspectedCard?.positionTitle}
        onClose={() => setInspectedCard(null)}
      />

      <HistoryDrawer
        isOpen={isHistoryOpen}
        sessions={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelectSession={handleRestoreSession}
        onClearHistory={() => setHistory([])}
      />

      <AISettingsModal
        isOpen={isSettingsOpen}
        settings={aiSettings}
        onSave={handleSaveSettings}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
