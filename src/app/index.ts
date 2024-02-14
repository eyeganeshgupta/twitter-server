import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { User } from "./user";
import { GraphqlContext } from "../interfaces";
import JWTService from "../services/jwt";

export async function initServer() {
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  const graphQLServer = new ApolloServer<GraphqlContext>({
    typeDefs: `
      ${User.types}
      type Query {
        ${User.queries}
    }`,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
    },
  });

  await graphQLServer.start();

  app.use(
    "/graphql",
    expressMiddleware(graphQLServer, {
      context: async ({ req, res }) => {
        return {
          user: req.headers.authorization
            ? JWTService.decodeToken(req.headers.authorization)
            : undefined,
        };
      },
    })
  );

  return app;
}
