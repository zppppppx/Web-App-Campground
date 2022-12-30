// Basic Framework
const express = require('express');
const path = require('path')
const mongoose = require('mongoose');
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')

// Validation and Error
const ExpressError = require('./utils/ExpressError');

// Routes
const campgrounds = require('./routes/campgrounds');
const reviews = require('./routes/reviews');


// Connecting with the database
mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once('open', () => {
    console.log('Database connected')
})

const app = express()

// Setting the ejs engine
app.engine('ejs', ejsMate)
app.use(express.urlencoded({ extended: true })) // for parsing request object
app.use(methodOverride('_method'));
app.use(express.static('public')) // Setting the static response directory.
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))


app.use('/campgrounds', campgrounds); // campground site
app.use('/campgrounds/:id/reviews', reviews);

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

