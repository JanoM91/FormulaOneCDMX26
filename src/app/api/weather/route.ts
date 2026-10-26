import { NextResponse } from "next/server";
import { getWeather } from "@/lib/providers";
export async function GET() {
  try {
    return NextResponse.json(await getWeather(), {
      headers: {
        "Cache-Control": "public, s-maxage=600, stale-while-revalidate=600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Pronóstico temporalmente no disponible" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
