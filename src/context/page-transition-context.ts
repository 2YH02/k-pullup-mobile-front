"use client";

import { createContext, Dispatch, SetStateAction } from "react";

type PageAnimation = "left" | "right";

interface PageTransitionContext {
  animation: React.RefObject<PageAnimation>;
  className: string;
  setClassName: Dispatch<SetStateAction<string>>;
}

const PageTransitionContext = createContext<PageTransitionContext | null>(null);

export { PageTransitionContext, type PageAnimation };
