export function flipCard(setCards, indexToFlip, flipAudioRef) {
  const audioClone = flipAudioRef.current.cloneNode();
  audioClone.play();

  setCards((prevCards) =>
    prevCards.map((card, index) =>
      index === indexToFlip ? { ...card, isFaceUp: !card.isFaceUp } : card
    )
  );
}
