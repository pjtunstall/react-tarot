import React, { useState } from "react";

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
import temperance from "./14_temperance.jpg";
import devil from "./images/15_devil.jpg";
import tower from "./images/16_tower.jpg";
import star from "./images/17_star.jpg";
import moon from "./images/18_moon.jpg";
import sun from "./images/19_sun.jpg";
import judgement from "./images/20_judgement.jpg";
import world from "./images/21_world.jpg";

function Card({ src, x, cardName }) {
  const [isHovered, setIsHovered] = useState(false);

  let size;
  switch (x) {
    case 1:
      size = "very-very-small-image";
      break;
    case 2:
      size = "very-small-image";
      break;
    case 3:
      size = "small-image";
      break;
    case 4:
      size = "large-image";
      break;
    case 5:
      size = "small-image";
      break;
    case 6:
      size = "very-small-image";
      break;
    case 7:
      size = "very-very-small-image";
      break;
    default:
      size = "hidden-image";
  }
  return (
    <div id={cardName} className={"card"}>
      <img
        src={src}
        className={`image ${size}`}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        style={{ border: isHovered ? "5px solid #f50334" : "" }}
        alt={`tarot card representing ${cardName}`}
      />
      <div>{x === 4 && <p></p>}</div>
      <div id="name" style={{ color: isHovered ? "#fff" : "" }}>
        {x === 4 && cardName}
      </div>
    </div>
  );
}

function App() {
  const [cards, setCards] = useState([
    moon,
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
  ]);
  const [names, setNames] = useState([
    "Moon",
    "Sun",
    "Judgement",
    "World",
    "Fool",
    "Magician",
    "High Priestess",
    "Emperor",
    "Empress",
    "Hierophant",
    "Lovers",
    "Chariot",
    "Justice",
    "Hermit",
    "Fortune",
    "Strength",
    "Hanged Man",
    "Death",
    "Temperance",
    "Devil",
    "Tower",
    "Star",
  ]);

  const handleClick = (event) => {
    if (event.clientX < window.innerWidth / 2) {
      let newCards = [...cards];
      let newNames = [...names];
      const lastCard = newCards.pop();
      const lastCardName = newNames.pop();
      newCards = [lastCard, ...newCards];
      newNames = [lastCardName, ...newNames];
      setCards(newCards);
      setNames(newNames);
    } else {
      let newCards = [...cards];
      let newNames = [...names];
      const firstCard = newCards.shift();
      const firstCardName = newNames.shift();
      newCards = [...newCards, firstCard];
      newNames = [...newNames, firstCardName];
      setCards(newCards);
      setNames(newNames);
    }
  };

  return (
    <div className="App" onClick={handleClick}>
      <header className="App-header">
        {cards.map((src, i) => (
          <Card src={src} x={i} cardName={names[i]} key={src} />
        ))}
      </header>
    </div>
  );
}

export default App;
