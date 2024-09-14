import React, { useState, useCallback } from "react";

function Card({
  src,
  position,
  cardName,
  reverse,
  isFaceUp,
  isAnimating,
  onClick,
  theme,
}) {
  const [isHovered, setIsHovered] = useState(false);
  const size = getSizeClass(position);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  let titleColor = "";
  if (isHovered) {
    if (theme === "dark-theme") {
      titleColor = "#fff";
    } else {
      titleColor = "#000";
    }
  }

  return (
    <div
      id={cardName}
      className={`card ${isAnimating ? "flip" : ""}`}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        transform: isHovered ? "scale(1.1)" : "",
      }}
    >
      <img
        src={isFaceUp ? src : reverse}
        className={`image ${size}`}
        style={{
          border: isHovered ? "5px solid #f50334" : "",
          boxShadow: isHovered ? "0 0 10px 5px #5d0113" : "",
        }}
        alt={cardName}
      />
      <div>{position === 3 && <p></p>}</div>
      <div
        className={`title title-${theme}`}
        style={{
          color: titleColor,
          opacity: isFaceUp ? "1" : "0",
        }}
      >
        {position === 3 && cardName}
      </div>
    </div>
  );
}

function getSizeClass(position) {
  const sizes = [
    "very-very-small-image",
    "very-small-image",
    "small-image",
    "large-image",
    "small-image",
    "very-small-image",
    "very-very-small-image",
  ];
  return sizes[position] || "hidden-image";
}

export default Card;
