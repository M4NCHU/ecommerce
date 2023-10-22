import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    // check user session
    if (!session?.user || session.user.role !== "ADMIN")
      return new Response("Unauthorized", { status: 401 });

    // parse request
    const body = await req.json();
    const { itemId } = body;

    // const { id } = body;

    const deletedproduct = await db.product.delete({
      where: {
        id: itemId,
      },
    });

    // Sprawdź, czy kategoria została usunięta
    if (!deletedproduct)
      return new Response("product with this itemId does not exist", {
        status: 404,
      });

    return new Response("product deleted successfully", { status: 200 });
  } catch (error: any) {
    // handle errors
    return new Response(error.message, { status: 422 });
  }
}
