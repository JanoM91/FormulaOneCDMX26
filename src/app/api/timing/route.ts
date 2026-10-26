import { NextResponse } from "next/server";
import { OpenF1Provider, demoTiming } from "@/lib/providers";
export const maxDuration = 60;
export async function GET(request: Request) {
  if (new URL(request.url).searchParams.get("mode") === "demo")
    return NextResponse.json(demoTiming());
  try {
    return NextResponse.json(await new OpenF1Provider().getTiming(), {
      headers: {
        "Cache-Control": "public, s-maxage=30, stale-while-revalidate=30",
      },
    });
  } catch {
    return NextResponse.json(
      {
        error:
          "No pudimos actualizar OpenF1. Conserva el último dato disponible e inténtalo de nuevo.",
      },
      {
        status: 503,
        headers: { "Cache-Control": "no-store", "Retry-After": "60" },
      },
    );
  }
}
