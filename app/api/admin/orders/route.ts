import { NextRequest, NextResponse } from "next/server";
import Order from "@/lib/db/models/order";
import connectToDatabase from "@/lib/db/mongoose";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const statusParam = url.searchParams.get("status") ?? undefined;
    const rawPage = parseInt(url.searchParams.get("page") ?? "1", 10);
    const rawLimit = parseInt(url.searchParams.get("limit") ?? "20", 10);
    const search = url.searchParams.get("search") ?? "";

    const page = Number.isNaN(rawPage) || rawPage < 1 ? 1 : rawPage;
    const MAX_LIMIT = 100;
    let limit =
      Number.isNaN(rawLimit) || rawLimit < 1
        ? 20
        : Math.min(rawLimit, MAX_LIMIT);
    const skip = (page - 1) * limit;

    const filter: Record<string, any> = {};
    if (statusParam) {
      const statuses = statusParam
        .split(",")
        .map((s) => s.trim())
        .filter((s) => s !== "all")
        .filter(Boolean);
      filter.status = statuses.length === 1 ? statuses[0] : { $in: statuses };
    }
    //implement global search
    if (search) {
      filter.$or = [
        { orderNumber: { $regex: search, $options: "i" } },
        { "customer.name": { $regex: search, $options: "i" } },
        { "customer.email": { $regex: search, $options: "i" } },
      ];
    }

    // fields to return in the table (adjust to match your schema)
    const projection = {
      _id: 1,
      orderNumber: 1, // optional, if you have it
      customer: 1,
      total: 1,
      status: 1,
      paymentMethod: 1,
      paymentStatus: 1,
      createdAt: 1,
      updatedAt: 1,
    };

    const [total, data] = await Promise.all([
      Order.countDocuments(filter),
      Order.find(filter)
        .select(projection)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate("customer", "name email")
        .lean(),
    ]);

    const totalPages = Math.max(1, Math.ceil(total / limit));

    return NextResponse.json(
      {
        data,
        pagination: {
          page,
          limit,
          total,
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Orders API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const data = await req.json();
    const order = await Order.create(data);
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
