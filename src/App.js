import React, { useEffect, useRef, useState } from "react";

import "./App.css";
import { Carousel } from "./components/Carousel.js";
import { Controls } from "./components/Controls.js";
import { LoadingScreen } from "./components/LoadingScreen.js";
import { ModalContainer } from "./components/ModalContainer.js";
import { cardImageFolders, sigils, sfx } from "./assets/assetImports.js";
import { cardNames } from "./assets/cardNames.js";
import { preloadImages } from "./preloadImages.js";
import { handleKeyDown } from "./event-handlers/handleKeyDown.js";
import { handleKeyUp } from "./event-handlers/handleKeyUp.js";
import { handleClickOrDoubleClick } from "./event-handlers/handleClickOrDoubleClick.js";
import { handleCardClick } from "./event-handlers/handleCardClick.js";
import { shuffleCards } from "./card-actions/shuffleCards.js";

function App() {
  const appRef = useRef(null);
  const timeoutRef = useRef(null);
  const transitionDuration = 300;
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const [sigil_1, sigil_2] = sigils;
  const [cockSound, flipSound, owlSound, shuffleSound] = sfx;
  const initialCards = cardImageFolders.map((srcs, index) => ({
    srcs,
    src: srcs[0],
    name: cardNames[index],
    isFaceUp: false,
    isAnimating: false,
  }));
  const [cards, setCards] = useState(initialCards);
  const [isMoving, setIsMoving] = useState(false);
  const [theme, setTheme] = useState("dark-theme");
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const sigil = useRef(theme === "light-theme" ? sigil_1 : sigil_2);
  const cockAudioRef = useRef(new Audio(cockSound));
  const flipAudioRef = useRef(new Audio(flipSound));
  const owlAudioRef = useRef(new Audio(owlSound));
  const shuffleAudioRef = useRef(new Audio(shuffleSound));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlurred, setIsBlurred] = useState(false);

  useEffect(() => {
    shuffleCards(shuffleAudioRef, setCards, transitionDuration);
    appRef.current.focus();
    preloadImages(
      cardImageFolders,
      sigil_1,
      sigil_2,
      setLoadingProgress,
      setAreImagesLoaded
    );

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(timeoutRef?.current);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      clearTimeout(clickTimeoutRef?.current);
      // Apparently ESLint is afraid that the value may have changed, but, of course, that's the whole point: we want to clear the latest timeout.
    };
  }, [sigil_1, sigil_2]);

  return (
    <div
      className="App"
      ref={appRef}
      onClick={(event) => {
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
          isBlurred
        );
      }}
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
          isBlurred
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
            theme={theme}
            transitionDuration={transitionDuration}
            sigil={sigil}
            setCards={setCards}
            flipAudioRef={flipAudioRef}
            isBlurred={isBlurred}
          />
          <Controls
            theme={theme}
            setTheme={setTheme}
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
