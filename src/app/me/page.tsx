import wait from "@/utils/wait";
import { SearchParams } from "next/dist/server/request/search-params";
import MePageClient from "./me-page-client";

const MePage = async ({ searchParams }: { searchParams: SearchParams }) => {
  const { os } = await searchParams;

  await wait(2000);
  return <MePageClient os={os as string} />;
};

export default MePage;
