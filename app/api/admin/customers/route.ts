import { requireAuthAdmin } from "@/lib/auth/server-auth";
import connectToDatabase from "@/lib/db/mongoose";
import { handleApiErrorResponse } from "@/lib/error/utils";
import { getUsers } from "@/lib/service/user";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthAdmin();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "You are not authorized" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status") || "";

    await connectToDatabase();

    const users = await getUsers({
      page,
      limit,
      search,
      status,
    });

    return NextResponse.json({
      success: true,
      data: users,
    });
  } catch (error) {
    return handleApiErrorResponse(error);
  }
}
