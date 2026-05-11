const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');


require('dotenv').config();

const app = express();

app.use(express.json());

app.use('/api/auth_routes', require('./routes/auth_routes'));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100 
});

app.use('/api/auth_routes', limiter);

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Atlas Connected'))
    .catch(err => console.log('Connection error:', err));

const PORT = process.env.PORT || 3000
app.listen(PORT,  () => console.log(`Server running on port ${PORT}`));
