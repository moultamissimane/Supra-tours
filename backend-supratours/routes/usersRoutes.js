const router = require('express').Router();
const User = require('../models/usersModel');
// register new user
router.post('/register', (req, res) => {
    try {
        const userExists = await User.findOne({ email: req.body.email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.status(201).json({ message: 'User created' });

    } catch (error) {
        res.send({
            message: error.message,
            success: false,
            data: null
        })
    }
    }
);

module.exports = router;
