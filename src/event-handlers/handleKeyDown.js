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
  if (isMoving || isSpacePressed) return;
  if (isBlurred) {
    return;
  }
  if (event.code === "ArrowLeft") {
    event.preventDefault();
    event.stopPropagation();
    timeoutRef.current = moveCards(
      1,
      setCards,
      setIsMoving,
      transitionDuration
    );
  } else if (event.code === "ArrowRight") {
    event.preventDefault();
    event.stopPropagation();
    timeoutRef.current = moveCards(
      -1,
      setCards,
      setIsMoving,
      transitionDuration
    );
  } else if (event.code === "Space") {
    event.preventDefault();
    event.stopPropagation();
    setIsSpacePressed(true);
    flipCard(setCards, 3, flipAudioRef);
  }
}
