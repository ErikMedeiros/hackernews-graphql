import { extendType, intArg, nonNull, objectType } from "nexus";

const Vote = objectType({
  name: "Vote",
  definition: (t) => {
    t.nonNull.field("link", { type: "Link" });
    t.nonNull.field("user", { type: "User" });
  },
});

const VoteMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.field("vote", {
      type: "Vote",
      args: { linkId: nonNull(intArg()) },
      resolve: async (_, { linkId }, { prisma, userId }) => {
        if (!userId) throw new Error("unauthorized");

        const [link, user] = await prisma.$transaction([
          prisma.link.update({
            where: { id: linkId },
            data: { voters: { connect: { id: userId } } },
          }),
          prisma.user.findUniqueOrThrow({ where: { id: userId } }),
        ]);

        return { user, link };
      },
    });
  },
});

export { Vote, VoteMutation };
