export function handleKeyUp(event, setIsSpacePressed) {
  if (event.code === "Space") {
    setIsSpacePressed(false);
  }
}
