import SocialClient from "./social-client";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  return <SocialClient os={os as string} />;
};

export default Page;
