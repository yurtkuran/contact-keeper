const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const router = express.Router();

// User model
const User = require('../models/User');

// authorization middleware
const auth = require('../middleware/auth');

// express validator middleware
const { check, validationResult } = require('express-validator');

// user validation
const userValidation = [check('email', 'Please include a valid email').isEmail(), check('password', 'Password is required').exists()];

// @route   GET api/auth
// @desc    Get a logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
    }
});

// @route   POST api/auth
// @desc    auth user and get token
// @access  Public
router.post('/', [userValidation], async (req, res) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // validation fails
        return res.status(400).json({ errors: errors.array() });
    } else {
        // validation passes
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            // verify valid user
            if (!user) {
                return res.status(401).json({ msg: 'invalid credentials' });
            }

            // verify user password
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ msg: 'invalid credentials' });
            }

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
        } catch (error) {
            console.error(error.message);
            res.status(500).send('server error');
        }
    }
});

module.exports = router;
