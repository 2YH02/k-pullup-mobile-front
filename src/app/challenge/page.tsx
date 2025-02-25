import ChallengeClient from "./challenge-client";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  return <ChallengeClient os={os as string} />;
};

export default Page;
