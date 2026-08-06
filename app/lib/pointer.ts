import { useEffect, useState } from "react";

/** True for touch/coarse-pointer devices — used to disable the custom cursor. */
export function useIsTouchDevice() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(pointer: coarse)");
    setIsTouch(query.matches);
    const onChange = (e: MediaQueryListEvent) => setIsTouch(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return isTouch;
}
