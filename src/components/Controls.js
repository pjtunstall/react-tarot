import { ThemeChangeButton } from "./ThemeChangeButton";

export function Controls({
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
