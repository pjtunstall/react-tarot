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

function App() {
  const appRef = useRef(null);
  const transitionDuration = 300;
  const timeoutRef = useRef(null);

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

  const [cards, setCards] = useState(initialCards);
  const [isMoving, setIsMoving] = useState(false);

  const sigils = [sigil_2];
  const sigil = useRef(sigils[Math.floor(Math.random() * sigils.length)]);

  const handleCardClick = useCallback((event, i) => {
    event.preventDefault();
    event.stopPropagation();
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
    }, 300);
  }, []);

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

  const handleClick = useCallback(
    (event) => {
      event.preventDefault();
      if (isMoving) return;
      if (event.clientX < window.innerWidth / 2) {
        moveCards(1);
      } else {
        moveCards(-1);
      }
    },
    [moveCards, isMoving]
  );

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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div
      className="App"
      ref={appRef}
      onClick={handleClick}
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <header className="App-header">
        {cards.slice(0, 7).map((card, i) => (
          <Card
            src={card.src}
            position={i}
            cardName={card.name}
            reverse={sigil.current}
            onClick={(event) => handleCardClick(event, i)}
            isFaceUp={card.isFaceUp}
            isAnimating={card.isAnimating}
            key={card.name}
          />
        ))}
      </header>
    </div>
  );
}

export default App;
