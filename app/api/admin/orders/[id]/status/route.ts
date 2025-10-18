import { requireAuthAdmin } from "@/lib/auth/server-auth";
import { handleApiErrorResponse } from "@/lib/error/utils";
import { updateOrderStatus } from "@/lib/service/order";
import { NextRequest, NextResponse } from "next/server";

type Params = {
  params: Promise<{
    id: string;
  }>;
};
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params;
    const admin = await requireAuthAdmin();
    if (!admin) {
      return NextResponse.json(
        { success: false, message: "You are not authorized" },
        { status: 403 }
      );
    }

    const { status } = await request.json();

    const order = await updateOrderStatus(id, status);

    if (!order) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: order,
    });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
