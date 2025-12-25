// app/api/stats/route.ts

import { NextResponse } from "next/server";
import { getStats } from "@/features/stats/stats.service";

export async function GET(req: Request) {
  const url = new URL(req.url);

  const period = (url.searchParams.get("period") ?? "month") as any;

  const from = url.searchParams.get("from") ?? undefined;
  const to = url.searchParams.get("to") ?? undefined;

  const customRange =
    period === "custom" && from && to
      ? { from, to }
      : undefined;

  const res = await getStats(period, customRange);

  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}
