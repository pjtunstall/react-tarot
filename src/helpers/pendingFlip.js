export function createPendingFlipTracker() {
  const pendingByName = new Map();

  function markPending(cardName, src) {
    pendingByName.set(cardName, src);
  }

  function clearPending(cardName) {
    pendingByName.delete(cardName);
  }

  function isPending(cardName) {
    return pendingByName.has(cardName);
  }

  function getPendingSrc(cardName) {
    return pendingByName.get(cardName);
  }

  function shouldFlipNow(cardName, src, { loaded, failed }) {
    if (!pendingByName.has(cardName)) return false;
    if (pendingByName.get(cardName) !== src) return false;
    return Boolean(loaded || failed);
  }

  function getPendingNames() {
    return [...pendingByName.keys()];
  }

  return {
    markPending,
    clearPending,
    isPending,
    getPendingSrc,
    shouldFlipNow,
    getPendingNames,
  };
}
