"use client";

import { gid } from "@/utils/gid";
import { useEffect } from "react";

const CidProvider = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const setCid = () => {
      localStorage.setItem("cid", JSON.stringify({ cid: gid() }));
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
