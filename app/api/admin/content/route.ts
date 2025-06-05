import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Content from '@/lib/db/models/content';

export async function GET(req: Request) {
  try {
    await dbConnect();
    const content = await Content.find({});
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const data = await req.json();
    const content = await Content.create(data);
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create content' }, { status: 500 });
  }
}