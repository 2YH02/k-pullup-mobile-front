"use client";

import { useSessionStore } from "@/store/use-session-store";
import { useEffect } from "react";

const CheckFirstVisitProvider = ({ children }: React.PropsWithChildren) => {
  const { checkFirstVisit } = useSessionStore();

  useEffect(() => {
    checkFirstVisit();
  }, []);

  return children;
};

export default CheckFirstVisitProvider;
