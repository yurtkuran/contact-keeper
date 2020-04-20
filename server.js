const express = require('express');

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
app.get('/', (req, res) => res.json({ msg: 'Welcome to the ContactKeeper API...' }));

// define routes
app.use('/api/users', require('./routes/users'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/contacts', require('./routes/contacts'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));
