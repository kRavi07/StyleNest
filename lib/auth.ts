import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
// Interface for decoded token
interface DecodedToken {
  id: string;
  email: string;
  role: string;
}

// Verify JWT token from request headers
export async function verifyToken(req: NextRequest) {
  // Get authorization header
  const authHeader = req.headers.get("authorization");

  const token = req.cookies.get("token")?.value || "";

  /*if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      success: false,
      error: "No token provided",
      status: 401,
    };
  }

  // Extract token
  const token = authHeader.split(" ")[1];
  */

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "your-secret-key"
    ) as DecodedToken;

    return {
      success: true,
      user: {
        id: decoded.id,
        email: decoded.email,
        role: decoded.role,
      },
    };
  } catch (error) {
    return {
      success: false,
      error: "Invalid token",
      status: 401,
    };
  }
}

// Check if user is admin
export async function isAdmin(req: NextRequest) {
  const authResult = await verifyToken(req);

  if (!authResult.success) {
    return authResult;
  }

  if (authResult?.user?.role !== "admin") {
    return {
      success: false,
      error: "Access denied. Admin rights required.",
      status: 403,
    };
  }

  return authResult;
}

// Generate JWT token
export function generateToken(user: {
  id: string;
  email: string;
  role: string;
}) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || "your-secret-key",
    { expiresIn: "7d" }
  );
}

export const getAuthToken = () => {
  //get from local storage
  const auth = localStorage.getItem("drimcot-auth");

  if (auth) {
    const parsedAuth = JSON.parse(auth);
    return parsedAuth.token;
  }
  return null;
};
