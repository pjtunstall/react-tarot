export function shuffleCards(shuffleAudioRef, setCards, transitionDuration) {
  const audioClone = shuffleAudioRef.current.cloneNode();
  audioClone.play();

  setCards((prevCards) => {
    const newCards = [...prevCards];

    for (let i = newCards.length - 1; i > 0; i--) {
      // Fisher-Yates shuffle algorithm.
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    return newCards.map((card) => ({
      ...card,
      src: card.srcs[Math.floor(Math.random() * card.srcs.length)],
      isFaceUp: false,
      isAnimating: true,
    }));
  });

  setTimeout(() => {
    setCards((prevCards) =>
      prevCards.map((card) => ({ ...card, isAnimating: false }))
    );
  }, transitionDuration);
}
