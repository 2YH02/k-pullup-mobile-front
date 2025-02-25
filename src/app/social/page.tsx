import { SearchParams } from "next/dist/server/request/search-params";
import SocialClient from "./social-client";

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { os } = await searchParams;

  return <SocialClient os={os as string} />;
};

export default Page;
