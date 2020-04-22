const express = require('express');
const path = require('path');

// bring in local modules
const connectDB = require('./config/db');

// clear console
console.clear();

// connect to database
connectDB();

// initalize app
const app = express();

// body parser middleware
app.use(express.json({ extended: false }));

// inital route
// app.get('/', (req, res) => res.json({ msg: 'Welcome to the ContactKeeper API...' }));

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

// server static assets in production
if (process.env.NODE_ENV === 'production') {
    // set static folder
    app.use(express.static('client/build'));

    // set default 'route'
    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'client', 'build', index.html)));
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
