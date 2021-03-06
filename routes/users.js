const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

// User model
const User = require('../models/User');

// express validator middleware
const { check, validationResult } = require('express-validator');

// validation - new user
const newUserValidation = [
    check('name', 'Please add name').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', [newUserValidation], async (req, res) => {
    // process validation errors, if any
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // validation fails
        return res.status(400).json({ errors: errors.array() });
    } else {
        // validation passes
        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });
            if (user) {
                // user exists
                return res.status(400).json({ msg: 'user already exists' });
            } else {
                // new user
                user = new User({
                    name,
                    email,
                    password,
                });

                // encrypt password
                const salt = await bcrypt.genSalt(10);
                user.password = await bcrypt.hash(password, salt);

                // save to database
                await user.save();

                // return JWT token
                const payload = {
                    user: {
                        id: user.id,
                    },
                };

                jwt.sign(
                    payload,
                    config.get('jwtSecret'),
                    {
                        expiresIn: 360000,
                    },
                    (err, token) => {
                        if (err) throw err;
                        res.json({ token });
                    }
                );
            }
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    }
});

module.exports = router;
