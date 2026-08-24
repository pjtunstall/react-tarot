function defaultLoadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(src);
    img.onerror = () => reject(new Error(`Failed to load ${src}`));
    img.src = src;
  });
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Priority image loader with URL-level dedupe, in-flight tracking,
 * bounded retries with backoff, and an ordered pending queue.
 */
export function createImageLoader({
  loadImage = defaultLoadImage,
  concurrency = 3,
  maxAttempts = 3,
  backoffMs = (attemptIndex) => 100 * 2 ** attemptIndex,
} = {}) {
  const loaded = new Set();
  const failed = new Set();
  const inFlight = new Set();
  const attemptCounts = new Map();
  let queue = [];
  let activeCount = 0;
  const listeners = new Set();
  const readyListeners = new Set();

  function notify() {
    for (const listener of listeners) {
      listener();
    }
  }

  function notifyReady(src, status) {
    for (const listener of readyListeners) {
      listener(src, status);
    }
  }

  function subscribe(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }

  function subscribeReady(listener) {
    readyListeners.add(listener);
    return () => readyListeners.delete(listener);
  }

  function isLoaded(src) {
    return loaded.has(src);
  }

  function isFailed(src) {
    return failed.has(src);
  }

  function isInFlight(src) {
    return inFlight.has(src);
  }

  function isReady(src) {
    return loaded.has(src) || failed.has(src);
  }

  function getStatus(src) {
    if (loaded.has(src)) return "loaded";
    if (failed.has(src)) return "failed";
    if (inFlight.has(src)) return "loading";
    if (queue.includes(src)) return "queued";
    return "idle";
  }

  function enqueueUnique(urls, { prepend = false } = {}) {
    const next = [];
    for (const src of urls) {
      if (!src) continue;
      if (loaded.has(src) || failed.has(src) || inFlight.has(src)) continue;
      if (queue.includes(src) || next.includes(src)) continue;
      next.push(src);
    }

    if (prepend) {
      queue = [...next, ...queue.filter((src) => !next.includes(src))];
    } else {
      const remaining = queue.filter((src) => !next.includes(src));
      queue = [...remaining, ...next];
    }
    pump();
  }

  /**
   * Replace the pending queue with a new priority order.
   * In-flight and already settled URLs are left alone; only not-yet-started
   * work is reordered.
   */
  function schedule(urls) {
    const next = [];
    for (const src of urls) {
      if (!src) continue;
      if (loaded.has(src) || failed.has(src) || inFlight.has(src)) continue;
      if (next.includes(src)) continue;
      next.push(src);
    }
    queue = next;
    pump();
  }

  function prioritize(src) {
    if (!src) return;
    if (loaded.has(src) || failed.has(src) || inFlight.has(src)) return;
    queue = [src, ...queue.filter((item) => item !== src)];
    pump();
  }

  function pump() {
    while (activeCount < concurrency && queue.length > 0) {
      const src = queue.shift();
      if (!src || loaded.has(src) || failed.has(src) || inFlight.has(src)) {
        continue;
      }
      startLoad(src);
    }
  }

  async function startLoad(src) {
    inFlight.add(src);
    activeCount += 1;
    notify();

    try {
      await loadImage(src);
      loaded.add(src);
      attemptCounts.delete(src);
      inFlight.delete(src);
      activeCount -= 1;
      notify();
      notifyReady(src, "loaded");
      pump();
    } catch {
      inFlight.delete(src);
      activeCount -= 1;
      const attempts = (attemptCounts.get(src) || 0) + 1;
      attemptCounts.set(src, attempts);

      if (attempts < maxAttempts) {
        notify();
        const wait = backoffMs(attempts - 1);
        await delay(wait);
        if (!loaded.has(src) && !failed.has(src) && !inFlight.has(src)) {
          queue = [src, ...queue.filter((item) => item !== src)];
        }
        pump();
      } else {
        failed.add(src);
        attemptCounts.delete(src);
        notify();
        notifyReady(src, "failed");
        pump();
      }
    }
  }

  /**
   * Load a finite batch (e.g. loading screen). Progress counts settled
   * attempts toward total; permanently failed URLs still count as done.
   */
  function loadBatch(urls, { onProgress } = {}) {
    const unique = [...new Set(urls.filter(Boolean))];
    const total = unique.length;
    let settled = 0;

    if (total === 0) {
      onProgress?.(100);
      return Promise.resolve();
    }

    const bump = () => {
      settled += 1;
      onProgress?.(Math.round((settled / total) * 100));
    };

    return Promise.all(
      unique.map(async (src) => {
        if (loaded.has(src)) {
          bump();
          return;
        }
        if (failed.has(src)) {
          bump();
          return;
        }

        // Wait until this URL is ready, scheduling it at high priority.
        prioritize(src);

        await new Promise((resolve) => {
          if (isReady(src)) {
            resolve();
            return;
          }
          const unsubscribe = subscribeReady((readySrc) => {
            if (readySrc === src) {
              unsubscribe();
              resolve();
            }
          });
          // Also poll via general subscribe in case it was already settling
          const unsub = subscribe(() => {
            if (isReady(src)) {
              unsub();
              unsubscribe();
              resolve();
            }
          });
        });
        bump();
      })
    );
  }

  return {
    schedule,
    prioritize,
    enqueueUnique,
    loadBatch,
    isLoaded,
    isFailed,
    isInFlight,
    isReady,
    getStatus,
    subscribe,
    subscribeReady,
  };
}
