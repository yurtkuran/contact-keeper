const mongoose = require('mongoose');

const ContactSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ssers',
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    type: {
        type: String,
        default: 'personal',
    },
    date: {
        type: Date,
        defaulte: Date.now,
    },
});

module.exports = mongoose.model('Contact', ContactSchema);
