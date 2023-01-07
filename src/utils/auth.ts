import { verify } from "jsonwebtoken";
import { env } from "./env";

type AuthTokenPayload = { userId: number };

const decodeToken = (authHeader: string) => {
  const token = authHeader.replace("Bearer ", "");
  if (!token) throw new Error("invalid token");

  return verify(token, env.APP_SECRET) as AuthTokenPayload;
};

export { decodeToken, type AuthTokenPayload };
