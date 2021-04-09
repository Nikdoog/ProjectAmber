const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const {Player, Country} = require('./models.js');     // Game models

// Environmental variables
const dotenv = require('dotenv').config(); 
const port = process.env.PORT || 4000;
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/martians'

// Other shortcuts
const clientPath = path.join(__dirname, '../client');
const staticPath = path.join(clientPath, '/static');

// Server setup

const app = express();

app.use(express.static(staticPath));
app.set('view engine', 'ejs');
app.set('views', path.join(clientPath, '/views/'));


// Database connection

try {
    mongoose.connect(dburl, {useNewUrlParser: true, useUnifiedTopology: true})
}
catch(e) {
    console.log("Can't connect to database!");
}

// Launch!

app.listen(port);
console.log('Server running on port '+port);


// View router


//  TODO: Post routes for registration and login, country creation.


//  TODO: look up country by id
function countryLookup(name) {
    console.log(name)
    let testland = new Country();
    return testland;
}

app.get('/countries/:name', (req, res)=> {
    res.render('polity', {'country': countryLookup(req.params.name)});
})



