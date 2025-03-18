import { useEffect, useState } from "react";

export type WebViewMessage = {
  type: string;
  payload?: Record<string, any>;
};

export const usePostMessage = () => {
  const [message, setMessage] = useState<any>(null);

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  useEffect(() => {
    if (!hasReactNativeWebView) return;
    
    const handleMessage = (e: any) => {
      const data = JSON.parse(e.data);

      setMessage(data);
    };

    window.addEventListener("message", handleMessage);
    document.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
      document.removeEventListener("message", handleMessage);
    };
  }, []);

  const postMessage = (message: WebViewMessage) => {
    if (!window.ReactNativeWebView) return;

    window.ReactNativeWebView.postMessage(JSON.stringify(message));
  };

  return { postMessage, message };
};
