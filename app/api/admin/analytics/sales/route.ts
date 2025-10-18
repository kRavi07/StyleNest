import connectToDatabase from "@/lib/db/mongoose";
import { AnalyticsService } from "@/lib/service/analytics";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");
    const start = searchParams.get("start")
      ? new Date(searchParams.get("start") as string)
      : undefined;
    const end = searchParams.get("end")
      ? new Date(searchParams.get("end") as string)
      : undefined;

    const range = { start, end };
    let result;

    switch (type) {
      case "sales-by-month":
        result = await AnalyticsService.getSalesByMonth(range);
        break;
      case "top-products":
        result = await AnalyticsService.getTopProducts(10, range);
        break;
      case "revenue-by-payment-method":
        result = await AnalyticsService.getRevenueByPaymentMethod(range);
        break;
      case "clv":
        result = await AnalyticsService.getCustomerLifetimeValue(range);
        break;
      case "aov":
        result = await AnalyticsService.getAverageOrderValue(range);
        break;
      case "summary":
        result = await AnalyticsService.getSummary(range);
        break;
      default:
        return NextResponse.json(
          { error: "Invalid or missing 'type' parameter" },
          { status: 400 }
        );
    }
    if (!result)
      return NextResponse.json(
        { message: "No data found", data: null },
        { status: 200 }
      );

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      {
        status: 200,
      }
    );
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
