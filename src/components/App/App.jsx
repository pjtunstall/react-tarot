import React, { useEffect, useRef, useState, useContext } from "react";

import "./App.css";

import { ThemeContext } from "../ThemeContext.jsx";

// Components
import { Carousel } from "../Carousel.jsx";
import { Controls } from "../Controls.jsx";
import { LoadingScreen } from "../LoadingScreen.jsx";
import { ModalContainer } from "../ModalContainer.jsx";

// Data
import { cardImageFolders, sigils, sfx } from "../../assets/assetImports.js";
import { cardNames } from "../../assets/cardNames.js";
import { useCardImagePreloader } from "../../helpers/useCardImagePreloader.js";

// Event handlers
import { handleKeyDown } from "../../event-handlers/handleKeyDown.js";
import { handleKeyUp } from "../../event-handlers/handleKeyUp.js";
import { handleClickOrDoubleClick } from "../../event-handlers/handleClickOrDoubleClick.js";
import { handleCardClick } from "../../event-handlers/handleCardClick.js";
import {
  handleTouchStart,
  handleTouchMove,
  handleTouchEnd,
} from "../../event-handlers/handleTouch.js";
import { shuffleCards } from "../../card-actions/shuffleCards.js";

function createInitialCards() {
  const cards = cardImageFolders.map((srcs, index) => ({
    srcs,
    src: srcs[0],
    name: cardNames[index],
    isFaceUp: false,
    isAnimating: false,
  }));

  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }

  return cards.map((card) => ({
    ...card,
    src: card.srcs[Math.floor(Math.random() * card.srcs.length)],
  }));
}

function App() {
  const appRef = useRef(null);
  const timeoutRef = useRef(null);
  const transitionDuration = 300;
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const touchStartRef = useRef(null);
  const isSwipeRef = useRef(false);
  const isTouchTapRef = useRef(false);
  const [sigil_1, sigil_2] = sigils;
  const [cockSound, flipSound, owlSound, shuffleSound] = sfx;
  const [cards, setCards] = useState(createInitialCards);
  const [isMoving, setIsMoving] = useState(false);
  const { theme } = useContext(ThemeContext);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const sigil = useRef(theme === "light-theme" ? sigil_1 : sigil_2);
  const cockAudioRef = useRef(new Audio(cockSound));
  const flipAudioRef = useRef(new Audio(flipSound));
  const owlAudioRef = useRef(new Audio(owlSound));
  const shuffleAudioRef = useRef(new Audio(shuffleSound));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  const {
    loadingProgress,
    areImagesLoaded,
    requestCardFlip,
    isPendingFlip,
    isFrontLoaded,
    isFrontFailed,
  } = useCardImagePreloader({
    cards,
    setCards,
    sigil_1,
    sigil_2,
    flipAudioRef,
  });

  useEffect(() => {
    appRef.current?.focus();

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(timeoutRef?.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(clickTimeoutRef?.current);
    };
  }, []);

  return (
    <div
      className="App"
      ref={appRef}
      onClick={(event) => {
        const isTouchTap = isTouchTapRef.current;
        isTouchTapRef.current = false;
        handleClickOrDoubleClick(
          event,
          isMoving,
          clickCountRef,
          clickTimeoutRef,
          timeoutRef,
          transitionDuration,
          setCards,
          setIsMoving,
          flipAudioRef,
          isBlurred,
          setIsBlurred,
          setIsModalOpen,
          isTouchTap
        );
      }}
      onTouchStart={(event) =>
        handleTouchStart(event, touchStartRef, isSwipeRef)
      }
      onTouchMove={(event) =>
        handleTouchMove(event, touchStartRef, isSwipeRef)
      }
      onTouchEnd={(event) =>
        handleTouchEnd(
          event,
          touchStartRef,
          isSwipeRef,
          isTouchTapRef,
          isMoving,
          isBlurred,
          setCards,
          setIsMoving,
          transitionDuration,
          timeoutRef
        )
      }
      tabIndex="0"
      onKeyDown={(event) =>
        handleKeyDown(
          event,
          isMoving,
          setIsMoving,
          setCards,
          flipAudioRef,
          transitionDuration,
          timeoutRef,
          isSpacePressed,
          setIsSpacePressed,
          isBlurred,
          requestCardFlip
        )
      }
      onKeyUp={(event) => {
        handleKeyUp(event, setIsSpacePressed);
      }}
    >
      <audio ref={flipAudioRef} src={flipSound} />
      {areImagesLoaded ? (
        <>
          <Carousel
            cards={cards}
            handleCardClick={handleCardClick}
            transitionDuration={transitionDuration}
            sigil={sigil}
            setCards={setCards}
            flipAudioRef={flipAudioRef}
            isBlurred={isBlurred}
            requestCardFlip={requestCardFlip}
            isPendingFlip={isPendingFlip}
            isFrontLoaded={isFrontLoaded}
            isFrontFailed={isFrontFailed}
          />
          <Controls
            sigil={sigil}
            sigil_1={sigil_1}
            sigil_2={sigil_2}
            shuffleCards={shuffleCards}
            setCards={setCards}
            shuffleAudioRef={shuffleAudioRef}
            transitionDuration={transitionDuration}
            cockAudioRef={cockAudioRef}
            owlAudioRef={owlAudioRef}
            setIsModalOpen={setIsModalOpen}
            isBlurred={isBlurred}
            setIsBlurred={setIsBlurred}
          ></Controls>
          <ModalContainer
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
            setIsBlurred={setIsBlurred}
          />
        </>
      ) : (
        <LoadingScreen loadingProgress={loadingProgress} />
      )}
    </div>
  );
}

export default App;
