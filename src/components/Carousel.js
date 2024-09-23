import { useContext } from "react";

import Card from "./Card.js";
import { ThemeContext } from "./ThemeContext.js";

export function Carousel({
  cards,
  handleCardClick,
  transitionDuration,
  sigil,
  setCards,
  flipAudioRef,
  isBlurred,
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
              isBlurred
            )
          }
          isFaceUp={card.isFaceUp}
          isAnimating={card.isAnimating}
          key={card.name}
        />
      ))}
    </div>
  );
}
