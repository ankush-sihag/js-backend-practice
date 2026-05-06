const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/auth_routes', require('./routes/auth_routes'));

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.log('Connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
