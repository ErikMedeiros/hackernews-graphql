import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type Context = { prisma: PrismaClient };
const context: Context = { prisma };

export { context, Context };
