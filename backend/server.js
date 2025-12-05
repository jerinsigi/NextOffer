const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://localhost:27017/nextoffer')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error(err));
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

app.get('/', (req, res) => {
    res.send('Hello! The server is running.');
});