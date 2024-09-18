export function handleTouchEnd(
  event,
  startXRef,
  isMoving,
  moveCards,
  setCards,
  setIsMoving,
  transitionDuration
) {
  if (isMoving) {
    return;
  }
  const touch = event.changedTouches[0];
  const endX = touch.clientX;
  if (startXRef.current) {
    const deltaX = startXRef.current - endX;
    if (Math.abs(deltaX) > 50) {
      const direction = deltaX > 0 ? -1 : 1;
      moveCards(direction, setCards, setIsMoving, transitionDuration);
    }
  }
}
