import express from "express";
import data from '../data.json' assert { type: 'json' };
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js";

/**
 * @swagger
 * tags:
 *   name: Driver
 *   description: API endpoints for managing drivers.
 *
 * /driver:
 *   get:
 *     summary: Retrieve a list of drivers
 *     description: Fetch all drivers or filter them by last name using a query parameter.
 *     parameters:
 *       - in: query
 *         name: last_name
 *         schema:
 *           type: string
 *         description: Filter drivers by last name.
 *     responses:
 *       200:
 *         description: A list of drivers.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   first_name:
 *                     type: string
 *                   last_name:
 *                     type: string
 *       404:
 *         description: No drivers found.
 *   post:
 *     summary: Create a new driver
 *     description: Add a new driver along with their previous teams.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               current_team:
 *                 type: string
 *               previous_teams:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Driver created successfully.
 *
 * /driver/{id}:
 *   get:
 *     summary: Retrieve a specific driver
 *     description: Fetch a driver by their ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver to retrieve.
 *     responses:
 *       200:
 *         description: Driver details.
 *       404:
 *         description: Driver not found.
 *   put:
 *     summary: Update a driver
 *     description: Update details of an existing driver, including their previous teams.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               current_team:
 *                 type: string
 *               previous_teams:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Driver updated successfully.
 *       404:
 *         description: Driver not found.
 *   patch:
 *     summary: Partially update a driver
 *     description: Update one or more fields of an existing driver.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               first_name:
 *                 type: string
 *               last_name:
 *                 type: string
 *               current_team:
 *                 type: string
 *               previous_teams:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Driver updated successfully.
 *       404:
 *         description: Driver not found.
 *   delete:
 *     summary: Delete a driver
 *     description: Remove a driver from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver to delete.
 *     responses:
 *       200:
 *         description: Driver deleted successfully.
 *       404:
 *         description: Driver not found.
 *
 * /driver/{driverId}/races:
 *   get:
 *     summary: Retrieve all races won by a specific driver
 *     description: Get a list of all races where the driver with the given ID was the winner.
 *     parameters:
 *       - in: path
 *         name: driverId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the driver to retrieve races for.
 *     responses:
 *       200:
 *         description: A list of races won by the driver.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   date:
 *                     type: string
 *                   Circuit:
 *                     type: object
 *                   winner:
 *                     type: object
 *                   second_place:
 *                     type: object
 *                   third_place:
 *                     type: object
 *       404:
 *         description: No races found for this driver.
 */


export const DriverRouter = express.Router();

DriverRouter.use(responseHandler);

DriverRouter.get('/', (req, res) => {
    const lastNameFilter = req.query.last_name;
    let driver = data.Driver;

    if (lastNameFilter) {
        driver = driver.filter(c => c.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()));
    }
    res.success(driver);
});

DriverRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const driver = data.Driver.find(c => c.id === id);
    if (driver) {
        res.success(driver);
    } else {
        res.notFound('Driver not found');
    }
});

DriverRouter.get('/:driverId/races', (req, res) => {
    const driverId = parseInt(req.params.driverId);
    const racesForDriver = data.Race.filter(race => race.winner === driverId);

    const detailedRaces = racesForDriver.map(race => ({
        ...race,
        winner: data.Driver.find(d => d.id === race.winner),
        second_place: data.Driver.find(d => d.id === race.second_place),
        third_place: data.Driver.find(d => d.id === race.third_place),
        Circuit: data.Circuit.find(c => c.id === race.Circuit)
    }));

    if (detailedRaces.length > 0) {
        res.success(detailedRaces);
    } else {
        res.notFound('No races found for this driver.');
    }
});

DriverRouter.post('/', (req, res) => {
    const newDriver = req.body;
    newDriver.id = data.Driver.length + 1;
    const previousTeamsIds = newDriver.previous_teams.map(team => team.id);
    data.Driver.push({ ...newDriver, previous_teams: previousTeamsIds });
    saveData();

    const response = {
        ...newDriver,
        previous_teams: newDriver.previous_teams.map(team => data.Constructor.find(c => c.id === team.id))
    };

    res.status(201).send(response);
});

DriverRouter.put('/:id', (req, res) => {
    const driverId = parseInt(req.params.id);
    const index = data.Driver.findIndex(d => d.id === driverId);

    if (index !== -1) {
        const updatedDriver = req.body;

        if (updatedDriver.previous_teams) {
            updatedDriver.previous_teams = updatedDriver.previous_teams.map(team => team.id);
        }

        data.Driver[index] = { ...data.Driver[index], ...updatedDriver };
        saveData();

        const response = {
            ...data.Driver[index],
            previous_teams: data.Driver[index].previous_teams.map(id => data.Constructor.find(c => c.id === id))
        };

        res.success(response);
    } else {
        res.notFound('Driver not found');
    }
});

DriverRouter.patch('/:id', (req, res) => {
    const driverId = parseInt(req.params.id);
    const index = data.Driver.findIndex(d => d.id === driverId);
    if (index !== -1) {
        data.Driver[index] = { ...data.Driver[index], ...req.body };
        saveData();
        res.success(data.Driver[index]);
    } else {
        res.notFound('Driver not found');
    }
});

DriverRouter.delete('/:id', (req, res) => {
    const driverId = parseInt(req.params.id);
    const index = data.Driver.findIndex(c => c.id === driverId);
    if (index !== -1) {
        const deletedDriver = data.Driver.splice(index, 1);
        saveData();
        res.success(deletedDriver);
    } else {
        res.notFound('Driver not found');
    }
});

DriverRouter.use(errorHandler);
