import { objectType } from "nexus";

const User = objectType({
  name: "User",
  definition: (t) => {
    t.nonNull.int("id");
    t.nonNull.string("name");
    t.nonNull.string("email");
    t.nonNull.list.nonNull.field("links", {
      type: "Link",
      resolve: ({ id }, _, { prisma }) =>
        prisma.user.findUniqueOrThrow({ where: { id } }).links(),
    });
    t.nonNull.list.nonNull.field("votes", {
      type: "Link",
      resolve: ({ id }, _, { prisma }) =>
        prisma.user.findUniqueOrThrow({ where: { id } }).votes(),
    });
  },
});

export { User };
