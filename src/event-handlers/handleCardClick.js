import { flipCard } from "../card-actions/flipCard";

export function handleCardClick(
  event,
  indexToFlip,
  transitionDuration,
  setCards,
  flipAudioRef,
  isBlurred,
  requestCardFlip
) {
  event.preventDefault();
  event.stopPropagation();
  if (isBlurred) return;
  if (requestCardFlip) {
    requestCardFlip(indexToFlip);
    return;
  }
  flipCard(setCards, indexToFlip, flipAudioRef);
}
