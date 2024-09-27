import express from "express";
import { PORT, mongoDBURL } from "./config.js";
import mongoose from 'mongoose';
import { Pic } from './models/picModel.js';
import picsRoute from './routes/picsRoute.js';
import cors from 'cors';

const app = express();

app.use(express.json());

/*
app.use(cors({
    origin:'http://localhost:5173',
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type']
}));
*/

app.use(cors({
    origin:'https://testfront-ahffdqgrghe4efc4.eastus-01.azurewebsites.net',
    methods: ['GET','POST'],
    allowedHeaders: ['Content-Type']
}));

app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To Fullstack');
});

app.use('/pics', picsRoute);

mongoose
    .connect(mongoDBURL)
    .then(() => {
        console.log('App connnected to database');
        app.listen(PORT, () => {
            console.log(`App is listening to port: ${PORT}`);
        });
    }).catch((error) => {
        console.log(error);
    })
