import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";

const Link = objectType({
  name: "Link",
  definition: (t) => {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
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
      args: { id: nonNull(idArg()) },
      resolve: (_, { id }, { prisma }) =>
        prisma.link.findFirst({ where: { id: +id } }),
    });
  },
});

const LinkMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("post", {
      type: "Link",
      args: { description: nonNull(stringArg()), url: nonNull(stringArg()) },
      resolve: (_, args, { prisma }) => prisma.link.create({ data: args }),
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        description: stringArg(),
        url: stringArg(),
      },
      resolve: (_, { id, description, url }, { prisma }) => {
        return prisma.link.update({
          where: { id: +id },
          data: { ...(description && { description }), ...(url && { url }) },
        });
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: { id: nonNull(idArg()) },
      resolve: (_, { id }, { prisma }) =>
        prisma.link.delete({ where: { id: +id } }),
    });
  },
});

export { Link, LinkQuery, LinkMutation };
