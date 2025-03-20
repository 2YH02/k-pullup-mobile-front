import HomePageClient from "./home-page-client";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os: deviceType } = await searchParams;

  const hasReactNativeWebView =
    typeof window != "undefined" && window.ReactNativeWebView != null;

  const os = hasReactNativeWebView ? deviceType : "Windows";

  return <HomePageClient os={os as string} />;
};

export default HomePage;
