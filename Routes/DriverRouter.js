import express from "express";
import data from '../data.json' assert { type: 'json' };
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js";


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
