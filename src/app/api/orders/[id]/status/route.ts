import { NextResponse } from "next/server";
import { adminUpdateOrderStatus } from "@/features/orders/order.service";
import { validateOrderStatusUpdate } from "@/features/orders/order.validators";

export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const body = await req.json();
  const payload = { id: ctx.params.id, status: body.status };

  const validation = validateOrderStatusUpdate(payload);
  if (!validation.valid) {
    return NextResponse.json(
      { success: false, error: "Validation error", details: validation.errors },
      { status: 400 }
    );
  }

  const res = await adminUpdateOrderStatus(payload);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}
