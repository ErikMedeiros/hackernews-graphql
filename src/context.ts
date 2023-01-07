import { StartStandaloneServerOptions } from "@apollo/server/dist/esm/standalone";
import { PrismaClient } from "@prisma/client";
import { AuthTokenPayload, decodeToken } from "./utils/auth";

const prisma = new PrismaClient();

type Context = { prisma: PrismaClient; userId?: number };
type ContextFactory = NonNullable<
  StartStandaloneServerOptions<Context>["context"]
>;

const context: ContextFactory = async ({ req: { headers } }) => {
  let token: AuthTokenPayload | undefined;
  if (headers.authorization) token = decodeToken(headers.authorization);

  return { prisma, userId: token?.userId };
};

export { context, type Context };
