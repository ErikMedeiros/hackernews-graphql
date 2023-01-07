import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";
import { context, type Context } from "./context";
import { env } from "./utils/env";

const server = new ApolloServer<Context>({ schema });

startStandaloneServer(server, { listen: { port: env.PORT }, context }).then(
  ({ url }) => console.log(`[SERVER]: running on ${url}`)
);

export { server };
