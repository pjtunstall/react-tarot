import { flipCard } from "../card-actions/flipCard";

export function handleCardClick(
  event,
  indexToFlip,
  transitionDuration,
  setCards,
  flipAudioRef
) {
  event.preventDefault();
  event.stopPropagation();
  flipCard(setCards, indexToFlip, flipAudioRef, transitionDuration);
}
