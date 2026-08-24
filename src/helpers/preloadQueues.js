/**
 * Order deck indices by distance from the visible center (index 3 by default).
 * At equal distance, left (lower index) comes before right.
 * Indices beyond the visible window continue outward by absolute distance.
 */
export function getCenterOutIndices(length, centerIndex = 3) {
  return Array.from({ length }, (_, index) => index).sort((a, b) => {
    const da = Math.abs(a - centerIndex);
    const db = Math.abs(b - centerIndex);
    if (da !== db) return da - db;
    return a - b;
  });
}

export function buildCurrentFaceQueue(cards, centerIndex = 3) {
  return getCenterOutIndices(cards.length, centerIndex).map(
    (index) => cards[index].src
  );
}

export function buildVariantQueue(cards, centerIndex = 3) {
  const urls = [];
  for (const index of getCenterOutIndices(cards.length, centerIndex)) {
    const card = cards[index];
    for (const src of card.srcs) {
      if (src !== card.src) {
        urls.push(src);
      }
    }
  }
  return urls;
}

export function buildInitialBatch(cards, sigils, initialCount) {
  const fronts = cards.slice(0, initialCount).map((card) => card.src);
  return [...fronts, ...sigils];
}
