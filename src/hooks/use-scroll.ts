import { useState, useEffect } from "react";

const useScroll = (element: HTMLDivElement | null) => {
  const [isTop, setIsTop] = useState(true);
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    if (!element) return;

    const handleScroll = () => {
      if (!element) return;
      setScrollTop(element.scrollTop);
      setIsTop(element.scrollTop === 0);
    };

    element.addEventListener("scroll", handleScroll);

    handleScroll();

    return () => {
      if (!element) return;
      element.removeEventListener("scroll", handleScroll);
    };
  }, [element]);

  return { scrollTop, isTop };
};

export default useScroll;
