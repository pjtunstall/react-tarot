import React, { useEffect, useCallback, useRef, useState } from "react";
import "./App.css";
import Card from "./Card.js";
import { cardImageFolders, sigils, sfx } from "./asset-imports.js";

function App() {
  const appRef = useRef(null);
  const timeoutRef = useRef(null);
  const transitionDuration = 300;
  const clickCountRef = useRef(0);
  const clickTimeoutRef = useRef(null);
  const [sigil_1, sigil_2] = sigils;
  const [cockSound, flipSound, owlSound, shuffleSound] = sfx;

  const cardNames = [
    "The Fool",
    "The Magician",
    "The High Priestess",
    "The Empress",
    "The Emperor",
    "The Hierophant",
    "The Lovers",
    "The Chariot",
    "Justice",
    "The Hermit",
    "The Wheel of Fortune",
    "Strength",
    "The Hanged One",
    "Death",
    "Temperance",
    "The Devil",
    "The Tower",
    "The Star",
    "The Moon",
    "The Sun",
    "Judgment",
    "The World",
  ];

  const initialCards = cardImageFolders.map((srcs, index) => ({
    srcs,
    src: srcs[0],
    name: cardNames[index],
    isFaceUp: false,
    isAnimating: false,
  }));

  const [theme, setTheme] = useState("dark-theme");
  const [cards, setCards] = useState(initialCards);
  const [isMoving, setIsMoving] = useState(false);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [areImagesLoaded, setAreImagesLoaded] = useState(false);
  const sigil = useRef(theme === "light-theme" ? sigil_1 : sigil_2);
  const cockAudioRef = useRef(new Audio(cockSound));
  const flipAudioRef = useRef(new Audio(flipSound));
  const owlAudioRef = useRef(new Audio(owlSound));
  const shuffleAudioRef = useRef(new Audio(shuffleSound));

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
              timeoutRef.current = moveCards(
                1,
                setCards,
                setIsMoving,
                transitionDuration
              );
            } else {
              timeoutRef.current = moveCards(
                -1,
                setCards,
                setIsMoving,
                transitionDuration
              );
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
          flipAllCards(setCards);

          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, isAnimating: false }))
            );
          }, transitionDuration);
        }, 20);

        clickCountRef.current = 0;
      }
    },
    [isMoving]
  );

  const handleKeyDown = useCallback(
    (event) => {
      event.preventDefault();
      if (event.code === "Space" && isSpacePressed) return;
      if (isMoving) return;
      if (event.code === "ArrowLeft") {
        timeoutRef.current = moveCards(
          1,
          setCards,
          setIsMoving,
          transitionDuration
        );
      } else if (event.code === "ArrowRight") {
        timeoutRef.current = moveCards(
          -1,
          setCards,
          setIsMoving,
          transitionDuration
        );
      } else if (event.code === "Space") {
        setIsSpacePressed(true);
        handleCardClick(event, 3, transitionDuration, setCards, flipAudioRef);
      }
    },
    [isMoving, isSpacePressed]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.code === "Space") {
        setIsSpacePressed(false);
      }
    },
    [setIsSpacePressed]
  );

  // Swipe
  const startXRef = useRef();
  useEffect(() => {
    const handleTouchStart = (e) => {
      const touch = e.touches[0];
      startXRef.current = touch.clientX;
    };

    const handleTouchEnd = (e) => {
      const touch = e.changedTouches[0];
      const endX = touch.clientX;
      if (startXRef.current) {
        const deltaX = startXRef.current - endX;
        if (Math.abs(deltaX) > 50) {
          if (deltaX > 0) {
            timeoutRef.current = moveCards(
              -1,
              setCards,
              setIsMoving,
              timeoutRef,
              transitionDuration
            ); // Swipe left
          } else {
            timeoutRef.current = moveCards(
              1,
              setCards,
              setIsMoving,
              transitionDuration
            ); // Swipe right
          }
        }
      }
    };

    const currentAppRef = appRef.current;
    if (currentAppRef) {
      currentAppRef.addEventListener("touchstart", handleTouchStart);
      currentAppRef.addEventListener("touchend", handleTouchEnd);
    }

    return () => {
      if (currentAppRef) {
        currentAppRef.removeEventListener("touchstart", handleTouchStart);
        currentAppRef.removeEventListener("touchend", handleTouchEnd);
      }
    };
  });

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
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        handleCarouselCleanup(timeoutRef, clickTimeoutRef);
      }
    };
  }, [sigil_1, sigil_2]);

  return (
    <div
      className="App"
      ref={appRef}
      onClick={handleClickOrDoubleClick}
      tabIndex="0"
      onKeyDown={handleKeyDown}
      onKeyUp={handleKeyUp}
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
          ></Controls>
        </>
      ) : (
        <LoadingScreen loadingProgress={loadingProgress} />
      )}
    </div>
  );
}

function handleCardClick(
  event,
  indexToFlip,
  transitionDuration,
  setCards,
  flipAudioRef
) {
  event.preventDefault();
  event.stopPropagation();
  flipCard(setCards, indexToFlip, flipAudioRef, transitionDuration);
}

function Carousel({
  cards,
  handleCardClick,
  theme,
  transitionDuration,
  sigil,
  setCards,
  flipAudioRef,
}) {
  return (
    <div className={`carousel ${theme}`}>
      {cards.slice(0, 7).map((card, index) => (
        <Card
          front={card.src}
          position={index}
          cardName={card.name}
          back={sigil.current}
          onClick={(event) =>
            handleCardClick(
              event,
              index,
              transitionDuration,
              setCards,
              flipAudioRef
            )
          }
          isFaceUp={card.isFaceUp}
          isAnimating={card.isAnimating}
          theme={theme}
          key={card.name}
        />
      ))}
    </div>
  );
}

function Controls({
  theme,
  setTheme,
  sigil,
  sigil_1,
  sigil_2,
  shuffleCards,
  setCards,
  shuffleAudioRef,
  transitionDuration,
  cockAudioRef,
  owlAudioRef,
}) {
  return (
    <div className="controls">
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          shuffleCards(shuffleAudioRef, setCards, transitionDuration);
        }}
      >
        🔀
      </button>
      <ThemeChangeButton
        newTheme="light-theme"
        newSigil={sigil_1}
        theme={theme}
        setTheme={setTheme}
        icon="☀️"
        sigil={sigil}
        audioRef={cockAudioRef}
      />
      <ThemeChangeButton
        newTheme="dark-theme"
        newSigil={sigil_2}
        theme={theme}
        setTheme={setTheme}
        icon="🌘"
        sigil={sigil}
        audioRef={owlAudioRef}
      />
    </div>
  );
}

function handleCarouselCleanup(timeoutRef, clickTimeoutRef) {
  if (timeoutRef.current) {
    clearTimeout(timeoutRef.current);
  }
  if (clickTimeoutRef.current) {
    clearTimeout(clickTimeoutRef.current);
  }
}

function ThemeChangeButton({
  newTheme,
  newSigil,
  theme,
  setTheme,
  icon,
  sigil,
  audioRef,
}) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (newTheme === theme) return;
        const audioClone = audioRef.current.cloneNode();
        audioClone.play();
        setTheme(newTheme);
        sigil.current = newSigil;
      }}
    >
      {icon}
    </button>
  );
}

function LoadingScreen({ loadingProgress }) {
  return (
    <div className="loading-screen">
      <h2>Loading the cards . . .</h2>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p>{loadingProgress}% loaded</p>
    </div>
  );
}

function preloadImages(
  cardImageFolders,
  sigil_1,
  sigil_2,
  setLoadingProgress,
  setAreImagesLoaded
) {
  const imagesToLoad = [...cardImageFolders.flat(), sigil_1, sigil_2];
  const totalImages = imagesToLoad.length;

  const loadImage = (src) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ status: "fulfilled", value: src });
      img.onerror = () =>
        resolve({ status: "rejected", reason: `Failed to load ${src}` });
      img.src = src;
    });
  };

  Promise.allSettled(imagesToLoad.map(loadImage))
    .then((results) => {
      const loadedCount = results.filter(
        (result) => result.status === "fulfilled"
      ).length;
      setLoadingProgress(Math.round((loadedCount / totalImages) * 100));

      const failedImages = results.filter(
        (result) => result.status === "rejected"
      );
      if (failedImages.length > 0) {
        console.warn(
          `Failed to load ${failedImages.length} images:`,
          failedImages.map((result) => result.reason)
        );
      }

      setAreImagesLoaded(true);
    })
    .catch((error) => {
      console.error("Unexpected error during image loading:", error);
      setAreImagesLoaded(true);
    });
}

function moveCards(direction, setCards, setIsMoving, transitionDuration) {
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

  return setTimeout(() => {
    setIsMoving(false);
  }, transitionDuration);
}

function flipCard(setCards, indexToFlip, flipAudioRef, transitionDuration) {
  const audioClone = flipAudioRef.current.cloneNode();
  audioClone.play();

  setCards((prevCards) =>
    prevCards.map((card, index) =>
      index === indexToFlip ? { ...card, isAnimating: true } : card
    )
  );

  setTimeout(() => {
    setCards((prevCards) =>
      prevCards.map((card, index) =>
        index === indexToFlip
          ? { ...card, isAnimating: false, isFaceUp: !card.isFaceUp }
          : card
      )
    );
  }, transitionDuration);
}

function flipAllCards(setCards) {
  setCards((prevCards) => {
    const areAllFaceUp = prevCards.every((card) => card.isFaceUp);
    const newFaceUpState = !areAllFaceUp;

    return prevCards.map((card) => ({
      ...card,
      isFaceUp: newFaceUpState,
      isAnimating: card.isFaceUp !== newFaceUpState,
    }));
  });
}

function shuffleCards(shuffleAudioRef, setCards, transitionDuration) {
  const audioClone = shuffleAudioRef.current.cloneNode();
  audioClone.play();

  setCards((prevCards) => {
    const newCards = [...prevCards];

    for (let i = newCards.length - 1; i > 0; i--) {
      // Fisher-Yates shuffle algorithm.
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    return newCards.map((card) => ({
      ...card,
      src: card.srcs[Math.floor(Math.random() * card.srcs.length)],
      isFaceUp: false,
      isAnimating: true,
    }));
  });

  setTimeout(() => {
    setCards((prevCards) =>
      prevCards.map((card) => ({ ...card, isAnimating: false }))
    );
  }, transitionDuration);
}

export default App;
