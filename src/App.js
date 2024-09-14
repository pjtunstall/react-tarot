import React, { useEffect, useCallback, useRef, useState } from "react";

import "./App.css";

import Card from "./Card.js";

import fool from "./images/0_fool.jpg";
import magician from "./images/1_magician.jpg";
import highPriestess from "./images/2_high-priestess.jpg";
import empress from "./images/3_empress.jpg";
import hierophant from "./images/5_hierophant.jpg";
import lovers from "./images/6_lovers.jpg";
import hermit from "./images/9_hermit.jpg";
import emperor from "./images/4_emperor.jpg";
import justice from "./images/8_justice.jpg";
import chariot from "./images/7_chariot.jpg";
import fortune from "./images/10_fortune.jpg";
import strength from "./images/11_strength.jpg";
import hangedMan from "./images/12_hangedMan.jpg";
import death from "./images/13_death.jpg";
import temperance from "./images/14_temperance.jpg";
import devil from "./images/15_devil.jpg";
import tower from "./images/16_tower.jpg";
import star from "./images/17_star.jpg";
import moon from "./images/18_moon.jpg";
import sun from "./images/19_sun.jpg";
import judgement from "./images/20_judgement.jpg";
import world from "./images/21_world.jpg";

import sigil_2 from "./images/sigil_2.jpg";

import flipSound from "./sfx/flip.mp3";
import shuffleSound from "./sfx/shuffle.mp3";

function App() {
  const appRef = useRef(null);
  const timeoutRef = useRef(null);
  const transitionDuration = 300;
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);

  useEffect(() => {
    appRef.current.focus();
  }, []);

  const initialCards = [
    sun,
    judgement,
    world,
    fool,
    magician,
    highPriestess,
    emperor,
    empress,
    hierophant,
    lovers,
    chariot,
    justice,
    hermit,
    fortune,
    strength,
    hangedMan,
    death,
    temperance,
    devil,
    tower,
    star,
    moon,
  ].map((src, index) => ({
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

  const sigils = [sigil_2];
  const sigil = useRef(sigils[Math.floor(Math.random() * sigils.length)]);

  const flipAudioRef = useRef(new Audio(flipSound));
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
          🔄
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme("light-theme");
          }}
        >
          ☀️
        </button>
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setTheme("dark-theme");
          }}
        >
          🌘
        </button>
      </div>
    </div>
  );
}

export default App;
