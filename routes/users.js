const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');
const passport = require('passport');

// Register
router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);

        req.flash('success', 'Welcome to YelpCamp!');
        res.redirect('/campgrounds');
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));


// Log in
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login' }),
    (req, res) => {
        req.flash('success', 'Welcome back!');
        res.redirect('/campgrounds');
    })


module.exports = router;