import express from  'express';
import data from './data.json' assert { type: 'json' };
import fs from 'fs';

const app = new express();
app.use(express.json());

//GetData
app.get('/f1', (req, res) => {
    res.send(data);
});
// GetAllConstructors
app.get('/f1/constructor', (req, res) => {
    res.send(data.Constructor);
});

//GetConstructorById
app.get('/f1/constructor/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const constructor = data.Constructor.find(c => c.id === constructorId);
    if (constructor) {
        res.send(constructor);
    } else {
        res.status(404).send('Constructor not found');
    }
});

//AddConstructor
app.post('/f1/constructor/save', (req, res) => {
    const newConstructor = req.body;
    newConstructor.id = data.Constructor.length + 1;
    data.Constructor.push(newConstructor);
    saveData();
    res.status(201).send(newConstructor);
});

//UpdateConstructor
app.put('/f1/constructor/update/:id', (req, res) => {
    const constructorId = parseInt(req.params.id);
    const index = data.Constructor.findIndex(c => c.id === constructorId);
    if (index !== -1) {
        data.Constructor[index] = { ...data.Constructor[index], ...req.body };
        saveData();
        res.send(data.Constructor[index]);
    } else {
        res.status(404).send('Constructor not found');
    }
});

//DeleteConstructor
app.delete('/f1/constructor/delete/:id', (req, res) => {
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


//GetAllRaces
app.get('/f1/race', (req, res) => {
    res.send(data.Race)
})
//GetRaceById
app.get('/f1/race/:id', (req, res) => {
    const raceId = parseInt(req.params.id);
    const race = data.Race.find(c => c.id === raceId);
    if (race) {
        res.send(race);
    } else {
        res.status(404).send('Race not found');
    }
});

//AddRace
app.post('/f1/race/save', (req, res) => {
    const newRace = req.body;
    newRace.id = data.Race.length + 1;
    data.Race.push(newRace);
    saveData();
    res.status(201).send(newRace);
});
//UpdateRace
app.put('/f1/race/update/:id', (req, res) => {
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
//DeleteRace
app.delete('/f1/race/delete/:id', (req, res) => {
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

//GetAllCircuits
app.get('/f1/circuit', (req, res) => {
    res.send(data.Circuit)
})
//GetCircuitById
app.get('/f1/circuit/:id', (req, res) => {
    const circuitId = parseInt(req.params.id);
    const circuit = data.Circuit.find(c => c.id === circuitId);
    if (circuit) {
        res.send(circuit);
    } else {
        res.status(404).send('Circuit not found');
    }
});
//AddCircuit
app.post('/f1/circuit/save', (req, res) => {
    const newCircuit = req.body;
    newCircuit.id = data.Circuit.length + 1;
    data.Circuit.push(newCircuit);
    saveData();
    res.status(201).send(newCircuit);
});
//UpdateCircuit
app.put('/f1/circuit/update/:id', (req, res) => {
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
//DeleteCircuit
app.delete('/f1/circuit/delete/:id', (req, res) => {
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

//GetAllDrivers
app.get('/f1/driver', (req, res) => {
    res.send(data.Driver)
})
//GetDriverById
app.get('/f1/driver/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const driver = data.Driver.find(c => c.id === id);
    if (driver) {
        res.send(driver);
    } else {
        res.status(404).send('Driver not found');
    }
});

//AddDriver
app.post('/f1/driver/save', (req, res) => {
    const newDriver = req.body;
    newDriver.id = data.Driver.length + 1;
    data.Driver.push(newDriver);
    saveData();
    res.status(201).send(newDriver);
});

//UpdateDriver
app.put('/f1/driver/update/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = data.Driver.findIndex(c => c.id === id);
    if (index !== -1) {
        data.Driver[index] = { ...data.Driver[index], ...req.body };
        saveData();
        res.send(data.Driver[index]);
    } else {
        res.status(404).send('Driver not found');
    }
});

//DeleteDriver
app.delete('/f1/driver/delete/:id', (req, res) => {
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

//TODO:
//jakis bardziej skomplikowane url



const saveData = () => {
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            console.error('Error saving data:', err);
        } else {
            console.log('Data saved successfully.');
        }
    });
};



app.listen(8989, () => {
    console.log("Started on 8989")
})
