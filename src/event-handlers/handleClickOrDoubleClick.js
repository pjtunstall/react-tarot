import { flipAllCards } from "../card-actions/flipAllCards.js";
import { moveCards } from "../card-actions/moveCards.js";

export function handleClickOrDoubleClick(
  event,
  isMoving,
  clickCountRef,
  clickTimeoutRef,
  timeoutRef,
  transitionDuration,
  setCards,
  setIsMoving,
  flipAudioRef,
  isBlurred,
  setIsBlurred,
  setIsModalOpen,
  isTouchTap,
) {
  event.preventDefault();
  event.stopPropagation();
  if (isMoving) return;
  if (isBlurred) {
    setIsModalOpen(false);
    setIsBlurred(false);
    return;
  }

  clickCountRef.current += 1;

  if (clickCountRef.current === 1) {
    clickTimeoutRef.current = setTimeout(() => {
      if (clickCountRef.current === 1 && !isTouchTap) {
        // Single click action
        if (event.clientX < window.innerWidth / 2) {
          timeoutRef.current = moveCards(
            1,
            setCards,
            setIsMoving,
            transitionDuration,
          );
        } else {
          timeoutRef.current = moveCards(
            -1,
            setCards,
            setIsMoving,
            transitionDuration,
          );
        }
      }
      clickCountRef.current = 0;
    }, transitionDuration);
  } else if (clickCountRef.current === 2) {
    clearTimeout(clickTimeoutRef.current);
    // Double click action
    const audioClone = flipAudioRef.current.cloneNode();
    audioClone.play();

    setTimeout(() => {
      flipAllCards(setCards);
    }, 20);

    clickCountRef.current = 0;
  }
}
