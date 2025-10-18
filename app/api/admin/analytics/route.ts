import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/db/mongoose";
import Order from "@/lib/db/models/order";
import Product from "@/lib/db/models/product";
import User from "@/lib/db/models/user";

export async function GET(req: Request) {
  try {
    await connectToDatabase();

    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get("days") || "7", 10);

    const now = new Date();
    const sinceDate = new Date(now);
    sinceDate.setDate(now.getDate() - days);

    const prevSinceDate = new Date(now);
    prevSinceDate.setDate(now.getDate() - days * 2);

    const prevUntilDate = new Date(sinceDate); // end of previous period

    // --- Total revenue for current period ---
    const revenueAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sinceDate } } },
      { $group: { _id: null, total: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAgg[0]?.total || 0;

    // --- Top products (count only, not full list) ---
    const topProductsAgg = await Order.aggregate([
      { $match: { createdAt: { $gte: sinceDate } } },
      { $unwind: "$items" }, // assumes order.items = [{ productId, qty }]
      { $group: { _id: "$items.productId", count: { $sum: "$items.qty" } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);
    const topProductsCount = topProductsAgg.length;

    // --- Customer stats (counts only) ---
    const [totalCustomers, activeCustomers] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ status: "active" }),
    ]);

    // --- Recent orders counts + comparison ---
    const [currentOrders, prevOrders] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: sinceDate } }),
      Order.countDocuments({
        createdAt: { $gte: prevSinceDate, $lt: prevUntilDate },
      }),
    ]);

    const orderChangePercent =
      prevOrders === 0
        ? currentOrders > 0
          ? 100
          : 0
        : ((currentOrders - prevOrders) / prevOrders) * 100;

    return NextResponse.json(
      {
        totalRevenue,
        topProducts: {
          count: topProductsCount,
        },
        customerStats: {
          total: totalCustomers,
          active: activeCustomers,
        },
        recentOrders: {
          count: currentOrders,
          previousCount: prevOrders,
          changePercent: orderChangePercent,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Analytics API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
