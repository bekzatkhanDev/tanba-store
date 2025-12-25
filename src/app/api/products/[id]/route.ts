import { NextResponse } from "next/server";
import {
  getProductById,
  adminUpdateProduct,
  adminDeleteProduct,
} from "@/features/products/product.service";
import { validateProductUpdate } from "@/features/products/product.validators";

// ===== GET /api/products/:id =====
export async function GET(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ✅ ВАЖНО

  const res = await getProductById(id);
  return NextResponse.json(res, { status: res.success ? 200 : 404 });
}

// ===== PUT /api/products/:id =====
export async function PUT(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ✅ ВАЖНО
  const body = await req.json();

  const payload = { ...body, id };

  const validation = validateProductUpdate(payload);
  if (!validation.valid) {
    return NextResponse.json(
      {
        success: false,
        error: "Validation error",
        details: validation.errors,
      },
      { status: 400 }
    );
  }

  const res = await adminUpdateProduct(payload);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}

// ===== DELETE /api/products/:id =====
export async function DELETE(
  _: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id } = await ctx.params; // ✅ ВАЖНО

  const res = await adminDeleteProduct(id);
  return NextResponse.json(res, { status: res.success ? 200 : 400 });
}
