const express = require('express');
const path = require('path');

// testing
const dotenv = require('dotenv').config();
const session = require('express-session');

const port = process.env.PORT || 4000;

const sessionSecret = process.env.SECRET || 'chips';

// Navigation

const clientPath = path.join(__dirname, '../client');
const staticPath = path.join(clientPath, '/static');

// Basic Server

const app = express();
app.use(express.static(staticPath));

// testing
app.use(session({
    cookie: {
        maxAge: 1000*60*60*24*7,
        secure: false
    },
    key: 'user_sid',
    secret: sessionSecret,
    resave: false,
    saveUninitialized: false,
    name: 'ProjectAmber'
}));

app.listen(4000);