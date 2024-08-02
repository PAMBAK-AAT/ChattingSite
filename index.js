


const path = require('path');
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/connectDB.js');
const router = require('./routes/index.js');
const cookieParser = require('cookie-parser');
const { app, server } = require('./socket/index.js');

// Middleware (if any)
app.use(express.json());
app.use(cookieParser());

// For deployment
app.use(express.static(path.join(__dirname, '/client/dist')));

// Render client for any path
app.get('*', (req, res) => res.sendFile(path.join(__dirname, '/client/dist/index.html')));

// CORS Configuration
app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

// Preflight request handling
app.options('*', cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
}));

app.get('/', (req, res) => {
    res.json({
        message: "It's my home page!",
    });
});

app.use('/api', router);

const port = 8080;
connectDB()
    .then(() => {
        server.listen(port, () => {
            console.log(`Server is listening to the port ${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to server!', err);
    });
