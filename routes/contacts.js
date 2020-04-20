const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// data models
const Contact = require('../models/Contact');
const User = require('../models/User');

// authorization middleware
const auth = require('../middleware/auth');

// express validator middleware
const { check, validationResult } = require('express-validator');

// validation - contact
const contactValidation = [check('name', 'Name is required').not().isEmpty()];

// @route   GET api/contacts
// @desc    get all user's contacts
// @access  private
router.get('/', auth, async (req, res) => {
    try {
        const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
        res.json(contacts);
    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
    }
});

// @route   POST api/contacts
// @desc    add new contact
// @access  private
router.post('/', [auth, [contactValidation]], async (req, res) => {
    // process validation errors, if any
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        // validation fails
        return res.status(400).json({ errors: errors.array() });
    } else {
        // validation passes
        const { name, email, phone, type } = req.body;

        // add to database
        try {
            const newContact = new Contact({
                name,
                email,
                phone,
                type,
                user: req.user.id,
            });

            const contact = await newContact.save();
            res.json(contact);
        } catch (error) {
            console.error(error);
            res.status(500).send('server error');
        }
    }
});

// @route   PUT api/contacts/:id
// @desc    update contact
// @access  private
router.put('/:id', auth, async (req, res) => {
    const { name, email, phone, type } = req.body;

    // build contact object
    const contactFields = {};
    if (name) contactFields.name = name;
    if (email) contactFields.email = email;
    if (phone) contactFields.phone = phone;
    if (type) contactFields.type = type;

    // find contact in database
    try {
        // verify if ID is in the correct format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'invalid ID' });
        }

        // let contact = await Contact.findById(req.params.id);
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'contact not found' });

        // confirm user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'not authorized' });
        }

        // update contact
        contact = await Contact.findByIdAndUpdate(
            req.params.id,
            { $set: contactFields },
            { new: true }
        );

        res.json(contact);
    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
    }
});

// @route   DELETE api/contacts/:id
// @desc    remove contact
// @access  private
router.delete('/:id', auth, async (req, res) => {
    // find contact in database
    try {
        // verify if ID is in the correct format
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'invalid ID' });
        }

        // let contact = await Contact.findById(req.params.id);
        let contact = await Contact.findById(req.params.id);

        if (!contact) return res.status(404).json({ msg: 'contact not found' });

        // confirm user owns contact
        if (contact.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'not authorized' });
        }

        // delete contact
        await Contact.findByIdAndRemove(req.params.id);
        res.json({ msg: 'contact removed' });
    } catch (error) {
        console.error(error);
        res.status(500).send('server error');
    }
});

module.exports = router;
