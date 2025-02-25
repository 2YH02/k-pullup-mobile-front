import HomePageClient from "./home-page-client";

const HomePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  return <HomePageClient os={os as string} />;
};

export default HomePage;
