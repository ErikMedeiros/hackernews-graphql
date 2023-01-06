import { objectType, extendType, nonNull, stringArg, idArg } from "nexus";
import type { NexusGenObjects } from "../../nexus-typegen";

const Link = objectType({
  name: "Link",
  definition: (t) => {
    t.nonNull.int("id");
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

const links: NexusGenObjects["Link"][] = [
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

const LinkQuery = extendType({
  type: "Query",
  definition: (t) => {
    t.nonNull.list.nonNull.field("feed", {
      type: "Link",
      resolve: () => links,
    });
    t.field("link", {
      type: "Link",
      args: { id: nonNull(idArg()) },
      resolve: (_, { id }) => links.find((l) => l.id === +id) ?? null,
    });
  },
});

const LinkMutation = extendType({
  type: "Mutation",
  definition: (t) => {
    t.nonNull.field("post", {
      type: "Link",
      args: { description: nonNull(stringArg()), url: nonNull(stringArg()) },
      resolve: (_, { description, url }) => {
        const link = { id: links.length + 1, description, url };
        links.push(link);
        return link;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(idArg()),
        description: stringArg(),
        url: stringArg(),
      },
      resolve: (_, { id, description, url }) => {
        const index = links.findIndex((l) => l.id === +id);
        const link = links[index];

        if (description) link.description = description;
        if (url) link.url = url;

        links[index] = link;
        return link;
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: { id: nonNull(idArg()) },
      resolve: (_, { id }) => {
        const index = links.findIndex((l) => l.id === +id);
        const link = links[index];
        links.splice(index, 1);
        return link;
      },
    });
  },
});

export { Link, LinkQuery, LinkMutation };
