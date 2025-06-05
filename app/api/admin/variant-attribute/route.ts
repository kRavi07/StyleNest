// GET & POST
import { VariantAttribute } from "@/lib/db/models/attribute";
import connectToDatabase from "@/lib/db/mongoose";
import { initializeApp } from "@/lib/init";
import { NextResponse } from "next/server";

export async function GET() {
  await connectToDatabase();
  initializeApp();
  const attributes = await VariantAttribute.find({});
  return NextResponse.json(attributes);
}

export async function POST(req: Request) {
  await connectToDatabase();
  const body = await req.json();

  const { name, label, values } = body;

  if (!name || !label || !Array.isArray(values)) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const created = await VariantAttribute.create({
    name: name.toLowerCase(),
    label,
    values,
  });

  return NextResponse.json(
    {
      success: true,
      message: "Variant attribute created successfully",
      data: created,
    },
    { status: 201 }
  );
}
