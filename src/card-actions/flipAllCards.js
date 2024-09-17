export function flipAllCards(setCards) {
  setCards((prevCards) => {
    const areAllFaceUp = prevCards.every((card) => card.isFaceUp);
    const newFaceUpState = !areAllFaceUp;

    return prevCards.map((card) => ({
      ...card,
      isFaceUp: newFaceUpState,
      isAnimating: card.isFaceUp !== newFaceUpState,
    }));
  });
}
