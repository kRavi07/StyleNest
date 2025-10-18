import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import { getPaginationParams } from "@/lib/utils/pagination";
import { OrderService } from "@/lib/service/order/orderService";
import { mapOrderFilters } from "@/lib/service/order";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(req: NextRequest, { params }: Params) {
  try {
    await connectToDatabase();

    const { id } = await params;

    const url = new URL(req.url);
    const {
      page,
      limit,
      search,
      filters: rawFilters,
    } = getPaginationParams(url);

    const filters = mapOrderFilters(rawFilters);

    filters["customer.id"] = id;

    const orders = await OrderService.paginate({
      page,
      limit,
      filters,
      search,
      searchFields: ["orderNumber"],
      deselect: ["items", "shippingAddress", "billingAddress"],
      populate: ["items.productId"],
      countFields: ["items"],
      sort: { createdAt: -1 },
    });
    return NextResponse.json(orders);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to fetch customer orders" },
      { status: 500 }
    );
  }
}
