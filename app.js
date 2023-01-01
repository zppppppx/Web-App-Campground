// Basic Framework
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');

const app = express()
const User = require('./models/user');

// Validation and Error
const ExpressError = require('./utils/ExpressError');

// Connecting with the database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
mongoose.set('strictQuery', false); // prepare for mongoose 7

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once('open', () => {
    console.log('Database connected')
})

// Setting the ejs engine
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true })) // for parsing request object
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public'))); // Setting the static response directory.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

// Setting express session
const sessionConfig = {
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
    }
}
app.use(session(sessionConfig));

// Setting up passport (passport must be set before routes!)
app.use(passport.initialize()); // To initialize the passport
app.use(passport.session()); // To let express session work, must be put after express session
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); // How to store user in the session
passport.deserializeUser(User.deserializeUser()); // How to get user out of the session

// Setting up flash
app.use(flash())

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    // console.log(req.user);
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})

// Setting up routes
const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes); // campground site
app.use('/campgrounds/:id/reviews', reviewRoutes); // review site



// Basic Routes
app.get('/', (req, res) => {
    res.render('home')
})

app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found!', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something Went Wrong!';
    res.status(statusCode).render('error', { err });
})


app.listen(3000, () => {
    console.log('Serving on port 3000')
})

