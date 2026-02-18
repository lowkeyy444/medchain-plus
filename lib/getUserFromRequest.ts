import { verifyToken } from "./auth";
import { NextRequest } from "next/server";

export function getUserFromRequest(req: NextRequest): { userId: number } | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (!decoded || typeof decoded !== "object" || !("userId" in decoded)) {
    return null;
  }

  return { userId: (decoded as any).userId };
}