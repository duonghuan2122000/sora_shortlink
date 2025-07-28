import jose from "jose";
import ENV from "../constants/ENV";

const jwtSecret = new TextEncoder().encode(ENV.JwtSecret);

const alg = "HS256";

/**
 * Hàm tạo token
 * @param payload
 * @returns token
 */
async function generateToken(
  payload: { [key: string]: any },
  {
    expiresAt,
  }: {
    expiresAt: Date;
  }
): Promise<string> {
  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ENV.JwtIssuer)
    .setAudience(ENV.JwtAudience)
    .setExpirationTime(expiresAt)
    .sign(jwtSecret);
  return jwt;
}

export default {
  generateToken,
} as const;
