import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { createImageLoader } from "./imageLoader.js";
import {
  buildCurrentFaceQueue,
  buildVariantQueue,
} from "./preloadQueues.js";

function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

describe("createImageLoader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not start a second request for a URL that is already in flight", async () => {
    const first = deferred();
    const loadImage = vi.fn(() => first.promise);
    const loader = createImageLoader({ loadImage, concurrency: 2 });

    loader.schedule(["a.jpg", "a.jpg", "b.jpg"]);
    await Promise.resolve();

    expect(loadImage).toHaveBeenCalledTimes(2);
    expect(loadImage).toHaveBeenCalledWith("a.jpg");
    expect(loadImage).toHaveBeenCalledWith("b.jpg");

    first.resolve();
    await first.promise;
  });

  it("skips URLs that are already loaded when the queue is rebuilt", async () => {
    const loadImage = vi.fn((src) => Promise.resolve(src));
    const loader = createImageLoader({ loadImage, concurrency: 4 });

    loader.schedule(["a.jpg", "b.jpg"]);
    await vi.waitFor(() => expect(loader.isLoaded("a.jpg")).toBe(true));
    await vi.waitFor(() => expect(loader.isLoaded("b.jpg")).toBe(true));
    expect(loadImage).toHaveBeenCalledTimes(2);

    loader.schedule(["b.jpg", "c.jpg", "a.jpg"]);
    await vi.waitFor(() => expect(loader.isLoaded("c.jpg")).toBe(true));

    expect(loadImage).toHaveBeenCalledTimes(3);
    expect(loadImage).toHaveBeenLastCalledWith("c.jpg");
  });

  it("prioritize moves a URL ahead of the remaining queue", async () => {
    const gates = {
      a: deferred(),
      b: deferred(),
      c: deferred(),
    };
    const loadImage = vi.fn((src) => gates[src[0]].promise);
    const loader = createImageLoader({ loadImage, concurrency: 1 });

    loader.schedule(["a.jpg", "b.jpg", "c.jpg"]);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(1);
    expect(loadImage).toHaveBeenCalledWith("a.jpg");

    loader.prioritize("c.jpg");
    gates.a.resolve();
    await gates.a.promise;
    await Promise.resolve();
    await Promise.resolve();

    expect(loadImage).toHaveBeenCalledWith("c.jpg");
    expect(loadImage.mock.calls.map((c) => c[0])).toEqual([
      "a.jpg",
      "c.jpg",
    ]);

    gates.c.resolve();
    await gates.c.promise;
  });

  it("does not duplicate an in-flight request when the queue is rebuilt", async () => {
    const first = deferred();
    const loadImage = vi.fn((src) => {
      if (src === "a.jpg") return first.promise;
      return Promise.resolve(src);
    });
    const loader = createImageLoader({ loadImage, concurrency: 1 });

    loader.schedule(["a.jpg", "b.jpg"]);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(1);
    expect(loadImage).toHaveBeenCalledWith("a.jpg");

    loader.schedule(["a.jpg", "c.jpg"]);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(1);

    first.resolve();
    await first.promise;
    await vi.waitFor(() => expect(loader.isLoaded("c.jpg")).toBe(true));
    expect(loadImage).toHaveBeenCalledTimes(2);
    expect(loadImage).toHaveBeenLastCalledWith("c.jpg");
  });

  it("retries with backoff a fixed number of times, then marks failed", async () => {
    const loadImage = vi
      .fn()
      .mockRejectedValueOnce(new Error("fail 1"))
      .mockRejectedValueOnce(new Error("fail 2"))
      .mockRejectedValueOnce(new Error("fail 3"));

    const loader = createImageLoader({
      loadImage,
      concurrency: 1,
      maxAttempts: 3,
      backoffMs: () => 100,
    });

    const done = new Promise((resolve) => {
      loader.subscribe(() => {
        if (loader.isFailed("x.jpg")) resolve();
      });
    });

    loader.schedule(["x.jpg"]);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(1);

    await vi.advanceTimersByTimeAsync(100);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(2);

    await vi.advanceTimersByTimeAsync(100);
    await Promise.resolve();
    expect(loadImage).toHaveBeenCalledTimes(3);

    await done;
    expect(loader.isFailed("x.jpg")).toBe(true);
    expect(loader.isLoaded("x.jpg")).toBe(false);
  });

  it("notifies subscribers when a URL becomes ready (loaded or failed)", async () => {
    const loadImage = vi.fn((src) => Promise.resolve(src));
    const loader = createImageLoader({ loadImage, concurrency: 1 });
    const onReady = vi.fn();
    loader.subscribeReady(onReady);

    loader.schedule(["a.jpg"]);
    await vi.waitFor(() => expect(onReady).toHaveBeenCalledWith("a.jpg", "loaded"));
  });
});

describe("preloadQueues", () => {
  const cards = [
    { src: "0.jpg", srcs: ["0.jpg", "0b.jpg"] },
    { src: "1.jpg", srcs: ["1.jpg", "1b.jpg"] },
    { src: "2.jpg", srcs: ["2.jpg"] },
    { src: "3.jpg", srcs: ["3.jpg", "3b.jpg", "3c.jpg"] },
    { src: "4.jpg", srcs: ["4.jpg"] },
    { src: "5.jpg", srcs: ["5.jpg", "5b.jpg"] },
    { src: "6.jpg", srcs: ["6.jpg"] },
    { src: "7.jpg", srcs: ["7.jpg", "7b.jpg"] },
  ];

  it("builds current-face queue center-out, then remaining deck outward", () => {
    expect(buildCurrentFaceQueue(cards, 3)).toEqual([
      "3.jpg",
      "2.jpg",
      "4.jpg",
      "1.jpg",
      "5.jpg",
      "0.jpg",
      "6.jpg",
      "7.jpg",
    ]);
  });

  it("builds variant queue after current faces, skipping current srcs", () => {
    // For each card in center-out order, enqueue variants that are not the current src.
    expect(buildVariantQueue(cards, 3)).toEqual([
      "3b.jpg",
      "3c.jpg",
      "1b.jpg",
      "5b.jpg",
      "0b.jpg",
      "7b.jpg",
    ]);
  });

  it("phase-2 queue does not re-include URLs that were current faces", () => {
    const variants = buildVariantQueue(cards, 3);
    const currents = new Set(buildCurrentFaceQueue(cards, 3));
    for (const url of variants) {
      expect(currents.has(url)).toBe(false);
    }
  });
});

describe("pending flip resolution", () => {
  it("resolvePendingFlip flips when src becomes loaded", async () => {
    const { shouldFlipNow, markPending, clearPending, isPending } = (
      await import("./pendingFlip.js")
    ).createPendingFlipTracker();

    markPending("The Fool", "fool.jpg");
    expect(isPending("The Fool")).toBe(true);
    expect(
      shouldFlipNow("The Fool", "fool.jpg", { loaded: false, failed: false })
    ).toBe(false);
    expect(
      shouldFlipNow("The Fool", "fool.jpg", { loaded: true, failed: false })
    ).toBe(true);
    clearPending("The Fool");
    expect(isPending("The Fool")).toBe(false);
  });

  it("resolvePendingFlip also flips when src permanently failed", async () => {
    const { shouldFlipNow, markPending } = (
      await import("./pendingFlip.js")
    ).createPendingFlipTracker();

    markPending("Death", "death.jpg");
    expect(
      shouldFlipNow("Death", "death.jpg", { loaded: false, failed: true })
    ).toBe(true);
  });
});
