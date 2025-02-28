import useIsDarkMode from "./use-is-dark-mode";
import { toast as toastify } from "react-toastify";

const useToast = () => {
  const isDarkMode = useIsDarkMode();

  const toast = (contents: string) => {
    if (isDarkMode) {
      toastify.dark(contents);
    } else {
      toastify(contents);
    }
  };

  return { toast };
};

export default useToast;
