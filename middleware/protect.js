const jwt = require('jsonwebtoken')
const User = require('../models/User')

const protect = async (req, res, next) => {
    try {
        const authHeader = req.header.authorization

        if (!authHeader || !authHeader.startsWith('Bearer')) {
            return res.status(401).json({ msg: 'No token, access denied'})
        }

        const token = authHeader.split(' ')[1]

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.user = await User.findById(decoded.id).select('-password')
        next()

    } catch (error) {
        res.status(500).json({ msg: 'token invalid or expired'})
    }
}

module.exports = protect;
