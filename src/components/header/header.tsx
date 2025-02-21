"use client";

import useIsMounted from "@/hooks/use-is-mounted";
import { useHeaderStore } from "@/store/use-header-store";
import { usePathname } from "next/navigation";

const Header = () => {
  const isMounted = useIsMounted();
  const pathname = usePathname();
  const { title } = useHeaderStore();

  if (pathname === "/") return null;

  if (!isMounted)
    return (
      <div className="shrink-0 w-full h-12 p-2 text-xl font-bold flex items-center" />
    );

  if (!title) return null;

  return (
    <div className="shrink-0 w-full h-12 p-2 text-xl font-bold flex items-center">
      {title}
    </div>
  );
};

export default Header;
