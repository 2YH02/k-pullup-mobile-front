import {
  PageAnimation,
  PageTransitionContext,
} from "@/context/page-transition-context";
import { useContext } from "react";

export const SLIDE_ANIMATION_DURATION = 100;

const usePageTransition = () => {
  const pageTransitionContext = useContext(PageTransitionContext);

  if (!pageTransitionContext) {
    throw new Error(
      "usePageTransition은 PageTransitionContext 내부에서 사용해야 합니다."
    );
  }

  const context = pageTransitionContext;

  const slideLeft = () => {
    return animate("left", context);
  };

  const slideRight = () => {
    return animate("right", context);
  };

  const slideIn = () => {
    if (context.animation.current) {
      const animation = getInAnimation(context.animation.current);
      context.setClassName(animation);
    }
  };

  return { slideLeft, slideRight, slideIn };
};

const getOutAnimation = (animation: PageAnimation) => {
  return animation === "left"
    ? "animate-slide-left-out"
    : "animate-slide-right-out";
};

const getInAnimation = (animation: PageAnimation) => {
  return animation === "left"
    ? "animate-slide-left-in"
    : "animate-slide-right-in";
};

const animate = (animation: PageAnimation, context: PageTransitionContext) => {
  return new Promise((resolve) => {
    const className = getOutAnimation(animation);
    context.setClassName(className);
    context.animation.current = animation;

    setTimeout(resolve, SLIDE_ANIMATION_DURATION);
  });
};

export default usePageTransition;
