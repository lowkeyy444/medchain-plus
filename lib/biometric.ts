import crypto from "crypto";

export function generateBiometricToken() {
  return crypto.randomBytes(16).toString("hex");
}

export function hashBiometricToken(token: string) {
  return crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
}