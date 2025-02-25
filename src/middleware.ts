import { NextRequest, NextResponse, userAgent } from "next/server";

export function middleware(request: NextRequest) {
  const url = request.nextUrl;
  const { os } = userAgent(request);

  url.searchParams.set("os", os.name || "");

  return NextResponse.rewrite(url);
}
