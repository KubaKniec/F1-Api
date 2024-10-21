import express from 'express';
import data from './data.json' assert {type: 'json'};

import {ConstructorRouter} from "./Routes/ConstructorRouter.js";
import {RaceRouter} from "./Routes/RaceRouter.js";
import {DriverRouter} from "./Routes/DriverRouter.js";
import {CircuitRouter} from "./Routes/CircuitRouter.js";

const app = new express();
app.use(express.json());
// const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()
//
// app.use(express.static(pathToSwaggerUi))
//
// var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle
//
// const ui = SwaggerUIBundle({
//     url: "https://petstore.swagger.io/v2/swagger.json",
//     dom_id: '#swagger-ui',
//     presets: [
//         SwaggerUIBundle.presets.apis,
//         SwaggerUIBundle.SwaggerUIStandalonePreset
//     ],
//     layout: "StandaloneLayout"
// })

//GetAllData
app.get('/f1', (req, res) => {
    res.send(data);
});

app.use("/constructor", ConstructorRouter);
app.use("/race", RaceRouter);
app.use("/driver", DriverRouter);
app.use("/circuit", CircuitRouter);


app.listen(8989, () => {
    console.log("Started on 8989")
})
