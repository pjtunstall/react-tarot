import React, { useEffect, useCallback, useRef, useState } from "react";

import "./App.css";

import Card from "./Card.js";

import { importedCards, sigils, sfx } from "./assets.js";

function App() {
  const appRef = useRef(null);
  const timeoutRef = useRef(null);
  const transitionDuration = 300;
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);

  const [sigil_1, sigil_2] = sigils;
  const [cockSound, flipSound, owlSound, shuffleSound] = sfx;

  useEffect(() => {
    appRef.current.focus();
  }, []);

  const initialCards = importedCards.map((src, index) => ({
    src,
    name: [
      "The Sun",
      "Judgement",
      "The World",
      "The Fool",
      "The Magician",
      "The High Priestess",
      "The Emperor",
      "The Empress",
      "The Hierophant",
      "The Lovers",
      "The Chariot",
      "Justice",
      "The Hermit",
      "Fortune",
      "Strength",
      "The Hanged Man",
      "Death",
      "Temperance",
      "The Devil",
      "The Tower",
      "The Star",
      "The Moon",
    ][index],
    isFaceUp: false,
    isAnimating: false,
  }));

  const [theme, setTheme] = useState("dark-theme");

  const [cards, setCards] = useState(initialCards);
  const [isMoving, setIsMoving] = useState(false);

  const sigil = useRef(theme === "light-theme" ? sigil_1 : sigil_2);

  const cockAudioRef = useRef(new Audio(cockSound));
  const flipAudioRef = useRef(new Audio(flipSound));
  const owlAudioRef = useRef(new Audio(owlSound));
  const shuffleAudioRef = useRef(new Audio(shuffleSound));

  const moveCards = useCallback((direction) => {
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

    timeoutRef.current = setTimeout(() => {
      setIsMoving(false);
    }, transitionDuration);
  }, []);

  const handleCardClick = useCallback((event, i) => {
    event.preventDefault();
    event.stopPropagation();

    const audioClone = flipAudioRef.current.cloneNode();
    audioClone.play();

    setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card, index) =>
          index === i
            ? { ...card, isFaceUp: !card.isFaceUp, isAnimating: true }
            : card
        )
      );
      setTimeout(() => {
        setCards((prevCards) =>
          prevCards.map((card, index) =>
            index === i ? { ...card, isAnimating: false } : card
          )
        );
      }, transitionDuration);
    }, 20);
  }, []);

  const handleClickOrDoubleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (isMoving) return;

      clickCountRef.current += 1;

      if (clickCountRef.current === 1) {
        clickTimeoutRef.current = setTimeout(() => {
          if (clickCountRef.current === 1) {
            // Single click action
            if (event.clientX < window.innerWidth / 2) {
              moveCards(1);
            } else {
              moveCards(-1);
            }
          }
          clickCountRef.current = 0;
        }, transitionDuration);
      } else if (clickCountRef.current === 2) {
        clearTimeout(clickTimeoutRef.current);
        // Double click action
        const audioClone = flipAudioRef.current.cloneNode();
        audioClone.play();

        setTimeout(() => {
          setCards((prevCards) => {
            const areAllFaceUp = prevCards.every((card) => card.isFaceUp);
            const newFaceUpState = !areAllFaceUp;

            return prevCards.map((card) => ({
              ...card,
              isFaceUp: newFaceUpState,
              isAnimating: card.isFaceUp !== newFaceUpState,
            }));
          });

          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, isAnimating: false }))
            );
          }, transitionDuration);
        }, 20);

        clickCountRef.current = 0;
      }
    },
    [isMoving, moveCards]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      event.preventDefault();
      if (isMoving) return;
      if (event.code === "ArrowLeft") {
        moveCards(1);
      } else if (event.code === "ArrowRight") {
        moveCards(-1);
      }
    },
    [moveCards, isMoving]
  );

  const shuffleCards = useCallback(() => {
    const audioClone = shuffleAudioRef.current.cloneNode();
    audioClone.play();

    setCards((prevCards) => {
      // Create a copy of the cards array
      const newCards = [...prevCards];

      // Fisher-Yates shuffle algorithm
      for (let i = newCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
      }

      // Set all cards to face down and animate
      return newCards.map((card) => ({
        ...card,
        isFaceUp: false,
        isAnimating: true,
      }));
    });

    // Reset animation state after transition
    setTimeout(() => {
      setCards((prevCards) =>
        prevCards.map((card) => ({ ...card, isAnimating: false }))
      );
    }, 300);
  }, []);

  useEffect(() => {
    shuffleCards();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shuffleCards]);

  return (
    <div
      className="App"
      ref={appRef}
      onClick={handleClickOrDoubleClick}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <audio ref={flipAudioRef} src={flipSound} />
      <header className={`App-header ${theme}`}>
        {cards.slice(0, 7).map((card, i) => (
          <Card
            src={card.src}
            position={i}
            cardName={card.name}
            reverse={sigil.current}
            onClick={(event) => handleCardClick(event, i)}
            isFaceUp={card.isFaceUp}
            isAnimating={card.isAnimating}
            theme={theme}
            key={card.name}
          />
        ))}
      </header>
      <div className="controls">
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            shuffleCards();
          }}
        >
          🔀
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (theme === "light-theme") return;
            const audioClone = cockAudioRef.current.cloneNode();
            audioClone.play();
            setTheme("light-theme");
            sigil.current = sigil_1;
          }}
        >
          ☀️
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (theme === "dark-theme") return;
            const audioClone = owlAudioRef.current.cloneNode();
            audioClone.play();
            setTheme("dark-theme");
            sigil.current = sigil_2;
          }}
        >
          🌘
        </button>
      </div>
    </div>
  );
}

export default App;
