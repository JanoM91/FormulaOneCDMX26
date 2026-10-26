import { NextResponse } from "next/server";
import { getTeams } from "@/lib/providers";
export async function GET() {
  try {
    return NextResponse.json(await getTeams(), {
      headers: {
        "Cache-Control": "public, s-maxage=900, stale-while-revalidate=900",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Clasificación de constructores pendiente" },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}
