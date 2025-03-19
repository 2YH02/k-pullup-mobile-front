import PrivacyCient from "./privacy-cient";

const Privacy = async ({
  searchParams,
}: {
  searchParams: Promise<{ os: string }>;
}) => {
  const { os } = await searchParams;

  return <PrivacyCient os={os} />;
};

export default Privacy;
