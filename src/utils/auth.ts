import * as argon2 from "argon2";
import * as jwt from "jsonwebtoken";

export async function hashPassword(password: string): Promise<string> {
  try {
    return await argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: 2 ** 16,
      timeCost: 3,
      parallelism: 1,
    });
  } catch (error) {
    console.error("Error hashing password.", error);
    throw new Error("Password hashing failed");
  }
}

export async function comparePasswords(
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> {
  try {
    return await argon2.verify(hashedPassword, plainPassword);
  } catch (error) {
    console.error("Error verifying password", error);
    return false;
  }
}

export function generateToken(userId: number): string {
  return jwt.sign({ id: userId }, "default_secret", {
    expiresIn: "1h",
  });
}

export function verifyToken(token: string): { id: number } | null {
  try {
    const decoded = jwt.verify(token, "default_secret") as { id: number };
    return decoded;
  } catch (error) {
    return null;
  }
}

export function extractTokenFromHeader(
  authHeader: string | null
): string | null {
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return null;
  }

  return authHeader.substring(7); // "Bearer "の後の部分を取得
}

export async function authMiddleware(headers: Headers) {
  const authHeader = headers.get("authorization");
  const token = extractTokenFromHeader(authHeader);

  if (!token) {
    return {
      authenticated: false,
      error: "Authentication token required",
    };
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return {
      authenticated: false,
      error: "Invalid or expired token",
    };
  }

  return {
    authenticated: true,
    userId: decoded.id,
  };
}
