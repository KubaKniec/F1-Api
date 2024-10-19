import express from "express";
import data from '../data.json' assert { type: 'json' };
import fs from 'fs';
export const RaceRouter = express.Router();


//GetAllRaces
RaceRouter.get('/', (req, res) => {
    const yearFilter = req.query.year;
    let races = data.Race;

    if (yearFilter) {
        races = races.filter(c => c.year.toString().includes(yearFilter.toString()));
    }
    res.send(races)
})
//GetRaceById
RaceRouter.get('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const race = data.Race.find(c => c.id === raceId);
    if (race) {
        res.send(race);
    } else {
        res.status(404).send('Race not found');
    }
});

//AddRace
RaceRouter.post('/', (req, res) => {
    const newRace = req.body;
    newRace.id = data.Race.length + 1;
    data.Race.push(newRace);
    saveData();
    res.status(201).send(newRace);
});
//UpdateRace
RaceRouter.put('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const index = data.Race.findIndex(c => c.id === raceId);
    if (index !== -1) {
        data.Race[index] = { ...data.Race[index], ...req.body };
        saveData();
        res.send(data.Race[index]);
    } else {
        res.status(404).send('Race not found');
    }
});

RaceRouter.patch('/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const index = data.Race.findIndex(r => r.id === raceId);
    if (index !== -1) {
        data.Race[index] = { ...data.Race[index], ...req.body };
        saveData();
        res.send(data.Race[index]);
    } else {
        res.status(404).send('Race not found');
    }
});

//DeleteRace
RaceRouter.delete('/:id', (req, res) => {
    const race = parseInt(req.params.id);
    const index = data.Race.findIndex(c => c.id === race);
    if (index !== -1) {
        const deleteRace = data.Race.splice(index, 1);
        saveData();
        res.send(deleteRace);
    } else {
        res.status(404).send('Race not found');
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