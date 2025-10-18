import Order from "@/lib/db/models/order";
type DateRange = { start?: Date; end?: Date };

function buildDateMatch({ start, end }: DateRange) {
  const match: Record<string, any> = { paymentStatus: "paid" };

  if (start || end) {
    match.createdAt = {};
    if (start) match.createdAt.$gte = start;
    if (end) match.createdAt.$lte = end;
  }

  return match;
}

export const AnalyticsService = {
  async getSalesByMonth(range: DateRange = {}) {
    return Order.aggregate([
      { $match: buildDateMatch(range) },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalSales: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
  },

  async getTopProducts(limit = 10, range: DateRange = {}) {
    return Order.aggregate([
      { $match: buildDateMatch(range) },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.productId",
          name: { $first: "$items.name" },
          sku: { $first: "$items.sku" },
          totalQuantity: { $sum: "$items.quantity" },
          totalSales: {
            $sum: { $multiply: ["$items.price", "$items.quantity"] },
          },
        },
      },
      { $sort: { totalQuantity: -1 } },
      { $limit: limit },
    ]);
  },

  async getRevenueByPaymentMethod(range: DateRange = {}) {
    return Order.aggregate([
      { $match: buildDateMatch(range) },
      {
        $group: {
          _id: "$paymentMethod",
          totalRevenue: { $sum: "$total" },
          orderCount: { $sum: 1 },
        },
      },
    ]);
  },

  async getCustomerLifetimeValue(range: DateRange = {}) {
    return Order.aggregate([
      { $match: buildDateMatch(range) },
      {
        $group: {
          _id: "$customer.id",
          customerName: { $first: "$customer.name" },
          customerEmail: { $first: "$customer.email" },
          lifetimeValue: { $sum: "$total" },
          ordersCount: { $sum: 1 },
        },
      },
      { $sort: { lifetimeValue: -1 } },
    ]);
  },

  async getAverageOrderValue(range: DateRange = {}) {
    const result = await Order.aggregate([
      { $match: buildDateMatch(range) },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$total" },
          totalOrders: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          averageOrderValue: {
            $cond: [
              { $eq: ["$totalOrders", 0] },
              0,
              { $divide: ["$totalRevenue", "$totalOrders"] },
            ],
          },
        },
      },
    ]);
    return result[0] || { averageOrderValue: 0 };
  },

  async getSummary(range: DateRange = {}) {
    const [salesByMonth, topProducts, revenueByPaymentMethod, clv, aov] =
      await Promise.all([
        this.getSalesByMonth(range),
        this.getTopProducts(5, range),
        this.getRevenueByPaymentMethod(range),
        this.getCustomerLifetimeValue(range),
        this.getAverageOrderValue(range),
      ]);

    return {
      salesByMonth,
      topProducts,
      revenueByPaymentMethod,
      customerLifetimeValue: clv,
      averageOrderValue: aov.averageOrderValue,
    };
  },
};
