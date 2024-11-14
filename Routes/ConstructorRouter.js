import express from "express";
import data from '../data.json' assert {type: 'json'};
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js"

export const ConstructorRouter = express.Router();

// Dodaj responseHandler do routera
ConstructorRouter.use(responseHandler);

ConstructorRouter.get('/', (req, res) => {
    const nameFilter = req.query.name;
    let constructors = data.Constructor;

    if (nameFilter) {
        constructors = constructors.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    res.success(constructors); // Użyj res.success zamiast res.send dla kodu 200
});

ConstructorRouter.get('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const constructor = data.Constructor.find(c => c.id === constructorId);

    if (constructor) {
        const drivers = constructor.drivers.map(driverId => data.Driver.find(d => d.id === driverId));
        const response = { ...constructor, drivers: drivers };
        res.success(response);
    } else {
        res.notFound('Constructor not found');
    }
});

// Wszystkie wygrane wyścigi dla danego zespołu
ConstructorRouter.get('/:constructorId/races', (req, res) => {
    const constructorId = parseInt(req.params.constructorId);
    const constructor = data.Constructor.find(c => c.id === constructorId);

    if (!constructor) {
        return res.notFound('Constructor not found');
    }

    const racesForConstructor = data.Race.filter(race => {
        const winner = data.Driver.find(driver => driver.id === race.winner);
        return winner && winner.current_team === constructor.name;
    });

    if (racesForConstructor.length > 0) {
        res.success(racesForConstructor);
    } else {
        res.notFound('No races found for this constructor.');
    }
});

ConstructorRouter.get('/:constructorId/drivers', (req, res) => {
    const constructorId = parseInt(req.params.constructorId);
    const constructor = data.Constructor.find(c => c.id === constructorId);

    if (constructor) {
        const drivers = constructor.drivers.map(driverId => data.Driver.find(d => d.id === driverId));
        res.success(drivers);
    } else {
        res.notFound('Constructor not found');
    }
});

ConstructorRouter.post('/', (req, res) => {
    const newConstructor = req.body;
    newConstructor.id = data.Constructor.length + 1;

    const driversIds = newConstructor.drivers.map(driver => driver.id);
    data.Constructor.push({ ...newConstructor, drivers: driversIds });

    saveData();
    const response = {
        ...newConstructor,
        drivers: newConstructor.drivers.map(driver => data.Driver.find(d => d.id === driver.id))
    };

    res.status(201).send(response);
});


ConstructorRouter.put('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const index = data.Constructor.findIndex(c => c.id === constructorId);

    if (index !== -1) {
        const updatedConstructor = req.body;

        data.Constructor[index] = {
            ...data.Constructor[index],
            ...updatedConstructor,
            drivers: updatedConstructor.drivers.map(driver => driver.id)
        };
        saveData();

        const response = {
            ...data.Constructor[index],
            drivers: data.Constructor[index].drivers.map(id => data.Driver.find(d => d.id === id))
        };

        res.success(response);
    } else {
        res.notFound('Constructor not found');
    }
});

    ConstructorRouter.patch('/:id', (req, res) => {
        const constructorId = parseInt(req.params.id);
        const index = data.Constructor.findIndex(c => c.id === constructorId);

        if (index !== -1) {
            data.Constructor[index] = {...data.Constructor[index], ...req.body};
            saveData();
            res.success(data.Constructor[index]);
        } else {
            res.notFound('Constructor not found');
        }
    });

    ConstructorRouter.delete('/:id', (req, res) => {
        const constructorId = parseInt(req.params.id);
        const index = data.Constructor.findIndex(c => c.id === constructorId);
        if (index !== -1) {
            const deletedConstructor = data.Constructor.splice(index, 1);
            saveData();
            res.success(deletedConstructor);
        } else {
            res.notFound('Constructor not found');
        }
    });


    ConstructorRouter.use(errorHandler);