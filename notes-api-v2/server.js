const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const noteRoutes = require('./routes/noteRoutes');
const authRoutes = require('./routes/authRoutes')

const app = express();

app.use(express.json());


app.use('/api/notes', noteRoutes);
app.use('/api/auth', authRoutes);


mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(() => console.log('Connection failled'))

app.get('/', (req, res) => {
    res.send('Notes API is running')
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`)
});
