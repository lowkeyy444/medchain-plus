import { verifyToken } from "./auth";
import { NextRequest } from "next/server";

type TokenPayload = {
  userId: number;
  email: string;
  hospitalId: number | null;
};

export function getUserFromRequest(req: NextRequest): TokenPayload | null {
  const authHeader = req.headers.get("authorization");

  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }

  const token = authHeader.split(" ")[1];
  const decoded = verifyToken(token);

  if (
    !decoded ||
    typeof decoded !== "object" ||
    !("userId" in decoded)
  ) {
    return null;
  }

  return decoded as TokenPayload;
}