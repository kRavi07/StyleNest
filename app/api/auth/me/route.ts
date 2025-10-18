// app/api/auth/me/route.ts
import { getAuthUser, requireAuthUser } from "@/lib/auth/server-auth";
import { NextRequest, NextResponse } from "next/server";
import User from "@/lib/db/models/user";
import { AppError } from "@/lib/error/AppError";
import { handleApiErrorResponse } from "@/lib/error/utils";
export async function GET() {
  try {
    const user = await requireAuthUser();
    if (!user)
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const profile = await User.findById(user.id).select(
      "-password -resetPasswordToken -resetPasswordExpires"
    );

    if (!profile) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(profile, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuthUser();
    if (!user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const updateData: Partial<{
      name: string;
      email: string;
      mobileno: string;
    }> = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.email !== undefined) updateData.email = body.email;
    if (body.mobileno !== undefined) updateData.mobileno = body.mobileno;

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields to update" },
        { status: 400 }
      );
    }

    const updatedUser = await User.findByIdAndUpdate(user.id, updateData, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
