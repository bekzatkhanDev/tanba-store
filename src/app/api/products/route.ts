import { NextResponse } from "next/server";
import { getPublicProducts, adminCreateProduct } from "@/features/products/product.service";
import { validateProductCreate } from "@/features/products/product.validators";
import { supabaseAdmin } from "@/lib/supabase/admin";

// ===== GET — публичный каталог =====
export async function GET(req: Request) {
  const url = new URL(req.url);

  const filters = {
    q: url.searchParams.get("q") ?? undefined,
    category: url.searchParams.get("category") ?? undefined,
    minPrice: url.searchParams.get("minPrice")
      ? Number(url.searchParams.get("minPrice"))
      : undefined,
    maxPrice: url.searchParams.get("maxPrice")
      ? Number(url.searchParams.get("maxPrice"))
      : undefined,
    page: url.searchParams.get("page")
      ? Number(url.searchParams.get("page"))
      : undefined,
    limit: url.searchParams.get("limit")
      ? Number(url.searchParams.get("limit"))
      : 12,
  };

  const res = await getPublicProducts(filters);
  return NextResponse.json(res);
}

// ===== POST — создание товара + загрузка фото =====
export async function POST(req: Request) {
  try {
    const form = await req.formData();

    // ===== Основные поля =====
    const name = form.get("name") as string;
    const price = Number(form.get("price"));
    const stock = Number(form.get("stock"));
    const category = form.get("category") as string | null;
    const description = form.get("description") as string | null;

    // ✅ МАССИВ РАЗМЕРОВ
    const sizes = form.getAll("sizes") as string[];

    // ===== Файлы изображений =====
    const files = form.getAll("images") as File[];

    // ===== Валидация =====
    const validation = validateProductCreate({
      name,
      price,
      stock,
      category,
      description,
      sizes,
    });

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

    // ===== Загрузка изображений =====
    const imageUrls: string[] = [];

    for (const file of files) {
      const ext = file.name.split(".").pop();
      const fileName = `product-${crypto.randomUUID()}.${ext}`;

      const { data, error } = await supabaseAdmin.storage
        .from("products")
        .upload(fileName, file, {
          cacheControl: "3600",
          contentType: file.type,
        });

      if (error) {
        console.error(error);
        return NextResponse.json(
          { success: false, error: "Image upload failed" },
          { status: 500 }
        );
      }

      const { data: urlData } = supabaseAdmin.storage
        .from("products")
        .getPublicUrl(data.path);

      imageUrls.push(urlData.publicUrl);
    }

    // ===== Создание товара =====
    const res = await adminCreateProduct({
      name,
      price,
      stock,
      category,
      description,
      images: imageUrls,
      sizes, // ✅ СОХРАНЯЕМ В БД
    });

    return NextResponse.json(res, {
      status: res.success ? 200 : 400,
    });
  } catch (e) {
    console.error("Create product error:", e);
    return NextResponse.json(
      { success: false, error: "Server error" },
      { status: 500 }
    );
  }
}
