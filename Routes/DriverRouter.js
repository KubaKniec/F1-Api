import express from "express";
import data from '../data.json' assert {type: 'json'};
import fs from 'fs';
import {ConstructorRouter} from "./ConstructorRouter.js";

export const DriverRouter = express.Router();

DriverRouter.get('/', (req, res) => {
    const lastNameFilter = req.query.last_name;
    let driver = data.Driver;

    if (lastNameFilter) {
        driver = driver.filter(c => c.last_name.toLowerCase().includes(lastNameFilter.toLowerCase()));
    }
    res.send(driver)
})


DriverRouter.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const driver = data.Driver.find(c => c.id === id);
    if (driver) {
        res.send(driver);
    } else {
        res.status(404).send('Driver not found');
    }
});

DriverRouter.get('/:driverId/races', (req, res) => {
    const driverId = parseInt(req.params.driverId);

    const racesForDriver = data.Race.filter(race => race.winner.id === driverId);

    if (racesForDriver.length > 0) {
        res.send(racesForDriver);
    } else {
        res.status(404).send('No races found for this driver.');
    }
});


DriverRouter.post('/', (req, res) => {
    const newDriver = req.body;
    newDriver.id = data.Driver.length + 1;
    data.Driver.push(newDriver);
    saveData();
    res.status(201).send(newDriver);
});

DriverRouter.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data.Driver.findIndex(c => c.id === id);
    if (index !== -1) {
        data.Driver[index] = {...data.Driver[index], ...req.body};
        saveData();
        res.send(data.Driver[index]);
    } else {
        res.status(404).send('Driver not found');
    }
});

DriverRouter.patch('/:id', (req, res) => {
    const driverId = parseInt(req.params.id);
    const index = data.Driver.findIndex(d => d.id === driverId);
    if (index !== -1) {
        data.Driver[index] = {...data.Driver[index], ...req.body};
        saveData();
        res.send(data.Driver[index]);
    } else {
        res.status(404).send('Driver not found');
    }
});

DriverRouter.delete('/:id', (req, res) => {
    const driver = parseInt(req.params.id);
    const index = data.Driver.findIndex(c => c.id === driver);
    if (index !== -1) {
        const deleteDriver = data.Driver.splice(index, 1);
        saveData();
        res.send(deleteDriver);
    } else {
        res.status(404).send('Driver not found');
    }
});



const saveData = () => {
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving data:', err);
        } else {
            console.log('Data saved successfully.');
        }
    });
};