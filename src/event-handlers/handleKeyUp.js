let timeoutId = null;
const throttleDelay = 333;

export function handleKeyUp(event, setIsSpacePressed) {
  if (event.code === "Space") {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      setIsSpacePressed(false);
    }, throttleDelay);
  }
}
