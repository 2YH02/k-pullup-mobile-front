import MePageClient from "./me-page-client";

const MePage = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  return <MePageClient os={os as string} />;
};

export default MePage;
