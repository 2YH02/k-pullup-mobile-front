import { SearchParams } from "next/dist/server/request/search-params";
import HomePageClient from "./home-page-client";

const HomePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { os } = await searchParams;

  return <HomePageClient os={os as string} />;
};

export default HomePage;
