export function ThemeChangeButton({
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
