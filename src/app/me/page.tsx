import { myInfo } from "@/api/user";
import { cookies } from "next/headers";
import MePageClient from "./me-page-client";

const MePage = async () => {
  const cookieStore = await cookies();
  const decodeCookie = decodeURIComponent(cookieStore.toString());

  const user = await myInfo(decodeCookie);

  return <MePageClient user={user} />;
};

export default MePage;
