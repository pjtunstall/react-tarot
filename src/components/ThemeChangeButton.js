export function ThemeChangeButton({
  newTheme,
  newSigil,
  theme,
  setTheme,
  icon,
  sigil,
  audioRef,
  isBlurred,
}) {
  return (
    <button
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();
        if (isBlurred) return;
        if (newTheme === theme) return;
        const audioClone = audioRef.current.cloneNode();
        if (theme === "dark-theme") {
          audioClone.volume = 0.16;
        }
        audioClone.play();
        setTheme(newTheme);
        sigil.current = newSigil;
      }}
    >
      {icon}
    </button>
  );
}
