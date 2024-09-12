import React, { useEffect, useCallback, useRef, useState } from "react";

import "./App.css";

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
import hangedMan from "./images/12_hanged.jpg";
import death from "./images/13_death.jpg";
import temperance from "./images/14_temperance.jpg";
import devil from "./images/15_devil.jpg";
import tower from "./images/16_tower.jpg";
import star from "./images/17_star.jpg";
import moon from "./images/18_moon.jpg";
import sun from "./images/19_sun.jpg";
import judgement from "./images/20_judgement.jpg";
import world from "./images/21_world.jpg";

import sigil from "./images/sigil.jpg";

function Card({ src, position, cardName, reverse }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isFaceUp, setIsFaceUp] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const getSizeClass = (pos) => {
    const sizes = [
      "very-very-small-image",
      "very-small-image",
      "small-image",
      "large-image",
      "small-image",
      "very-small-image",
      "very-very-small-image",
    ];
    return sizes[pos] || "hidden-image";
  };

  const size = getSizeClass(position);

  const handleClick = useCallback((event) => {
    event.preventDefault();
    event.stopPropagation();
    setIsFaceUp((prev) => !prev);
    setAnimationClass("flip");
    setTimeout(() => {
      setAnimationClass("");
    }, 300);
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  return (
    <div id={cardName} className={"card"}>
      <img
        src={isFaceUp ? src : reverse}
        className={`image ${size} ${animationClass}`}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter} // In fullscreen mode, Chrome treats mouseEnter and mouseLeave, as well as mouseOver and mouseOut, as click listeners--usually. After a while of clicking, it sometimes starts treating them like hover listeners. Brave and Firefox work as expected.
        onMouseLeave={handleMouseLeave}
        style={{
          border: isHovered ? "5px solid #f50334" : "",
          boxShadow: isHovered ? "0 0 10px 5px #5d0113" : "",
          transform: isHovered ? "scale(1.1)" : "",
        }}
        alt={`tarot card representing ${cardName}`}
      />
      <div>{position === 3 && <p></p>}</div>
      <div
        className="title"
        style={{
          color: isHovered ? "#fff" : "",
          opacity: isFaceUp ? "1" : "0",
        }}
      >
        {position === 3 && cardName}
      </div>
    </div>
  );
}

function App() {
  const transitionDuration = 300;
  const [cards, setCards] = useState([
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
  ]);
  const [names, setNames] = useState([
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
  ]);

  const [isMoving, setIsMoving] = useState(false);
  const timeoutRef = useRef(null);

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

    setNames((prevNames) => {
      const newNames = [...prevNames];
      if (direction > 0) {
        const lastName = newNames.pop();
        newNames.unshift(lastName);
      } else {
        const firstName = newNames.shift();
        newNames.push(firstName);
      }
      return newNames;
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

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="App" onClick={handleClick}>
      <header className="App-header">
        {cards.slice(0, 7).map((src, i) => (
          <Card
            src={src}
            position={i}
            cardName={names[i]}
            reverse={sigil}
            key={names[i]}
          />
        ))}
      </header>
    </div>
  );
}

export default App;
