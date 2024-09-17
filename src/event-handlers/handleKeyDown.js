import { moveCards } from "../card-actions/moveCards";
import { handleCardClick } from "./handleCardClick";

export function handleKeyDown(
  event,
  isMoving,
  setIsMoving,
  isSpacePressed,
  setIsSpacePressed,
  setCards,
  flipAudioRef,
  transitionDuration,
  timeoutRef
) {
  event.preventDefault();
  if (event.code === "Space" && isSpacePressed) return;
  if (isMoving) return;
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
    handleCardClick(event, 3, transitionDuration, setCards, flipAudioRef);
  }
}
