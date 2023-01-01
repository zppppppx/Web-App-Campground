module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in.');
        res.redirect('/login');
    }
    else {// if this else is dismissed, express will throw an error.
        next(); 
    }
}