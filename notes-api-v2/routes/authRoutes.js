const express = require('express')
// const mongoose = require('mongoose')
const router = express.Router()
const User = require('../middleware/models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body
        const existingUser = await User.findOne({ email })
        if (existingUser) {
           return res.status(400).json({ msg: 'email already exists'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, Salt)

        const user = new User({ name, email, password: hashedPassword})
        await user.save()

        res.status(201).json({ msg: 'User registered successfully'})
    } catch (error) {
        res.status(500).json({ msg: error.message})
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ msg: 'invalid email or password'})
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ msg: 'invalid email or password'})
        }
        const token = jwt.sign(
            { id: user._id},
            process.env.JWT_SECRET,
            { expiresIn: '7d'}
        )
        res.status(200).json({ token })
    } catch (error) {
        res.status(500).json({ msg: error.message })
    }
})

module.exports = router;