import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql";

const cwd = process.cwd();

const schema = makeSchema({
  types,
  outputs: {
    schema: join(cwd, "schema.graphql"),
    typegen: join(cwd, "nexus-typegen.ts"),
  },
});

export { schema };
