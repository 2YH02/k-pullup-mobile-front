"use client";

import PrivacyPolicy from "@/app/signin/layout/privacy-policy";
import { useFullPageModalStore } from "@/store/use-full-page-modal.store";
import { useEffect } from "react";

const PrivacyCient = ({ os = "Windows" }: { os?: string }) => {
  const { show } = useFullPageModalStore();

  useEffect(() => {
    show("privacy-policy");
  }, []);
  
  return <PrivacyPolicy os={os} back />;
};

export default PrivacyCient;
