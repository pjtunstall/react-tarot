# Image loading

- [Initial loading screen](#initial-loading-screen)
- [Background queue (center-out)](#background-queue-center-out)
- [Phase 2: alternate variants](#phase-2-alternate-variants)
- [Pending click (front not ready yet)](#pending-click-front-not-ready-yet)
- [Main modules](#main-modules)

Card faces are not all fetched before the app becomes interactive. Loading is split into an initial blocking batch and a background queue that follows how close each card is to the middle of the carousel.

## Initial loading screen

On startup the app shuffles the deck, then shows the loading screen until this batch finishes:

- the current front image for the first `INITIAL_PRELOAD_COUNT` cards (default **7**, the on-screen window)
- both sigil backs (light and dark), so a theme switch does not flash a missing back

Progress on the loading screen is measured against that batch only, not the whole deck.

`INITIAL_PRELOAD_COUNT` lives in [`src/helpers/useCardImagePreloader.js`](../src/helpers/useCardImagePreloader.js).

## Background queue (center-out)

After the loading screen clears, remaining **current** face images (`card.src`) are requested in center-out order from visible index `3`:

`3, 2, 4, 1, 5, 0, 6`, then further deck positions by the same distance rule.

Whenever the user rotates or shuffles the carousel, the queue is **rebuilt** from the new order. Work that is already loaded or already in flight is not started again. Deduplication is by image URL.

## Phase 2: alternate variants

Once every card’s current `src` has either loaded or permanently failed, the loader continues with the other URLs in each card’s `srcs`, still center-out, skipping any URL already fetched as a current face.

## Pending click (front not ready yet)

If the user clicks (or presses Space on) a face-down card whose front is not ready:

1. The card stays face-down.
2. A brief outline glow flare acknowledges the click.
3. A softer ongoing pulse shows that the front is still loading.
4. That URL is moved to the front of the preload queue.
5. When the image loads (or permanently fails), the card flips automatically.

Permanent failure uses a small number of background retries with backoff (never on every render). After that, the card still flips and the browser’s default broken-image indicator is shown on the front.

## Main modules

| Module | Role |
| --- | --- |
| [`src/helpers/imageLoader.js`](../src/helpers/imageLoader.js) | Shared loader: queue, in-flight/loaded/failed sets, retries |
| [`src/helpers/preloadQueues.js`](../src/helpers/preloadQueues.js) | Center-out ordering and batch/queue builders |
| [`src/helpers/pendingFlip.js`](../src/helpers/pendingFlip.js) | Pending-flip bookkeeping by card name |
| [`src/helpers/useCardImagePreloader.js`](../src/helpers/useCardImagePreloader.js) | React wiring: loading screen, background phases, flip requests |

Asset URLs are still collected eagerly in [`src/assets/assetImports.js`](../src/assets/assetImports.js); this system controls **when** those URLs are fetched and decoded, not which files Vite knows about.

Retry and permanent-failure behavior for the loader is covered in [`src/helpers/imageLoader.test.js`](../src/helpers/imageLoader.test.js).
