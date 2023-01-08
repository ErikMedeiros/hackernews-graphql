import { Prisma } from "@prisma/client";
import {
  objectType,
  extendType,
  nonNull,
  stringArg,
  intArg,
  inputObjectType,
  enumType,
  arg,
  list,
} from "nexus";

const Link = objectType({
  name: "Link",
  definition: (t) => {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
    t.nonNull.DateTime("createdAt");
    t.field("postedBy", {
      type: "User",
      resolve: ({ id }, _, { prisma }) =>
        prisma.link.findUnique({ where: { id } }).postedBy(),
    });
    t.nonNull.list.nonNull.field("voters", {
      type: "User",
      resolve: ({ id }, _, { prisma }) =>
        prisma.link.findUniqueOrThrow({ where: { id } }).voters(),
    });
  },
});

const LinkQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.field("feed", {
      type: "Feed",
      args: {
        keyword: stringArg(),
        start: intArg(),
        limit: intArg(),
        orderBy: arg({ type: list(nonNull(LinkOrderByInput)) }),
      },
      resolve: async (
        _,
        { keyword: contains, start, limit, orderBy },
        { prisma }
      ) => {
        const where = contains
          ? { OR: [{ description: { contains } }, { url: { contains } }] }
          : undefined;

        const [links, count] = await prisma.$transaction([
          prisma.link.findMany({
            where,
            skip: start ?? undefined,
            take: limit ?? undefined,
            orderBy: orderBy as
              | Prisma.Enumerable<Prisma.LinkOrderByWithRelationInput>
              | undefined,
          }),
          prisma.link.count({ where }),
        ]);

        const id = JSON.stringify({ keyword: contains, start, limit, orderBy });
        return { links, count, id: "main-feed:" + id };
      },
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

const Sort = enumType({ name: "Sort", members: ["asc", "desc"] });

const LinkOrderByInput = inputObjectType({
  name: "LinkOrderByInput",
  definition: (t) => {
    t.field("description", { type: Sort });
    t.field("url", { type: Sort });
    t.field("createdAt", { type: Sort });
  },
});

const Feed = objectType({
  name: "Feed",
  definition(t) {
    t.nonNull.list.nonNull.field("links", { type: Link });
    t.nonNull.int("count");
    t.id("id");
  },
});

export { Link, LinkQuery, LinkMutation, Sort, LinkOrderByInput, Feed };
