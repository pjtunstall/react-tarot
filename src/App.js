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
import tower from "./images/16_tower.jpg";
import star from "./images/17_star.jpg";
import moon from "./images/18_moon.jpg";
import sun from "./images/19_sun.jpg";
import judgement from "./images/20_judgement.jpg";
import world from "./images/21_world.jpg";
// import temperance from "./images/14_temperance.jpg";

function Card({ src, x, names }) {
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
    <div>
      <img
        src={src}
        className={`image ${size}`}
        onMouseOver={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        style={{ border: isHovered ? "5px solid #f50334" : "" }}
        alt={`Tarot card representing ${names[x]}`}
      />
      <div>{x === 4 && <p></p>}</div>
      <div id="name" style={{ color: isHovered ? "#fff" : "" }}>
        {x === 4 && names[x]}
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
    // temperance,
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
    // "Temperance",
    "Tower",
    "Star",
  ]);

  function handleClick(event) {
    if (event.clientX < window.innerWidth / 2) {
      const lastCard = cards.pop();
      const lastCardName = names.pop();
      const newCards = [lastCard, ...cards];
      const newNames = [lastCardName, ...names];
      setCards(newCards);
      setNames(newNames);
    } else {
      const firstCard = cards.shift();
      const firstCardName = names.shift();
      const newCards = [...cards, firstCard];
      const newNames = [...names, firstCardName];
      setCards(newCards);
      setNames(newNames);
    }
  }

  return (
    <div className="App" onClick={handleClick}>
      <header className="App-header">
        {cards.map((src, i) => (
          <Card src={src} x={i} names={names} key={src} />
        ))}
      </header>
    </div>
  );
}

export default App;
