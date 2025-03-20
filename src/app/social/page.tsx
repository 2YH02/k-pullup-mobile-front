import SocialClient from "./social-client";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os: deviceType } = await searchParams;

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  const os = hasReactNativeWebView ? deviceType : "Windows";

  return <SocialClient os={os as string} />;
};

export default Page;
