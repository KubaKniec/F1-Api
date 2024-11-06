import fs from "fs";
import data from "../data.json" assert { type: 'json' };


const saveData = () => {
    fs.writeFile('./data.json', JSON.stringify(data, null, 2), (err) => {
        if (err) {
            throw new Error('Failed to save data');
        } else {
            console.log('Data saved successfully.');
        }
    });
};

export { saveData }