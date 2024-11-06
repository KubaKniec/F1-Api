import express from 'express';
import data from './data.json' assert {type: 'json'};

import {ConstructorRouter} from "./Routes/ConstructorRouter.js";
import {RaceRouter} from "./Routes/RaceRouter.js";
import {DriverRouter} from "./Routes/DriverRouter.js";
import {CircuitRouter} from "./Routes/CircuitRouter.js";

const app = new express();
app.use(express.json());

//GetAllData
app.get('/f1', (req, res) => {
    res.send(data);
});

//Routes
app.use("/constructor", ConstructorRouter);
app.use("/race", RaceRouter);
app.use("/driver", DriverRouter);
app.use("/circuit", CircuitRouter);

//TODO: dokończyć przerabianie petod patch, i chyba delete (wszystko jest na koncie s24584@...)
app.listen(8989, () => {
    console.log("Started on 8989")
})
