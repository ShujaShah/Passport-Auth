const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
var passport = require('passport');
var crypto = require('crypto');
var routes = require('./routes');
const connection = require('./config/database');

mongoose.connect('mongodb+srv://shuja:shuja@cluster0.bugz1bo.mongodb.net/?retryWrites=true&w=majority')
.then(() => console.log("connected to mongodb.."))
.catch((err) => console.log("could not connect to mongodb..", err));

// Package documentation - https://www.npmjs.com/package/connect-mongo
const MongoStore = require('connect-mongo')(session);

// Need to require the entire Passport config module so app.js knows about it
require('./config/passport');


/**
 * -------------- GENERAL SETUP ----------------
 */

// Gives us access to variables set in the .env file via `process.env.VARIABLE_NAME` syntax
require('dotenv').config();

// Create the Express application
var app = express();

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({extended: true}));


/**
 * -------------- SESSION SETUP ----------------
 */
const sessionStore = new MongoStore({mongooseConnection: connection, collection: 'sessionStore'});

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie:{
        maxAge: 1000 * 60 * 60 * 24 //one day
    }
}));

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next)=>{
    console.log(req.session);
    console.log(req.user);
    next();
})
/**
 * -------------- ROUTES ----------------
 */

// Imports all of the routes from ./routes/index.js
app.use(routes);


/**
 * -------------- SERVER ----------------
 */

// Server listens on http://localhost:3000
app.listen(3000);