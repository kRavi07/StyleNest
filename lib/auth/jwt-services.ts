import jwt from "jsonwebtoken";
import { UserDocument } from "../db/models/user";

export const verifyJwtToken = async (
  token: string
): Promise<UserDocument | null> => {
  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    );
    return decoded as UserDocument;
  } catch (error) {
    console.error("Error verifying JWT token:", error);
    throw error;
  }
};
