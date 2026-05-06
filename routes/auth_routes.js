const express = require('express');
const router = express.Router();
const User = require('../models/User');
const JWT = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/register', async (req, res) => {
    const {username, email, password} = req.body;

    try {
        let user = await User.findOne({ email});
        if(user) return res.status(400).json({msg: 'User already exist'});

        user = new User({ username, email, password});
        await user.save();

        const payload = { userid: user.id};
        const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.status(201).json({ token });

    } catch (err) {
        console.log(err.message);
        res.status(500).send('server error');
        
    }
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({msg: 'invalid credentials'});

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(400).json({msg: 'invalid credentials'});

        const payload ={ userId: user.id };
        const token = JWT.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h'});

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
});

router.get('/user', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user).select('-password');
        res.json(user);

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
});

module.exports = router;