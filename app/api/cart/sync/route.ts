import connectToDatabase from "@/lib/db/mongoose";
import { NextRequest, NextResponse } from "next/server";
import { requireAuthUser } from "@/lib/auth/server-auth";
import { syncCart } from "@/lib/services/cartservices";

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const user = await requireAuthUser();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const localCart = await req.json();
    const dbCart = await syncCart(user.id, localCart);

    return NextResponse.json({ cart: dbCart });
  } catch (error) {
    console.error("Error syncing cart:", error);
    return NextResponse.json({ error: "Failed to sync cart" }, { status: 500 });
  }
}
