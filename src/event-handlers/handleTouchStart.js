export function handleTouchStart(event, startXRef, isMoving) {
  if (isMoving) {
    return;
  }
  const touch = event.touches[0];
  startXRef.current = touch.clientX;
}
