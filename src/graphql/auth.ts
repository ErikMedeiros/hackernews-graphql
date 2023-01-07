import { compare, hash } from "bcryptjs";
import { sign } from "jsonwebtoken";
import { extendType, nonNull, objectType, stringArg } from "nexus";
import { env } from "../utils/env";

const AuthPayload = objectType({
  name: "AuthPayload",
  definition: (t) => {
    t.nonNull.string("token");
    t.nonNull.field("user", { type: "User" });
  },
});

const AuthMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("signup", {
      type: "AuthPayload",
      args: {
        email: nonNull(stringArg()),
        password: nonNull(stringArg()),
        name: nonNull(stringArg()),
      },
      resolve: async (_, { password, ...args }, { prisma }) => {
        const hashed = await hash(password, 10);
        const data = { ...args, password: hashed };

        const user = await prisma.user.create({ data });
        const token = sign({ userId: user.id }, env.APP_SECRET);

        return { token, user };
      },
    });
    t.nonNull.field("login", {
      type: "AuthPayload",
      args: { email: nonNull(stringArg()), password: nonNull(stringArg()) },
      resolve: async (_, { email, password }, { prisma }) => {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) throw new Error("invalid credentials");

        const isValid = await compare(password, user.password);
        if (!isValid) throw new Error("invalid credentials");

        const token = sign({ userId: user.id }, env.APP_SECRET);
        return { token, user };
      },
    });
  },
});

export { AuthPayload, AuthMutation };
