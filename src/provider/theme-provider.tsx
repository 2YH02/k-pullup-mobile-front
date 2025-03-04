"use client";

import useDarkMode from "@/hooks/use-dark-mode";

const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  useDarkMode();
  return <>{children}</>;
};

export default ThemeProvider;
