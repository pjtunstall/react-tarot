import { useContext } from "react";

import Card from "./Card.jsx";
import { ThemeContext } from "./ThemeContext.jsx";

export function Carousel({
  cards,
  handleCardClick,
  transitionDuration,
  sigil,
  setCards,
  flipAudioRef,
  isBlurred,
  requestCardFlip,
  isPendingFlip,
  isFrontLoaded,
  isFrontFailed,
}) {
  const { theme } = useContext(ThemeContext);

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
              isBlurred,
              requestCardFlip
            )
          }
          isFaceUp={card.isFaceUp}
          isAnimating={card.isAnimating}
          isPendingFlip={isPendingFlip?.(card.name)}
          isFrontLoaded={isFrontLoaded?.(card.src)}
          isFrontFailed={isFrontFailed?.(card.src)}
          key={card.name}
        />
      ))}
    </div>
  );
}
