import express from "express";
import data from '../data.json' assert {type: 'json'};
import fs from 'fs';

export const ConstructorRouter = express.Router();

ConstructorRouter.get('/', (req, res) => {
    const nameFilter = req.query.name;
    let constructors = data.Constructor;

    if (nameFilter) {
        constructors = constructors.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    res.send(constructors);
});

ConstructorRouter.get('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const constructor = data.Constructor.find(c => c.id === constructorId);
    if (constructor) {
        res.send(constructor);
    } else {
        res.status(404).send('Constructor not found');
    }
});

//all won races for specific team
ConstructorRouter.get('/:constructorId/races', (req, res) => {
    const constructorId = parseInt(req.params.constructorId);

    const racesForConstructor = data.Race.filter(race => {
        return data.Constructor.find(constructor =>
            constructor.id === constructorId &&
            race.winner.current_team === constructor.name
        );
    });

    if (racesForConstructor.length > 0) {
        res.send(racesForConstructor);
    } else {
        res.status(404).send('No races found for this constructor.');
    }
});



ConstructorRouter.put('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const index = data.Constructor.findIndex(c => c.id === constructorId);
    if (index !== -1) {
        data.Constructor[index] = {...data.Constructor[index], ...req.body};
        saveData();
        res.send(data.Constructor[index]);
    } else {
        res.status(404).send('Constructor not found');
    }
});

ConstructorRouter.patch('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const index = data.Constructor.findIndex(c => c.id === constructorId);

    if (index !== -1) {
        data.Constructor[index] = {...data.Constructor[index], ...req.body};
        saveData();
        res.send(data.Constructor[index]);
    } else {
        res.status(404).send('Constructor not found');
    }
});

ConstructorRouter.delete('/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const index = data.Constructor.findIndex(c => c.id === constructorId);
    if (index !== -1) {
        const deletedConstructor = data.Constructor.splice(index, 1);
        saveData();
        res.send(deletedConstructor);
    } else {
        res.status(404).send('Constructor not found');
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