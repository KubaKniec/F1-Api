import express from "express";
import data from '../data.json' assert { type: 'json' };
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js";

export const CircuitRouter = express.Router();

CircuitRouter.use(responseHandler);

CircuitRouter.get('/', (req, res) => {
    const nameFilter = req.query.name;
    let circuit = data.Circuit;

    if (nameFilter) {
        circuit = circuit.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    if (circuit.length >= 1) {
        res.success(circuit);
    } else {
        res.notFound("No circuits found");
    }
});

CircuitRouter.get('/:circuitId/races', (req, res) => {
    const circuitId = parseInt(req.params.circuitId);
    const racesForCircuit = data.Race.filter(race => race.Circuit === circuitId);

    const detailedRaces = racesForCircuit.map(race => ({
        ...race,
        winner: data.Driver.find(d => d.id === race.winner),
        second_place: data.Driver.find(d => d.id === race.second_place),
        third_place: data.Driver.find(d => d.id === race.third_place),
        Circuit: data.Circuit.find(c => c.id === race.Circuit)
    }));

    if (detailedRaces.length > 0) {
        res.success(detailedRaces);
    } else {
        res.notFound("No races found for this circuit");
    }
});

CircuitRouter.get('/:circuitId/races', (req, res) => {
    const circuitId = parseInt(req.params.circuitId);
    const racesForCircuit = data.Race.filter(race => race.Circuit.id === circuitId);

    if (racesForCircuit.length > 0) {
        res.success(racesForCircuit);
    } else {
        res.notFound("No races found for this circuit");
    }
});

CircuitRouter.post('/', (req, res) => {
    const newCircuit = req.body;
    newCircuit.id = data.Circuit.length + 1;
    data.Circuit.push(newCircuit);
    saveData();

    res.status(201).send(newCircuit);
});

CircuitRouter.put('/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const index = data.Circuit.findIndex(c => c.id === circuitId);

    if (index !== -1) {
        data.Circuit[index] = { ...data.Circuit[index], ...req.body };
        saveData();
        res.success(data.Circuit[index]);
    } else {
        res.notFound("Circuit not found");
    }
});

CircuitRouter.patch('/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const index = data.Circuit.findIndex(c => c.id === circuitId);

    if (index !== -1) {
        data.Circuit[index] = { ...data.Circuit[index], ...req.body };
        saveData();
        res.success(data.Circuit[index]);
    } else {
        res.notFound("Circuit not found");
    }
});

CircuitRouter.delete('/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const index = data.Circuit.findIndex(c => c.id === circuitId);

    if (index !== -1) {
        const deletedCircuit = data.Circuit.splice(index, 1);
        saveData();
        res.success(deletedCircuit);
    } else {
        res.notFound("Circuit not found");
    }
});

CircuitRouter.use(errorHandler);