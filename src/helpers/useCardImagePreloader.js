import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createImageLoader } from "./imageLoader.js";
import { createPendingFlipTracker } from "./pendingFlip.js";
import {
  buildCurrentFaceQueue,
  buildInitialBatch,
  buildVariantQueue,
} from "./preloadQueues.js";

export const INITIAL_PRELOAD_COUNT = 7;
export const CENTER_INDEX = 3;
/** Front `src` after permanent load failure so the browser shows its broken-image icon. */
export const FAILED_FRONT_SRC = "/__image-load-failed__.jpg";

/**
 * Owns the shared image loader, loading-screen gate, background queues,
 * and pending-flip acknowledgements when a front is not ready yet.
 */
export function useCardImagePreloader({
  cards,
  setCards,
  sigil_1,
  sigil_2,
  flipAudioRef,
}) {
  const loaderRef = useRef(null);
  if (!loaderRef.current) {
    loaderRef.current = createImageLoader({
      maxAttempts: 3,
      concurrency: 3,
    });
  }
  const loader = loaderRef.current;

  const pendingRef = useRef(null);
  if (!pendingRef.current) {
    pendingRef.current = createPendingFlipTracker();
  }
  const pending = pendingRef.current;

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const [pendingFlipNames, setPendingFlipNames] = useState([]);
  const [loadedVersion, setLoadedVersion] = useState(0);
  const initialBatchStarted = useRef(false);
  const phase2Started = useRef(false);

  const bumpPendingUi = useCallback(() => {
    setPendingFlipNames(pending.getPendingNames());
  }, [pending]);

  useEffect(() => {
    return loader.subscribe(() => {
      setLoadedVersion((v) => v + 1);
    });
  }, [loader]);

  // Initial loading-screen batch: first N fronts + both sigils.
  useEffect(() => {
    if (initialBatchStarted.current) return;
    initialBatchStarted.current = true;

    const batch = buildInitialBatch(
      cards,
      [sigil_1, sigil_2],
      INITIAL_PRELOAD_COUNT,
    );

    loader
      .loadBatch(batch, { onProgress: setLoadingProgress })
      .then(() => {
        setAreImagesLoaded(true);
      })
      .catch(() => {
        setAreImagesLoaded(true);
      });
    // Intentionally run once with the shuffled deck at mount time.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Background: current faces center-out; then variants once currents settle.
  useEffect(() => {
    if (!areImagesLoaded) return;

    const currentQueue = buildCurrentFaceQueue(cards, CENTER_INDEX);
    const allCurrentReady = currentQueue.every((src) => loader.isReady(src));

    if (!allCurrentReady) {
      phase2Started.current = false;
      loader.schedule(currentQueue);
      return;
    }

    if (!phase2Started.current) {
      phase2Started.current = true;
    }
    loader.schedule(buildVariantQueue(cards, CENTER_INDEX));
  }, [areImagesLoaded, cards, loader, loadedVersion]);

  // Auto-flip cards whose fronts became ready while pending.
  useEffect(() => {
    return loader.subscribeReady((src, status) => {
      const names = pending.getPendingNames();
      for (const name of names) {
        const pendingSrc = pending.getPendingSrc(name);
        if (pendingSrc !== src) continue;
        if (
          !pending.shouldFlipNow(name, src, {
            loaded: status === "loaded",
            failed: status === "failed",
          })
        ) {
          continue;
        }

        pending.clearPending(name);
        bumpPendingUi();

        const audioClone = flipAudioRef.current.cloneNode();
        audioClone.play();

        setCards((prevCards) =>
          prevCards.map((card) =>
            card.name === name ? { ...card, isFaceUp: true } : card,
          ),
        );
      }
    });
  }, [loader, pending, bumpPendingUi, setCards, flipAudioRef]);

  const requestCardFlip = useCallback(
    (index) => {
      const card = cards[index];
      if (!card) return;

      // Flipping face-down never needs the front image.
      if (card.isFaceUp) {
        const audioClone = flipAudioRef.current.cloneNode();
        audioClone.play();
        setCards((prevCards) =>
          prevCards.map((c, i) =>
            i === index ? { ...c, isFaceUp: false } : c,
          ),
        );
        return;
      }

      if (loader.isReady(card.src)) {
        const audioClone = flipAudioRef.current.cloneNode();
        audioClone.play();
        setCards((prevCards) =>
          prevCards.map((c, i) => (i === index ? { ...c, isFaceUp: true } : c)),
        );
        return;
      }

      // Front not ready: acknowledge, pulse, prioritize, flip when ready.
      pending.markPending(card.name, card.src);
      bumpPendingUi();
      loader.prioritize(card.src);
    },
    [cards, loader, pending, bumpPendingUi, setCards, flipAudioRef],
  );

  const isFrontLoaded = useCallback(
    (src) => loader.isLoaded(src),
    // loadedVersion forces recompute when loader state changes
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loader, loadedVersion],
  );

  const isFrontFailed = useCallback(
    (src) => loader.isFailed(src),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [loader, loadedVersion],
  );

  const pendingSet = useMemo(
    () => new Set(pendingFlipNames),
    [pendingFlipNames],
  );

  return {
    loadingProgress,
    areImagesLoaded,
    requestCardFlip,
    isFrontLoaded,
    isFrontFailed,
    isPendingFlip: (cardName) => pendingSet.has(cardName),
  };
}
