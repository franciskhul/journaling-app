import jwt, { JwtPayload, Secret } from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET!;

type Role = "ADMIN" | "USER";

type UserPayload = {
  id: string;
  email: string;
  role: Role;
};

type TokenPayload = { id: string };

export function generateAccessToken(user: UserPayload): string {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );
}

export function generateRefreshToken(user: TokenPayload) {
  return jwt.sign({ id: user.id }, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
}

export function verifyToken<T extends JwtPayload = JwtPayload>(
  token: string,
  secret: Secret
): T | null {
  try {
    return jwt.verify(token, secret) as T;
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      console.error("JWT Error:", error.message);
    } else if (error instanceof jwt.TokenExpiredError) {
      console.error("Token Expired:", error.message);
    } else if (error instanceof jwt.NotBeforeError) {
      console.error("Token Not Active Yet:", error.message);
    } else if (error instanceof Error) {
      console.error("Unknown JWT Error:", error.message);
    } else {
      console.error("Unexpected Error:", error);
    }
    return null;
  }
}
