import { SearchParams } from "next/dist/server/request/search-params";
import ChallengeClient from "./challenge-client";

const Page = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { os } = await searchParams;

  return <ChallengeClient os={os as string} />;
};

export default Page;
