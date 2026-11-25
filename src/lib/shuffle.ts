import type { TarotCard } from '../types/tarot';

/**
 * Cryptographically unbiased integer in [0, maxExclusive).
 */
function secureRandomInt(maxExclusive: number): number {
  if (maxExclusive <= 0) return 0;
  const array = new Uint32Array(1);
  const limit = Math.floor(0x100000000 / maxExclusive) * maxExclusive;
  let value: number;
  do {
    window.crypto.getRandomValues(array);
    value = array[0];
  } while (value >= limit);
  return value % maxExclusive;
}

/**
 * Fisher-Yates shuffle using window.crypto.getRandomValues (KB 6.2).
 */
export function shuffleDeck(deck: TarotCard[]): TarotCard[] {
  const copy = [...deck];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = secureRandomInt(i + 1);
    const temp = copy[i];
    copy[i] = copy[j];
    copy[j] = temp;
  }
  return copy;
}

/**
 * Determine upright/reversed orientation with 50% probability when enabled.
 */
export function drawOrientation(allowReversed: boolean): boolean {
  if (!allowReversed) return false;
  return secureRandomInt(2) === 1;
}
