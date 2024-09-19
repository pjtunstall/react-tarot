import Card from "./Card.js";

export function Carousel({
  cards,
  handleCardClick,
  theme,
  transitionDuration,
  sigil,
  setCards,
  flipAudioRef,
  isBlurred,
}) {
  return (
    <div className={`carousel ${theme} ${isBlurred ? "blurred" : ""}`}>
      {cards.slice(0, 7).map((card, index) => (
        <Card
          front={card.src}
          position={index}
          cardName={card.name}
          back={sigil.current}
          onClick={(event) =>
            handleCardClick(
              event,
              index,
              transitionDuration,
              setCards,
              flipAudioRef,
              isBlurred
            )
          }
          isFaceUp={card.isFaceUp}
          isAnimating={card.isAnimating}
          theme={theme}
          key={card.name}
        />
      ))}
    </div>
  );
}
