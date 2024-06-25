const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const playerRoutes = require('./routes/playerRoutes');
const clubRoutes = require('./routes/clubRoutes');

dotenv.config();

const app = express();
const port = 3000;
const url = "mongodb+srv://dachijavaxishvili:dachi123@cluster0.0qmbd8m.mongodb.net/";
const dbName = 'fcbPlayers';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }))

mongoose.connect(url + dbName, {})
    .then(() => {
        console.log('Connected to MongoDB Atlas...');
        
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('Error occurred while connecting to MongoDB Atlas...\n', err);
    });

app.get('/', (req, res) => {
    res.send('Hello, World!'); 
});

app.use('/api', playerRoutes);
app.use('/api', clubRoutes);