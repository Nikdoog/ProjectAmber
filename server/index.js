const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const ejs = require('ejs');
const bcrypt = require('bcrypt');
const dilemmas = require('./dilemmas.js');
const {Player} = require('./models.js');     // Game models

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


// AUTHENTICATION

app.get('/register', (req, res) => {
    res.render('register', {data: req.session});
});

app.post('/register', async (req, res)=>{
    try {
        let hash = await bcrypt.hash(req.body.password, 10);
        let newUser = new Player();
        newUser.username = req.body.username;
        newUser.password = hash;
        await newUser.save();
        req.session.isauthenticated = true;
        req.session.userid = newUser._id;
        req.session.country = newUser.country;
        console.log(req.session)
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
                    req.session.country = result.country;
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

//
// GAME
//


// FIRST TIME PLAYING

app.post('/game/foundation', (req, res)=>{
  Player.findById(req.session.userid, (error,result)=>{
    if(error){
      console.log(error);
      res.send("error");
    } else if(!result) {
      res.redirect('/');
    } else {
      result.country.name = req.body.name;
      result.save();
      req.session.country = result.country;
      res.redirect('/game/');
    }
  });
});

// HOME SCREEN


app.get('/game/', authenticated, (req, res)=>{
    Player.findById(req.session.userid, (error, result)=>{
        if(error) {
            console.log(error);
            res.send('Oops!');
        }
        else if(!result) {
            res.send('Aw shucks.');
        }
        else {
            if(result.country.name)
                res.render('game', {country: result.country});
            else
                res.render('firstTime');
        }
    })
  });

// VIEWING OTHER COUNTRIES

app.get('/countries/:name', (req, res)=> {
    res.render('polity', {'country': countryLookup(req.params.name)});
})

// DILEMMAS

app.get('/dilemma/', function(req, res){
    console.log(dilemmas[0])
    res.render('decisions', {dilemma: dilemmas[0]});
  });
  
app.post('/decision', function(req, res){
    console.log(req.body);
    res.redirect('/');
});

//
//  UTILITY FUNCTIONS
//


//  Look up country by name.  Can return null.

function countryLookup(name) {
    Player.findOne({'country.name': name}, (error, result)=>{
        if(error) {
            console.log(error);
            return null;
        }
        else if(!result) {
            return null;
        }
        else {
            console.log(result);
            return(result);
        }
    })
}
