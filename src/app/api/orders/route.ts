// app/api/orders/route.ts

import { NextResponse } from "next/server";
import { createOrder } from "@/features/orders/order.service";
import { adminGetOrders } from "@/features/orders/order.service";
import type { Order } from "@/features/orders/order.types";

const allowedStatuses: Order["status"][] = [
  "pending",
  "confirmed",
  "delivered",
  "cancelled",
];

export async function GET(req: Request) {
  const url = new URL(req.url);

  const rawStatus = url.searchParams.get("status") ?? undefined;

  // validate & cast
  const status = allowedStatuses.includes(rawStatus as Order["status"])
    ? (rawStatus as Order["status"])
    : undefined;

  const filters = {
    q: url.searchParams.get("q") ?? undefined,
    status, // now typed correctly
    page: url.searchParams.get("page")
      ? Number(url.searchParams.get("page"))
      : undefined,
    limit: url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : undefined,
  };

  const res = await adminGetOrders(filters);
  return NextResponse.json(res);
}

export async function POST(req: Request) {
  const payload = await req.json();
  const res = await createOrder(payload);

  return NextResponse.json(res, {
    status: res.success ? 200 : 400,
  });
}
