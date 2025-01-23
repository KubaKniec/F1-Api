import express from "express";
import data from '../data.json' assert { type: 'json' };
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js";

/**
 * @swagger
 * tags:
 *   name: Circuit
 *   description: API endpoints for managing circuits.
 *
 * /circuit:
 *   get:
 *     summary: Retrieve a list of circuits
 *     description: Fetch all circuits or filter them by name using a query parameter.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter circuits by name.
 *     responses:
 *       200:
 *         description: A list of circuits.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   name:
 *                     type: string
 *       404:
 *         description: No circuits found.
 *   post:
 *     summary: Create a new circuit
 *     description: Add a new circuit to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Silverstone"
 *     responses:
 *       201:
 *         description: Circuit created successfully.
 *
 * /circuit/{id}:
 *   put:
 *     summary: Update a circuit
 *     description: Update details of an existing circuit.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the circuit to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Circuit updated successfully.
 *       404:
 *         description: Circuit not found.
 *   patch:
 *     summary: Partially update a circuit
 *     description: Update one or more fields of an existing circuit.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the circuit to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Circuit updated successfully.
 *       404:
 *         description: Circuit not found.
 *   delete:
 *     summary: Delete a circuit
 *     description: Remove a circuit from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the circuit to delete.
 *     responses:
 *       200:
 *         description: Circuit deleted successfully.
 *       404:
 *         description: Circuit not found.
 *
 * /circuit/{circuitId}/races:
 *   get:
 *     summary: Retrieve races for a specific circuit
 *     description: Get a list of races associated with a given circuit ID, including detailed race information.
 *     parameters:
 *       - in: path
 *         name: circuitId
 *         schema:
 *           type: integer
 *         required: true
 *         description: The ID of the circuit to retrieve races for.
 *     responses:
 *       200:
 *         description: A list of races for the circuit.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   winner:
 *                     type: object
 *                   second_place:
 *                     type: object
 *                   third_place:
 *                     type: object
 *                   Circuit:
 *                     type: object
 *       404:
 *         description: No races found for this circuit.
 */

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

// CircuitRouter.get('/:circuitId/races', (req, res) => {
//     const circuitId = parseInt(req.params.circuitId);
//     const racesForCircuit = data.Race.filter(race => race.Circuit.id === circuitId);
//
//     if (racesForCircuit.length > 0) {
//         res.success(racesForCircuit);
//     } else {
//         res.notFound("No races found for this circuit");
//     }
// });

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