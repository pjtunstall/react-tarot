import { moveCards } from "../card-actions/moveCards.js";

// Minimum horizontal travel (px) before a touch gesture counts as a swipe
// rather than a tap.
const SWIPE_THRESHOLD = 40;

export function handleTouchStart(event, touchStartRef, isSwipeRef) {
  const touch = event.touches[0];
  touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  isSwipeRef.current = false;
}

export function handleTouchMove(event, touchStartRef, isSwipeRef) {
  if (!touchStartRef.current) return;
  const touch = event.touches[0];
  const deltaX = touch.clientX - touchStartRef.current.x;
  const deltaY = touch.clientY - touchStartRef.current.y;

  if (
    Math.abs(deltaX) > SWIPE_THRESHOLD &&
    Math.abs(deltaX) > Math.abs(deltaY)
  ) {
    isSwipeRef.current = true;
  }
}

export function handleTouchEnd(
  event,
  touchStartRef,
  isSwipeRef,
  isTouchTapRef,
  isMoving,
  isBlurred,
  setCards,
  setIsMoving,
  transitionDuration,
  timeoutRef
) {
  const wasSwipe = isSwipeRef.current;
  // Recorded for the click event that the browser synthesizes right after
  // this touchend, so a plain tap can be told apart from a real mouse click.
  isTouchTapRef.current = !wasSwipe;
  isSwipeRef.current = false;

  if (!wasSwipe || !touchStartRef.current) return;

  // Stop the synthetic click that would otherwise follow this touchend, so
  // the swipe doesn't also trigger the click/tap handling below.
  event.preventDefault();

  if (isMoving || isBlurred) return;

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartRef.current.x;

  timeoutRef.current = moveCards(
    deltaX < 0 ? -1 : 1,
    setCards,
    setIsMoving,
    transitionDuration
  );
}
