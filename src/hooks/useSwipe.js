import { useEffect, useRef } from "react";

import { handleTouchStart } from "../event-handlers/handleTouchStart.js";
import { handleTouchEnd } from "../event-handlers/handleTouchEnd.js";

export function useSwipe(
  appRef,
  moveCards,
  setCards,
  isMoving,
  setIsMoving,
  transitionDuration,
  timeoutRef,
  clickTimeoutRef
) {
  const startXRef = useRef();
  useEffect(() => {
    const currentAppRef = appRef.current;

    const handleTouchStartWrapper = (event) => {
      handleTouchStart(event, startXRef, isMoving);
    };

    const handleTouchEndWrapper = (event) => {
      handleTouchEnd(
        event,
        startXRef,
        isMoving,
        moveCards,
        setCards,
        setIsMoving,
        transitionDuration
      );
    };

    if (currentAppRef) {
      currentAppRef.addEventListener("touchstart", handleTouchStartWrapper);
      currentAppRef.addEventListener("touchend", handleTouchEndWrapper);
    }

    return () => {
      if (currentAppRef) {
        currentAppRef.removeEventListener(
          "touchstart",
          handleTouchStartWrapper
        );
        currentAppRef.removeEventListener("touchend", handleTouchEndWrapper);
      }
    };
  }, [
    appRef,
    moveCards,
    setCards,
    isMoving,
    setIsMoving,
    transitionDuration,
    timeoutRef,
    clickTimeoutRef,
  ]);
}
