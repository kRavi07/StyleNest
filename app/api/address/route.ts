//api routes to add address for user
import { NextResponse } from "next/server";
import Address from "@/lib/db/models/address";
import connectToDatabase, { toObjectId } from "@/lib/db/mongoose";
import { Address as AddressType } from "@/types";
import { AddressSchema } from "@/lib/validation/addresss";
import { requireAuthUser } from "@/lib/auth/server-auth";
//GET route
export async function GET() {
  try {
    await connectToDatabase();
    const addresses = await Address.find();
    return NextResponse.json({ addresses });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch addresses" },
      { status: 500 }
    );
  }
}

//POST route to add address for user
export async function POST(request: Request) {
  try {
    const auth = await requireAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const parsedBody = AddressSchema.parse(body);
    await connectToDatabase();
    const newAddress = new Address({
      ...parsedBody,
      user: toObjectId(auth.id),
    });
    await newAddress.save();
    return NextResponse.json(
      { message: "Address added successfully", address: newAddress },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to add address" },
      { status: 500 }
    );
  }
}

//PUT route to update address for user
export async function PUT(request: Request) {
  try {
    const auth = await requireAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const body = await request.json();
    const { _id: addressId, ...rest } = body;
    await connectToDatabase();
    const address = await Address.findByIdAndUpdate(addressId, rest, {
      new: true,
    });
    return NextResponse.json(address);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update address" },
      { status: 500 }
    );
  }
}

//DELETE route to delete address for user
export async function DELETE(request: Request) {
  try {
    const auth = await requireAuthUser();
    if (!auth) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("addressId");
    await connectToDatabase();
    await Address.findByIdAndDelete(addressId);
    return NextResponse.json({ message: "Address deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete address" },
      { status: 500 }
    );
  }
}
