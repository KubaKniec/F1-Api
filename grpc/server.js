import * as grpc from "@grpc/grpc-js";
import * as protoLoader from "@grpc/proto-loader";

const packageDefinition = protoLoader.loadSync("student.proto")
const proto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
server.addService(proto.school.StudentService.service, {
    getStudent: (req, res) => {
        res(null, {
            studentId: 0,
            firstName: "Kuba",
            lastName: "Kuba",
        })
    }
});
server.bindAsync('127.0.0.1:9090', grpc.ServerCredentials.createInsecure(), (err) => console.log(err));