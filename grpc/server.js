import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";
import fs from "fs/promises";

const JSON_PATH = "./JSONsForGrpc";

const packageDefinition = protoLoader.loadSync("f1.proto");
const proto = grpc.loadPackageDefinition(packageDefinition);

const loadJSON = async (fileName) => JSON.parse(await fs.readFile(`${JSON_PATH}/${fileName}`, "utf8"));

async function createServer() {
    const circuits = JSON.parse(await fs.readFile(`./JSONsForGrpc/Circuit.json`, "utf8"));
    const drivers = JSON.parse(await fs.readFile(`./JSONsForGrpc/Driver.json`, "utf8"));
    const constructors = JSON.parse(await fs.readFile(`./JSONsForGrpc/Constructor.json`, "utf8"))
    const races = JSON.parse(await fs.readFile(`./JSONsForGrpc/Race.json`, "utf8"))

    const server = new grpc.Server();
    server.addService(proto.f1.F1Service.service, {
        async GetCircuits(_) {
            return { circuits };
        },
        async GetDrivers(_) {
            return { drivers };
        },
        async GetConstructors(_) {
            return { constructors };
        },
        async GetRaces(_) {
            return { races };
        },
    });
    await createServer()
    server.bindAsync('127.0.0.1:9090', grpc.ServerCredentials.createInsecure(), (err) => console.log(err));
}

