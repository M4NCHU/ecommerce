import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductValidator } from "@/lib/validators/product";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();

    // check user session
    if (!session?.user || session.user.role !== "ADMIN")
      return new Response("Unauthorized", { status: 401 });

    // parse request
    const body = await req.json();
    const { name, categoryId, price, primaryImageUrl, stock, description } =
      ProductValidator.parse(body);

    const productExists = await db.product.findFirst({
      where: {
        name: name,
      },
    });

    // check if Product exists in db
    if (productExists)
      return new Response("Product with this name already exists", {
        status: 409,
      });

    // create Product

    const newProduct = await db.product.create({
      data: {
        name: name,
        description: description,
        price: price,
        primaryImageUrl: primaryImageUrl,
        stock: stock,
        categoryId: categoryId,
      },
    });

    return new Response(newProduct.name);
  } catch (error: any) {
    // handle errors
    if (error instanceof z.ZodError)
      return new Response(error.message, { status: 422 });
    return new Response("Could not create product", { status: 500 });
  }
}
