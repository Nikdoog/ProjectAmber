const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejs = require('ejs');
const bcrypt = require('bcrypt');

const {Player, Country} = require('./models.js');     // Game models
const { Recoverable } = require('repl');

// Environmental variables
const dotenv = require('dotenv').config();
const port = process.env.PORT || 4000;
const dburl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/martians'

// Other shortcuts
const clientPath = path.join(__dirname, '../client/');
const staticPath = path.join(clientPath, '/static/');
const viewsPath = path.join(clientPath,'/views/')

// Server setup
const app = express();

app.use(express.static(staticPath));
app.set('view engine', 'ejs');
app.set('views', path.join(clientPath, '/views/'));
app.use(express.urlencoded({extended:true}))
app.use(session({
    name: 'martians',
    secret: 'farts',
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000*60*60*24*3,
    }
}));



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

// testing
app.set('view engine','ejs');
app.set('views',viewsPath);

app.use((req, res, next)=>{
    console.log(req.originalUrl);
    next();
})

const authenticated = (req, res, next) =>{
    if(req.session.isauthenticated)
    next();
    else res.redirect('/')
}

//testing
app.get('/', function(req, res) {
    console.log(req.session)
    res.render('index', {data: req.session});
});

app.get('/about', function(req, res) {
    res.render('about', {data: req.session});
});

app.post('/welcome', (req, res) => {
    req.session.username=req.body.nombre;
    res.send('SUCCESS');
});


//decision posting
app.post('/writeDecision', function(req,res){
  res.redirect('/about');
});


//  TODO: Post routes for registration and login, country creation.

// testing
app.get('/register', (req, res) => {
    res.render('register', {data: req.session});
});

app.post('/register', async (req, res)=>{
    try {
        let hash = await bcrypt.hash(req.body.password, 10);
        let newUser = new Player({username: req.body.username, password: hash})
        await newUser.save();
        req.session.isauthenticated=true;
        res.redirect('/game/');
    }
    catch(e) {
        switch(e.code) {
            case 11000:
                res.send('That username is already registered.');
                break;
            default:
                res.send('There was an error processing your registration.')
                console.log(e)
                break;
        }
    }
})

app.get('/game/', authenticated, (req, res)=>{
    res.render('game');
})

app.post('/login', (req, res)=>{
    Player.findOne({username: req.body.username}, async (error, result) => {
        if(error) {
            console.log(error);
            res.send('There was an error logging in.');
        }
        else if(!result) {
            res.send('That username isn\'t registered!');
        }
        else {
            try {
                let match = await bcrypt.compare(req.body.password, result.password);
                if(match) {
                    req.session.isauthenticated="true";
                    req.session.userid = result._id;
                    req.session.username = result.username;
                    res.redirect('/game/');
                }
                else res.send('Incorrect password!');
            }
            catch(e) {
                res.status(500);
            }
        }
    })
})

//  TODO: look up country by id
function countryLookup(name) {
    console.log(name)
    let testland = new Country();
    return testland;
}

app.get('/countries/:name', (req, res)=> {
    res.render('polity', {'country': countryLookup(req.params.name)});
})
