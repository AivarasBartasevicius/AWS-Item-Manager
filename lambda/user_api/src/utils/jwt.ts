import jwt, { JwtPayload } from "jsonwebtoken";

export function verifyAccessToken(token: string) {
  const verify = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as JwtPayload;
  return verify as { userId: string };
}
