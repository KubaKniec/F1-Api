import express from  'express';
import { faker } from '@faker-js/faker';

const app = new express();



app.get('/construnctor/:id', (req, res)=>{
    faker.seed(Number(req.params.id));
    const construnctor = faker.vehicle.manufacturer();
    res.send(construnctor);
})

app.post()

app.listen(8989, () => {
    console.log("Started on 8989")
})
