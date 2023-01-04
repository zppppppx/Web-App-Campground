// Basic Framework
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');

// Some cofigurations
const { sessionConfig, helmetContentSecurityConfig, dbUrl } = require('./Config');

// Connecting with the database
// const dbUrl = process.env.DB_URL;
// mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp');
mongoose.connect(dbUrl);
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
app.use(mongoSanitize()); // Setting prohibition on some administrative queries
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(helmet({ contentSecurityPolicy: helmetContentSecurityConfig, crossOriginEmbedderPolicy: false }));
// app.use(helmet.contentSecurityPolicy(helmetContentSecurityConfig));

// Setting express session
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
    res.locals.loadMap = false; // a flag marking which pages to load map box cdn
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

const port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})

