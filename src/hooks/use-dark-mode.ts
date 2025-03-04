import useThemeStore from "@/store/use-theme-store";
import { useEffect } from "react";

export default function useDarkMode() {
  const { isDark, setDark, setLight, toggleTheme } = useThemeStore();

  useEffect(() => {
    const html = document.documentElement;
    if (isDark) {
      html.classList.add("dark");
      document.cookie = `theme=dark; path=/; max-age=${60 * 60 * 24 * 365}`;
    } else {
      html.classList.remove("dark");
      document.cookie = `theme=light; path=/; max-age=${60 * 60 * 24 * 365}`;
    }
  }, [isDark]);

  return { isDark, setDark, setLight, toggleTheme };
}
