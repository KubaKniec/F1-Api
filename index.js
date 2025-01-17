import express from 'express';
import {ConstructorRouter} from "./Routes/ConstructorRouter.js";
import {RaceRouter} from "./Routes/RaceRouter.js";
import {DriverRouter} from "./Routes/DriverRouter.js";
import {CircuitRouter} from "./Routes/CircuitRouter.js";
import {ApolloServer} from "@apollo/server";
import {expressMiddleware} from "@apollo/server/express4"
import {resolvers} from "./graphql/resolvers/resolvers.js";
import {readFileSync} from "fs";
import cors from "cors";


const app = new express();

export const corsOptions = {
    // origin: "niePowinnoDzialc.pl",
    origin: "http://localhost:8989",
    methods: "PUT,PATCH,POST,DELETE", // nie ma get dla testu
    optionsSuccessStatus: 200
}

app.use(express.json());
app.use(cors(corsOptions))

// const restrictMethods = (allowedMethods) => (req, res, next) => {
//     if (!allowedMethods.includes(req.method)) {
//         return res.status(405).send("Method Not Allowed");
//     }
//     next();
// };


app.use("/constructor", cors(corsOptions), ConstructorRouter);
app.use("/race", cors(corsOptions), RaceRouter);
app.use("/driver", cors(corsOptions), DriverRouter);
app.use("/circuit", cors(corsOptions), CircuitRouter);


const  typeDefs = readFileSync("graphql/schemas/schema.graphql", {encoding: "utf-8"});
const apolloServer = new ApolloServer({typeDefs, resolvers});
await apolloServer.start();
app.use('/graphql', express.json(), expressMiddleware(apolloServer));


app.listen(8989, () => {
    console.log("Started on 8989")
})
