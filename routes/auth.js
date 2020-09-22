const router = require('express').Router();
const User = require('../model/User');
const { registerValidation, loginValidation } = require('../validation');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {

    // register validation

    const {error} = registerValidation(req.body);
    if (error) {
        return  res.status(400).send(error.details[0].message);
    }

    //checking if the email is already in the database

    try {
        const emailexist = await User.findOne({email: req.body.email});
        if (emailexist) return res.status(400).send('Email already exist');
    } catch (error) {
        res.status(500).send(error);
        res.end();
    }

    // Hash password

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(req.body.password, salt);
    
    // Create user

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    // Save user in db

    try {
        const saveduser = await user.save();
        res.status(201).send(saveduser);
        res.end();
    } catch (error) {
        res.status(500).send(error);
        res.end();
    }
});

// Logging

router.post('/login', async (req, res) => {
    //Validation
        const {error} = loginValidation(req.body);
        if (error) {
            return  res.status(400).send(error.details[0].message);
        }

    //Checking if user is in db

        const user = await User.findOne({email: req.body.email});
        if (!user) return res.status(400).send('Email not found');

    //Check the password

        let isCorrectPass = await bcrypt.compare(req.body.password, user.password);
        if (!isCorrectPass) {
            return res.status(400).send('Invalid password');
        }

    // Create and assign token 
        const token = jwt.sign({id: user._id, name: user.name, email: user.email}, process.env.TOKEN_SECRET);
        res.cookie('JWT', token, {
            httpOnly: true,
        });
        res.status(200).send('/profile');
})


module.exports = router;