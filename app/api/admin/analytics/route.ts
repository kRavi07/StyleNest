import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Order from '@/lib/db/models/order';
import Product from '@/lib/db/models/product';
import Customer from '@/lib/db/models/customer';

export async function GET(req: Request) {
  try {
    await dbConnect();
    
    // Get total revenue
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    
    // Get top products
    const products = await Product.find({}).limit(5);
    
    // Get customer stats
    const customers = await Customer.find({});
    const totalCustomers = customers.length;
    const activeCustomers = customers.filter(c => c.status === 'active').length;
    
    // Get recent orders
    const recentOrders = await Order.find({})
      .sort({ createdAt: -1 })
      .limit(5);
    
    return NextResponse.json({
      totalRevenue,
      topProducts: products,
      customerStats: {
        total: totalCustomers,
        active: activeCustomers
      },
      recentOrders
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
  }
}