import express from "express";
import data from '../data.json' assert { type: 'json' };
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js";
import cors from "cors";

/**
 * @swagger
 * tags:
 *   name: Race
 *   description: API endpoints for managing races.
 *
 * /race:
 *   get:
 *     summary: Retrieve a list of races
 *     description: Fetch all races or filter them by year using a query parameter.
 *     parameters:
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *         description: Filter races by year.
 *     responses:
 *       200:
 *         description: A list of races.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   year:
 *                     type: integer
 *                   Circuit:
 *                     type: object
 *                   winner:
 *                     type: object
 *                   second_place:
 *                     type: object
 *                   third_place:
 *                     type: object
 *       404:
 *         description: No races found.
 *   post:
 *     summary: Create a new race
 *     description: Add a new race along with the details of the winner, second place, and third place drivers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               winner:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               second_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               third_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               Circuit:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *     responses:
 *       201:
 *         description: Race created successfully.
 *
 * /race/{id}:
 *   get:
 *     summary: Retrieve a specific race
 *     description: Fetch a race by its ID along with details of the winner, second place, and third place drivers.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the race to retrieve.
 *     responses:
 *       200:
 *         description: Race details.
 *       404:
 *         description: Race not found.
 *   put:
 *     summary: Update a race
 *     description: Update details of an existing race, including the winner, second place, third place drivers, and circuit.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the race to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               winner:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               second_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               third_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               Circuit:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Race updated successfully.
 *       404:
 *         description: Race not found.
 *   patch:
 *     summary: Partially update a race
 *     description: Update one or more fields of an existing race.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the race to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               year:
 *                 type: integer
 *               winner:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               second_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               third_place:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *               Circuit:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *     responses:
 *       200:
 *         description: Race updated successfully.
 *       404:
 *         description: Race not found.
 *   delete:
 *     summary: Delete a race
 *     description: Remove a race from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the race to delete.
 *     responses:
 *       200:
 *         description: Race deleted successfully.
 *       404:
 *         description: Race not found.
 */


export const RaceRouter = express.Router();

RaceRouter.use(responseHandler);

RaceRouter.get('/', (req, res) => {
    const yearFilter = req.query.year;
    let races = data.Race;

    if (yearFilter) {
        races = races.filter(c => c.year.toString().includes(yearFilter.toString()));
    }
    res.success(races);
});

RaceRouter.get('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const race = data.Race.find(c => c.id === raceId);

    if (race) {
        const winner = data.Driver.find(d => d.id === race.winner);
        const secondPlace = data.Driver.find(d => d.id === race.second_place);
        const thirdPlace = data.Driver.find(d => d.id === race.third_place);

        const response = {
            ...race,
            winner: winner || null,
            second_place: secondPlace || null,
            third_place: thirdPlace || null
        };

        res.success(response);
    } else {
        res.notFound('Race not found');
    }
});

RaceRouter.post('/', (req, res) => {
    const newRace = req.body;
    newRace.id = data.Race.length + 1;
    data.Race.push({
        ...newRace,
        winner: newRace.winner.id,
        second_place: newRace.second_place.id,
        third_place: newRace.third_place.id,
        Circuit: newRace.Circuit.id
    });
    saveData();

    const response = {
        ...newRace,
        winner: data.Driver.find(d => d.id === newRace.winner.id),
        second_place: data.Driver.find(d => d.id === newRace.second_place.id),
        third_place: data.Driver.find(d => d.id === newRace.third_place.id),
        Circuit: data.Circuit.find(c => c.id === newRace.Circuit.id)
    };

    res.status(201).send(response);
});
RaceRouter.put('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const index = data.Race.findIndex(r => r.id === raceId);

    if (index !== -1) {
        const updatedRace = req.body;
        data.Race[index] = {
            ...data.Race[index],
            ...updatedRace,
            winner: updatedRace.winner.id,
            second_place: updatedRace.second_place.id,
            third_place: updatedRace.third_place.id,
            Circuit: updatedRace.Circuit.id
        };
        saveData();

        const response = {
            ...data.Race[index],
            winner: data.Driver.find(d => d.id === data.Race[index].winner),
            second_place: data.Driver.find(d => d.id === data.Race[index].second_place),
            third_place: data.Driver.find(d => d.id === data.Race[index].third_place),
            Circuit: data.Circuit.find(c => c.id === data.Race[index].Circuit)
        };

        res.success(response);
    } else {
        res.notFound('Race not found');
    }
});

RaceRouter.patch('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const index = data.Race.findIndex(r => r.id === raceId);
    if (index !== -1) {
        data.Race[index] = { ...data.Race[index], ...req.body };
        saveData();
        res.success(data.Race[index]);
    } else {
        res.notFound('Race not found');
    }
});

RaceRouter.delete('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const index = data.Race.findIndex(c => c.id === raceId);
    if (index !== -1) {
        const deletedRace = data.Race.splice(index, 1);
        saveData();
        res.success(deletedRace);
    } else {
        res.notFound('Race not found');
    }
});

RaceRouter.use(errorHandler);

