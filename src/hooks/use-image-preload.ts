import { useEffect } from "react";

const useImagePreload = (images: string[]) => {
  useEffect(() => {
    images.forEach((src) => {
      const img = new window.Image();
      img.src = src;
    });
  }, []);
};

export default useImagePreload;
