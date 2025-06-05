import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Customer from '@/lib/db/models/customer';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const customers = await Customer.find({});
    return NextResponse.json(customers);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const customer = await Customer.create(data);
    return NextResponse.json(customer);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}