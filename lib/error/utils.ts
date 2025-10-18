import { NextResponse } from "next/server";
import { AppError } from "./AppError";

export const handleApiErrorResponse = (err: any) => {
  if (err instanceof AppError) {
    return NextResponse.json(
      { error: err.message, details: err.details ?? null },
      { status: err.statusCode }
    );
  }
  return NextResponse.json(
    { success: false, message: "Internal server error" },
    { status: 500 }
  );
};
