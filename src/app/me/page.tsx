import wait from "@/utils/wait";
import MePageClient from "./me-page-client";

const MePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  await wait(2000);
  return <MePageClient os={os as string} />;
};

export default MePage;
