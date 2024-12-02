import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync("f1.proto");
const proto = grpc.loadPackageDefinition(packageDefinition);

const client = new proto.f1.F1Service(
    "127.0.0.1:9090",
    grpc.ChannelCredentials.createInsecure()
);

client.GetCircuits({}, (err, response) => {
    if (err) {
        console.error("Błąd przy pobieraniu danych o torach:", err);
    } else {
        console.log("Tory:", response.circuits);
    }
});

client.GetDrivers({}, (err, response) => {
    if (err) {
        console.error("Błąd przy pobieraniu danych o kierowcach:", err);
    } else {
        console.log("Kierowcy:", response.drivers);
    }
});

client.GetConstructors({}, (err, response) => {
    if (err) {
        console.error("Błąd przy pobieraniu danych o konstruktorach:", err);
    } else {
        console.log("Konstruktorzy:", response.constructors);
    }
});

client.GetRaces({}, (err, response) => {
    if (err) {
        console.error("Błąd przy pobieraniu danych o wyścigach:", err);
    } else {
        console.log("Wyścigi:", response.races);
    }
});