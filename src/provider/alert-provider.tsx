"use client";

import Alert from "@/components/alert/alert";
import useIsMounted from "@/hooks/use-is-mounted";
import useAlertStore from "@/store/use-alert-store";
import React from "react";
import { createPortal } from "react-dom";

const AlertProvider = ({ children }: { children: React.ReactNode }) => {
  const alertState = useAlertStore((state) => state.alertState);
  const isMounted = useIsMounted();

  return (
    <>
      {children}
      {isMounted && createPortal(<Alert {...alertState} />, document.body)}
    </>
  );
};

export default AlertProvider;
