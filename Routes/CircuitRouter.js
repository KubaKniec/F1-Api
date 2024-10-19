import express from "express";
import data from '../data.json' assert { type: 'json' };
import fs from 'fs';

export const CircuitRouter = express.Router();

CircuitRouter.get('/', (req, res) => {
    const nameFilter = req.query.name;
    let circuit = data.Circuit;

    if (nameFilter) {
        circuit = circuit.filter(c => c.name.toLowerCase().includes(nameFilter.toLowerCase()));
    }

    res.send(circuit);
})

CircuitRouter.get('/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const circuit = data.Circuit.find(c => c.id === circuitId);
    if (circuit) {
        res.send(circuit);
    } else {
        res.status(404).send('Circuit not found');
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
        res.send(data.Circuit[index]);
    } else {
        res.status(404).send('Circuit not found');
    }
});

CircuitRouter.patch('/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const index = data.Circuit.findIndex(c => c.id === circuitId);
    if (index !== -1) {
        data.Circuit[index] = { ...data.Circuit[index], ...req.body };
        saveData();
        res.send(data.Circuit[index]);
    } else {
        res.status(404).send('Circuit not found');
    }
});


CircuitRouter.delete('/:id', (req, res) => {
    const circuit = parseInt(req.params.id);
    const index = data.Circuit.findIndex(c => c.id === circuit);
    if (index !== -1) {
        const deleteCircuit = data.Circuit.splice(index, 1);
        saveData();
        res.send(deleteCircuit);
    } else {
        res.status(404).send('Circuit not found');
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
