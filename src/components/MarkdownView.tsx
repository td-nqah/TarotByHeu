import React from 'react';

interface MarkdownViewProps {
  content: string;
}

function renderInline(text: string): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  const regex = /(\*\*[^*]+\*\*|\*[^*]+\*)/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith('**') && token.endsWith('**')) {
      parts.push(
        <strong key={key++} className="font-semibold text-[#E8D2A6]">
          {token.slice(2, -2)}
        </strong>
      );
    } else if (token.startsWith('*') && token.endsWith('*')) {
      parts.push(
        <em key={key++} className="italic text-[#D8D3C8]">
          {token.slice(1, -1)}
        </em>
      );
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

export const MarkdownView: React.FC<MarkdownViewProps> = ({ content }) => {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let listItems: React.ReactNode[] = [];
  let quoteLines: string[] = [];
  let key = 0;

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`list-${key++}`} className="my-2.5 space-y-1.5 pl-4 text-sm leading-relaxed text-[#D8D4CA]">
          {listItems}
        </ul>
      );
      listItems = [];
    }
  };

  const flushQuote = () => {
    if (quoteLines.length > 0) {
      elements.push(
        <blockquote
          key={`quote-${key++}`}
          className="my-3 rounded-lg border border-[#C9A96E]/25 bg-[#C9A96E]/[0.06] px-4 py-3 text-xs leading-relaxed text-[#E7DEC8]"
        >
          {quoteLines.map((q, idx) => (
            <p key={idx} className={idx > 0 ? 'mt-1.5' : ''}>
              {renderInline(q)}
            </p>
          ))}
        </blockquote>
      );
      quoteLines = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushList();
      flushQuote();
      continue;
    }

    if (line.startsWith('>')) {
      flushList();
      const cleaned = line.replace(/^>\s?/, '');
      if (cleaned) quoteLines.push(cleaned);
      continue;
    }

    flushQuote();

    if (line === '---') {
      flushList();
      elements.push(<hr key={`hr-${key++}`} className="my-4 border-white/10" />);
      continue;
    }

    if (line.startsWith('### ')) {
      flushList();
      elements.push(
        <h3
          key={`h3-${key++}`}
          className="mt-5 mb-2 font-serif text-base font-semibold tracking-tight text-[#F4F1EA] first:mt-0"
        >
          {renderInline(line.slice(4))}
        </h3>
      );
      continue;
    }

    if (line.startsWith('## ')) {
      flushList();
      elements.push(
        <h2
          key={`h2-${key++}`}
          className="mt-5 mb-2 font-serif text-lg font-semibold tracking-tight text-[#F4F1EA] first:mt-0"
        >
          {renderInline(line.slice(3))}
        </h2>
      );
      continue;
    }

    if (line.startsWith('- ') || line.startsWith('* ') || /^\d+\.\s/.test(line)) {
      const contentText = line.replace(/^(-|\*|\d+\.)\s+/, '');
      listItems.push(
        <li key={`li-${key++}`} className="relative pl-3 before:absolute before:top-2 before:left-0 before:h-1 before:w-1 before:rounded-full before:bg-[#C9A96E]/70">
          {renderInline(contentText)}
        </li>
      );
      continue;
    }

    flushList();
    elements.push(
      <p key={`p-${key++}`} className="my-2 text-sm leading-relaxed text-[#D8D4CA]">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushQuote();

  return <div className="tarot-prose">{elements}</div>;
};
