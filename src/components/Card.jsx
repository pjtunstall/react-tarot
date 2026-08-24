import React, { useState, useCallback, useContext, useEffect } from "react";

import { ThemeContext } from "./ThemeContext.jsx";
import { FAILED_FRONT_SRC } from "../helpers/useCardImagePreloader.js";

function Card({
  front,
  position,
  cardName,
  back,
  isFaceUp,
  isAnimating,
  isPendingFlip,
  isFrontLoaded,
  isFrontFailed,
  onClick,
}) {
  const { theme } = useContext(ThemeContext);

  const [isHovered, setIsHovered] = useState(false);
  const [showAckFlare, setShowAckFlare] = useState(false);
  const size = getSizeClass(position);

  useEffect(() => {
    if (!isPendingFlip) {
      setShowAckFlare(false);
      return;
    }

    setShowAckFlare(true);
    const timeoutId = setTimeout(() => {
      setShowAckFlare(false);
    }, 280);

    return () => clearTimeout(timeoutId);
  }, [isPendingFlip]);

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

  const hoverImageStyle = isHovered
    ? {
        border: "5px solid #f50334",
        boxShadow: "0 0 10px 5px #5d0113",
      }
    : undefined;

  const pendingClass = isPendingFlip
    ? showAckFlare
      ? "pending-flip pending-flip-ack"
      : "pending-flip"
    : "";

  // Don't put the real URL on the <img> until the loader says it loaded;
  // otherwise the browser would fetch independently of the preload queue.
  let frontSrc;
  if (isFrontFailed) {
    frontSrc = FAILED_FRONT_SRC;
  } else if (isFrontLoaded) {
    frontSrc = front;
  }

  return (
    <div
      id={cardName}
      className={`card ${isAnimating ? "flip" : ""} ${pendingClass}`.trim()}
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        cursor: "pointer",
        transform: isHovered ? "scale(1.1)" : "",
      }}
    >
      <div className={`card-inner ${size} ${isFaceUp ? "face-up" : ""}`}>
        <img
          src={back}
          className="card-face card-face-back image"
          style={hoverImageStyle}
          alt=""
        />
        <img
          src={frontSrc}
          className="card-face card-face-front image"
          style={hoverImageStyle}
          alt={cardName}
        />
      </div>
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
