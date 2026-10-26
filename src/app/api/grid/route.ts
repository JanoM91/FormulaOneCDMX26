import { NextResponse } from "next/server";
import { FallbackResultsProvider } from "@/lib/providers";
export async function GET() {
  return NextResponse.json(await new FallbackResultsProvider().getGrid(), {
    headers: {
      "Cache-Control": "public, s-maxage=900, stale-while-revalidate=900",
    },
  });
}
