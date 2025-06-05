import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import { verifyToken, isAdmin } from "@/lib/auth";

// GET a single order by ID
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await verifyToken(req);
    if (!authResult.success || !authResult.user) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id: userId, role } = authResult.user;
    const { id: orderId } = params;

    // Connect to the database
    await connectToDatabase();

    // Find order by ID
    const order = await Order.findById(orderId);

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    // Regular users can only see their own orders
    if (role !== "admin" && order.userId.toString() !== userId) {
      return NextResponse.json(
        { success: false, error: "Not authorized to access this order" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error fetching order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update an order (admin only)
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Verify admin permission
    const authResult = await isAdmin(req);
    if (!authResult.success) {
      return NextResponse.json(
        { success: false, error: authResult.error },
        { status: authResult.status }
      );
    }

    const { id } = params;
    const updates = await req.json();

    await connectToDatabase();

    // Find and update order
    const order = await Order.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });

    if (!order) {
      return NextResponse.json(
        { success: false, error: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: order });
  } catch (error) {
    console.error("Error updating order:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
