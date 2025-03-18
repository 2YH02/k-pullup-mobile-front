"use client";

import { useEffect, useId } from "react";

const CidProvider = ({ children }: { children: React.ReactNode }) => {
  const id = useId();

  useEffect(() => {
    const setCid = () => {
      localStorage.setItem("cid", JSON.stringify({ cid: id }));
    };

    const handleStorage = (e: StorageEvent) => {
      if (e.key === "cid") {
        const cid = localStorage.getItem("cid");
        if (!cid) {
          setCid();
        }
      }
    };

    setCid();

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  return <>{children}</>;
};

export default CidProvider;
