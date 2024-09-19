import { flipCard } from "../card-actions/flipCard";

export function handleCardClick(
  event,
  indexToFlip,
  transitionDuration,
  setCards,
  flipAudioRef,
  isBlurred
) {
  event.preventDefault();
  event.stopPropagation();
  if (isBlurred) return;
  flipCard(setCards, indexToFlip, flipAudioRef, transitionDuration);
}
