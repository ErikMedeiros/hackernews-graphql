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
        prisma.link.findMany({ where: { postedById: id } }),
    });
  },
});

export { User };
