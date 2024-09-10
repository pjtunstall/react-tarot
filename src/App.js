import React, { useState } from "react";

import "./App.css";

import fool from "./images/0_fool.jpg";
import emperor from "./images/4_emperor.jpg";
import justice from "./images/8_justice.jpg";
import chariot from "./images/7_chariot.jpg";
import fortune from "./images/10_fortune.jpg";

let cards = [justice, chariot, fool, emperor, fortune];

function Card({ src, x }) {
  let size;
  switch (x) {
    case 1:
      size = "small-image";
      break;
    case 2:
      size = "large-image";
      break;
    case 3:
      size = "small-image";
      break;
    default:
      size = "hidden-image";
  }
  return <img src={src} className={`image ${size}`} alt="" />;
}

function App() {
  const [moveX, setMoveX] = useState(false);

  const handleClick = (event) => {
    if (event.clientX < window.innerWidth / 2) {
      cards.unshift(cards.pop());
      setMoveX(!moveX);
    } else {
      cards.push(cards.shift());
      setMoveX(!moveX);
    }
  };

  return (
    <div className="App" onClick={handleClick}>
      <header className="App-header">
        {cards.map((src, i) => (
          <Card src={src} x={i} key={src} />
        ))}
      </header>
    </div>
  );
}

export default App;
