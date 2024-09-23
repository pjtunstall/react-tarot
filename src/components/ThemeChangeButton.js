import { useContext } from "react";

import { ThemeContext } from "./ThemeContext.js";

export function ThemeChangeButton({
  newTheme,
  newSigil,
  icon,
  sigil,
  audioRef,
  isBlurred,
}) {
  const { theme, setTheme } = useContext(ThemeContext);

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
