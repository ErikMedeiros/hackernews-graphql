import { objectType, extendType, nonNull, stringArg, intArg } from "nexus";

const Link = objectType({
  name: "Link",
  definition: (t) => {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.field("postedBy", {
      type: "User",
      resolve: ({ id }, _, { prisma }) =>
        prisma.link.findUnique({ where: { id } }).postedBy(),
    });
  },
});

const LinkQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve: (_, __, { prisma }) => prisma.link.findMany(),
    });
    t.field("link", {
      type: "Link",
      args: { id: nonNull(intArg()) },
      resolve: (_, { id }, { prisma }) =>
        prisma.link.findFirst({ where: { id } }),
    });
  },
});

const LinkMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("post", {
      type: "Link",
      args: { description: nonNull(stringArg()), url: nonNull(stringArg()) },
      resolve: (_, args, { prisma, userId }) => {
        if (!userId) throw new Error("unauthorized");
        return prisma.link.create({
          data: { ...args, postedBy: { connect: { id: userId } } },
        });
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: stringArg(),
        url: stringArg(),
      },
      resolve: (_, { id, description, url }, { prisma }) => {
        return prisma.link.update({
          where: { id },
          data: { ...(description && { description }), ...(url && { url }) },
        });
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: { id: nonNull(intArg()) },
      resolve: (_, { id }, { prisma }) => prisma.link.delete({ where: { id } }),
    });
  },
});

export { Link, LinkQuery, LinkMutation };
