import { makeSchema } from "nexus";
import { join } from "path";

const cwd = process.cwd();

const schema = makeSchema({
  types: [],
  outputs: {
    schema: join(cwd, "schema.graphql"),
    typegen: join(cwd, "nexus-typegen.ts"),
  },
});

export { schema };
