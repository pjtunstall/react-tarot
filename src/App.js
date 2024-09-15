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

  useEffect(() => {
    appRef.current.focus();
  }, []);

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

  const preloadImages = useCallback(() => {
    const imagesToLoad = [...cardImageFolders.flat(), sigil_1, sigil_2];

    let loadedCount = 0;
    const totalImages = imagesToLoad.length;

    const loadImage = (src) => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
          loadedCount++;
          setLoadingProgress(Math.round((loadedCount / totalImages) * 100));
          resolve();
        };
        img.onerror = reject;
        img.src = src;
      });
    };

    Promise.all(imagesToLoad.map(loadImage))
      .then(() => {
        setAreImagesLoaded(true);
      })
      .catch((error) => {
        console.error("Failed to load some images:", error);
        // Optionally, you could still set areImagesLoaded to true here,
        // depending on how you want to handle partial failures
      });
  }, [sigil_1, sigil_2]);

  useEffect(() => {
    preloadImages();
  }, [preloadImages]);

  const sigil = useRef(theme === "light-theme" ? sigil_1 : sigil_2);

  const cockAudioRef = useRef(new Audio(cockSound));
  const flipAudioRef = useRef(new Audio(flipSound));
  const owlAudioRef = useRef(new Audio(owlSound));
  const shuffleAudioRef = useRef(new Audio(shuffleSound));

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

  const handleCardClick = useCallback(
    (event, i) => {
      event.preventDefault();
      event.stopPropagation();

      if (!areImagesLoaded) return;

      const audioClone = flipAudioRef.current.cloneNode();
      audioClone.play();

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
      }, transitionDuration);
    },
    [areImagesLoaded]
  );

  const flipAllCards = () => {
    setCards((prevCards) => {
      const areAllFaceUp = prevCards.every((card) => card.isFaceUp);
      const newFaceUpState = !areAllFaceUp;

      return prevCards.map((card) => ({
        ...card,
        isFaceUp: newFaceUpState,
        isAnimating: card.isFaceUp !== newFaceUpState,
      }));
    });
  };

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
              moveCards(1);
            } else {
              moveCards(-1);
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
          flipAllCards();

          setTimeout(() => {
            setCards((prevCards) =>
              prevCards.map((card) => ({ ...card, isAnimating: false }))
            );
          }, transitionDuration);
        }, 20);

        clickCountRef.current = 0;
      }
    },
    [isMoving, moveCards]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const handleKeyDown = useCallback(
    (event) => {
      event.preventDefault();
      if (event.code === "Space" && isSpacePressed) return;
      if (isMoving) return;
      if (event.code === "ArrowLeft") {
        moveCards(1);
      } else if (event.code === "ArrowRight") {
        moveCards(-1);
      } else if (event.code === "Space") {
        setIsSpacePressed(true);
        handleCardClick(event, 3);
      }
    },
    [moveCards, isMoving, handleCardClick, isSpacePressed]
  );

  const handleKeyUp = useCallback(
    (event) => {
      if (event.code === "Space") {
        setIsSpacePressed(false);
      }
    },
    [setIsSpacePressed]
  );

  const shuffleCards = useCallback(() => {
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
    }, 300);
  }, []);

  useEffect(() => {
    shuffleCards();
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [shuffleCards]);

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
            moveCards(-1); // Swipe left
          } else {
            moveCards(1); // Swipe right
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
  }, [moveCards]);

  const LoadingScreen = () => (
    <div className="loading-screen">
      <h2>Loading Tarot Cards</h2>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${loadingProgress}%` }}
        ></div>
      </div>
      <p>{loadingProgress}% loaded</p>
    </div>
  );

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
          <header className={`App-header ${theme}`}>
            {cards.slice(0, 7).map((card, i) => (
              <Card
                src={card.src}
                position={i}
                cardName={card.name}
                reverse={sigil.current}
                onClick={(event) => handleCardClick(event, i)}
                isFaceUp={card.isFaceUp}
                isAnimating={card.isAnimating}
                theme={theme}
                key={card.name}
              />
            ))}
          </header>

          <div className="controls">
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                shuffleCards();
              }}
            >
              🔀
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (theme === "light-theme") return;
                const audioClone = cockAudioRef.current.cloneNode();
                audioClone.play();
                setTheme("light-theme");
                sigil.current = sigil_1;
              }}
            >
              ☀️
            </button>
            <button
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                if (theme === "dark-theme") return;
                const audioClone = owlAudioRef.current.cloneNode();
                audioClone.play();
                setTheme("dark-theme");
                sigil.current = sigil_2;
              }}
            >
              🌘
            </button>
          </div>
        </>
      ) : (
        <LoadingScreen />
      )}
    </div>
  );
}

export default App;
