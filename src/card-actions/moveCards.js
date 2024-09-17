export function moveCards(
  direction,
  setCards,
  setIsMoving,
  transitionDuration
) {
  setIsMoving(true);
  setCards((prevCards) => {
    const newCards = [...prevCards];
    if (direction > 0) {
      const lastCard = newCards.pop();
      newCards.unshift(lastCard);
    } else {
      const firstCard = newCards.shift();
      newCards.push(firstCard);
    }
    return newCards;
  });

  return setTimeout(() => {
    setIsMoving(false);
  }, transitionDuration);
}
