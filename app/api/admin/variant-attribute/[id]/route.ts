import { VariantAttribute } from "@/lib/db/models/attribute";
import connectToDatabase from "@/lib/db/mongoose";
import { NextResponse } from "next/server";

type Params = {
  id: string;
};

export async function GET(_: Request, { params }: { params: Params }) {
  const p = await params;
  await connectToDatabase();
  const attribute = await VariantAttribute.findById(p.id);
  return NextResponse.json(attribute);
}

export async function PATCH(req: Request, { params }: { params: Params }) {
  const p = await params;
  await connectToDatabase;
  const body = await req.json();
  const updated = await VariantAttribute.findByIdAndUpdate(p.id, body, {
    new: true,
  });
  return NextResponse.json(updated);
}

export async function DELETE(_: Request, { params }: { params: Params }) {
  const p = await params;
  await connectToDatabase();

  const deleted = await VariantAttribute.findByIdAndUpdate(p.id, {
    isActive: false,
  });
  return NextResponse.json({ success: true, deleted });
}
