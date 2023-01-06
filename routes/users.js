const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const users = require('../controllers/users');
const passport = require('passport');
const { isSamePassword, isLoggedIn } = require('../middleware');

// Register
router.route('/register')
    .get(users.renderRegisterForm)
    .post(isSamePassword, catchAsync(users.register));


// Log in & log out
router.route('/login')
    .get(users.renderLoginForm)
    .post(
    // keepSessionInfo must be set to true in case we need to store some information in the session
    passport.authenticate('local', { failureFlash: true, failureRedirect: '/login', keepSessionInfo: true}), 
    users.login);

router.route('/logout')
    .get(users.logout);

router.route('/changePassword')
    .get(users.renderChangeForm)
    .post(isLoggedIn, isSamePassword, catchAsync(users.changePassword))

router.route('/forgotPassword')
    .get(users.renderResetQuestForm)
    .post(catchAsync(users.sendResetLink))

router.route('/resetPassword')
    .get(catchAsync(users.renderResetForm))
    .post(isSamePassword, catchAsync(users.resetPassword))

module.exports = router;