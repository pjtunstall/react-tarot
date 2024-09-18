let lastInvocationTime = 0;
const throttleDelay = 333;

export function handleKeyUp(event, setIsSpacePressed) {
  const currentTime = Date.now();
  if (
    event.code === "Space" &&
    currentTime - lastInvocationTime > throttleDelay
  ) {
    setIsSpacePressed(false);
    lastInvocationTime = currentTime;
  }
}
