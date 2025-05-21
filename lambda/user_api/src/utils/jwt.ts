import jwt, { JwtPayload } from "jsonwebtoken";

export function verifyAccessToken(token: string) {
  token = token.replace(/^bearer\s/gi, "");
  const verify = jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string
  ) as JwtPayload;
  return verify as { userId: string };
}
