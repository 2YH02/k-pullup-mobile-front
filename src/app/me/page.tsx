import { myInfo } from "@/api/user";
import { cookies } from "next/headers";
import MePageClient from "./me-page-client";

const MePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const cookieStore = await cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const { os: deviceType } = await searchParams;

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  const os = hasReactNativeWebView ? deviceType : "Windows";

  const user = await myInfo(decodeCookie);

  return <MePageClient os={os as string} user={user} />;
};

export default MePage;
