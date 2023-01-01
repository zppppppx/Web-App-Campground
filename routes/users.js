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

router.post('/register', catchAsync(async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next(err);
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
        
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
}));


// Log in & log out
router.get('/login', (req, res) => {
    res.render('users/login');
});

router.post('/login',
// keepSessionInfo must be set to true in case we need to store some information in the session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}),
    (req, res) => {
        req.flash('success', 'Welcome back!');

        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        else {
            req.flash('success', 'See you!');
            res.redirect('/campgrounds');
        }
    });

})


module.exports = router;