import wait from "@/utils/wait";
import MePageClient from "./me-page-client";

const MePage = async () => {
  await wait(2000);
  return <MePageClient />;
};

export default MePage;
