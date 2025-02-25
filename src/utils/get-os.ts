const getOs = (userAgent: string): "Windows" | "Android" | "iOS" | "" => {
  if (userAgent.includes("Windows")) return "Windows";
  if (userAgent.includes("Android")) return "Android";
  if (
    userAgent.includes("iPhone") ||
    userAgent.includes("iPad") ||
    userAgent.includes("iPod")
  )
    return "iOS";

  return "";
};

export default getOs;
