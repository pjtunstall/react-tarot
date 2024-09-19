import { moveCards } from "../card-actions/moveCards";
import { flipCard } from "../card-actions/flipCard";

export function handleKeyDown(
  event,
  isMoving,
  setIsMoving,
  setCards,
  flipAudioRef,
  transitionDuration,
  timeoutRef,
  isSpacePressed,
  setIsSpacePressed,
  isBlurred
) {
  event.preventDefault();
  event.stopPropagation();
  if (isBlurred || isMoving || isSpacePressed) return;
  if (event.code === "ArrowLeft") {
    timeoutRef.current = moveCards(
      1,
      setCards,
      setIsMoving,
      transitionDuration
    );
  } else if (event.code === "ArrowRight") {
    timeoutRef.current = moveCards(
      -1,
      setCards,
      setIsMoving,
      transitionDuration
    );
  } else if (event.code === "Space") {
    setIsSpacePressed(true);
    flipCard(setCards, 3, flipAudioRef, transitionDuration);
  }
}
