import { NextRequest, NextResponse } from "next/server";
import { searchBooks } from "@/lib/api/openlibrary";

export const runtime = "edge";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const sp = request.nextUrl.searchParams;

  try {
    const data = await searchBooks({
      query: sp.get("q") ?? undefined,
      subject: sp.get("subject") ?? undefined,
      sort: sp.get("sort") ?? undefined,
      page: Number(sp.get("page")) || 1,
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
        "x-cache-status": "MISS",
        Vary: "Accept-Encoding",
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}

