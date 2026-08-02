import { ThemeChangeButton } from "./ThemeChangeButton";

export function Controls({
  sigil,
  sigil_1,
  sigil_2,
  shuffleCards,
  setCards,
  shuffleAudioRef,
  transitionDuration,
  cockAudioRef,
  owlAudioRef,
  setIsModalOpen,
  isBlurred,
  setIsBlurred,
}) {
  return (
    <div className={`controls ${isBlurred ? "blurred" : ""}`}>
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          if (isBlurred) return;
          shuffleCards(shuffleAudioRef, setCards, transitionDuration);
        }}
      >
        🔀
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setIsBlurred(true);
          setIsModalOpen(true);
        }}
      >
        ℹ️
      </button>
      <ThemeChangeButton
        newTheme="light-theme"
        newSigil={sigil_1}
        icon="☀️"
        sigil={sigil}
        audioRef={cockAudioRef}
        isBlurred={isBlurred}
      />
      <ThemeChangeButton
        newTheme="dark-theme"
        newSigil={sigil_2}
        icon="🌘"
        sigil={sigil}
        audioRef={owlAudioRef}
        isBlurred={isBlurred}
      />
    </div>
  );
}
