import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema } from "./schema";

const server = new ApolloServer({ schema });
const port = 3000;

startStandaloneServer(server, { listen: { port } }).then(({ url }) =>
  console.log(`[SERVER]: running on ${url}`)
);

export { server };
