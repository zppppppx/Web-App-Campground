const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const passport = require('passport');

// Register
router.get('/register', users.renderRegisterForm);

router.post('/register', catchAsync(users.register));


// Log in & log out
router.get('/login', users.renderLoginForm);

router.post('/login', 
// keepSessionInfo must be set to true in case we need to store some information in the session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), 
    users.login);

router.get('/logout', users.logout)


module.exports = router;