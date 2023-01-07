import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";
import { context, type Context } from "./context";

const server = new ApolloServer<Context>({ schema });
const port = 3000;

startStandaloneServer(server, {
  listen: { port },
  context: async () => context,
}).then(({ url }) => console.log(`[SERVER]: running on ${url}`));

export { server };
