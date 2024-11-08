import express from 'express';
import {ConstructorRouter} from "./Routes/ConstructorRouter.js";
import {RaceRouter} from "./Routes/RaceRouter.js";
import {DriverRouter} from "./Routes/DriverRouter.js";
import {CircuitRouter} from "./Routes/CircuitRouter.js";
import {ApolloServer} from "@apollo/server";
import  {expressMiddleware} from "@apollo/server/express4"
import cors from "cors";
import {resolvers} from "./graphql/resolvers/resolvers.js";
import {readFileSync} from "fs";

const app = new express();
app.use(express.json());

const  typeDefs = readFileSync("graphql/schemas/schema.graphql", {encoding: "utf-8"});
const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
app.use('/graphql', cors(), express.json(), expressMiddleware(apolloServer));

//Routes
app.use("/constructor", ConstructorRouter);
app.use("/race", RaceRouter);
app.use("/driver", DriverRouter);
app.use("/circuit", CircuitRouter);

app.listen(8989, () => {
    console.log("Started on 8989")
})
