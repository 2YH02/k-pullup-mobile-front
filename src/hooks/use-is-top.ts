import { useState, useEffect } from "react";

const useIsTop = (element: HTMLDivElement | null) => {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    if (!element) return;

    const handleScroll = () => {
      if (!element) return;
      setIsTop(element.scrollTop === 0);
    };

    element.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      if (!element) return;
      element.removeEventListener("scroll", handleScroll);
    };
  }, [element]);

  return isTop;
};

export default useIsTop;
