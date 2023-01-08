import { asNexusMethod } from "nexus";
import { GraphQLDateTime } from "graphql-scalars";

const GQLDate = asNexusMethod(GraphQLDateTime, "DateTime");

export { GQLDate };
