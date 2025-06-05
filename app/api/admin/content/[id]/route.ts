import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/connect';
import Content from '@/lib/db/models/content';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const content = await Content.findById(params.id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch content' }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const data = await req.json();
    const content = await Content.findByIdAndUpdate(params.id, data, { new: true });
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json(content);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update content' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await dbConnect();
    const content = await Content.findByIdAndDelete(params.id);
    if (!content) {
      return NextResponse.json({ error: 'Content not found' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Content deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete content' }, { status: 500 });
  }
}