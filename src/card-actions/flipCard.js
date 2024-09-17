export function flipCard(
  setCards,
  indexToFlip,
  flipAudioRef,
  transitionDuration
) {
  const audioClone = flipAudioRef.current.cloneNode();
  audioClone.play();

  setCards((prevCards) =>
    prevCards.map((card, index) =>
      index === indexToFlip ? { ...card, isAnimating: true } : card
    )
  );

  setTimeout(() => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === indexToFlip
          ? { ...card, isAnimating: false, isFaceUp: !card.isFaceUp }
          : card
      )
    );
  }, transitionDuration);
}
