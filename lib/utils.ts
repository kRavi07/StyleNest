import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";
import { randomUUID } from "crypto";
import axios from "axios";
import { NextResponse } from "next/server";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(
  dateString: string | Date | undefined,
  formatStr: string = "MMM d, yyyy"
): string {
  if (!dateString) return "";
  return format(new Date(dateString), formatStr);
}

export function truncate(str: string, length: number): string {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

// utils/hashFile.ts
export async function hashFileBuffer(buffer: ArrayBuffer): Promise<string> {
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// utils/hashFile.ts
export async function hashFile(file: File): Promise<string> {
  const buffer = await file.arrayBuffer();
  return hashFileBuffer(buffer);
}

// utils/formatCurrency
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
};

export function generateRandomUUID(prefix = "ORDER"): string {
  return `${prefix}-${randomUUID().substring(0, 12)}`;
}

export const getErrorMessage = (error: unknown) => {
  console.error("Error:", error);
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message || "Request failed";
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "An unknown error occurred";
};

//capitalize the first letter
export function capitalizeFirstLetter(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export const errorResponse = (
  message: string,
  status: number,
  errors?: any
) => {
  return NextResponse.json(
    { success: false, message, ...(errors && { errors }) },
    { status }
  );
};
