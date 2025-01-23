import express from "express";
import data from '../data.json' assert {type: 'json'};
import { responseHandler, errorHandler } from "../handlers/ResponseHandler.js";
import { saveData } from  "../handlers/DataSaver.js"

/**
 * @swagger
 * tags:
 *   name: Constructor
 *   description: API endpoints for managing constructors.
 *
 * /constructor:
 *   get:
 *     summary: Retrieve a list of constructors
 *     description: Fetch all constructors or filter them by name using a query parameter.
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter constructors by name.
 *     responses:
 *       200:
 *         description: A list of constructors.
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
 *         description: No constructors found.
 *   post:
 *     summary: Create a new constructor
 *     description: Add a new constructor along with its drivers.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Red Bull Racing"
 *               drivers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Constructor created successfully.
 *
 * /constructor/{id}:
 *   get:
 *     summary: Retrieve a specific constructor
 *     description: Fetch a constructor by its ID, including its associated drivers.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to retrieve.
 *     responses:
 *       200:
 *         description: Constructor details.
 *       404:
 *         description: Constructor not found.
 *   put:
 *     summary: Update a constructor
 *     description: Update details of an existing constructor, including its drivers.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               drivers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Constructor updated successfully.
 *       404:
 *         description: Constructor not found.
 *   patch:
 *     summary: Partially update a constructor
 *     description: Update one or more fields of an existing constructor.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               drivers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Constructor updated successfully.
 *       404:
 *         description: Constructor not found.
 *   delete:
 *     summary: Delete a constructor
 *     description: Remove a constructor from the database.
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to delete.
 *     responses:
 *       200:
 *         description: Constructor deleted successfully.
 *       404:
 *         description: Constructor not found.
 *
 * /constructor/{constructorId}/races:
 *   get:
 *     summary: Retrieve all races won by a specific constructor
 *     description: Get a list of all races won by a constructor with the given ID.
 *     parameters:
 *       - in: path
 *         name: constructorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to retrieve races for.
 *     responses:
 *       200:
 *         description: A list of races won by the constructor.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   winner:
 *                     type: object
 *                   date:
 *                     type: string
 *       404:
 *         description: No races found for this constructor.
 *
 * /constructor/{constructorId}/drivers:
 *   get:
 *     summary: Retrieve drivers for a specific constructor
 *     description: Get a list of all drivers associated with a constructor by its ID.
 *     parameters:
 *       - in: path
 *         name: constructorId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the constructor to retrieve drivers for.
 *     responses:
 *       200:
 *         description: A list of drivers associated with the constructor.
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
 *         description: Constructor not found.
 */


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