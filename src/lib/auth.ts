import { NextRequest } from "next/server";
import { verifyToken } from "./jwt";

export function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.substring(7);
}

export function getUserIdFromToken(token: string): number | null {
  const decoded = verifyToken(token);
  if (!decoded || typeof decoded === "string") {
    return null;
  }
  return (decoded as any).userId;
}

export function authenticateRequest(request: NextRequest): number | null {
  const token = getTokenFromRequest(request);
  if (!token) {
    return null;
  }
  return getUserIdFromToken(token);
}