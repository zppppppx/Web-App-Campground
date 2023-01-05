const User = require('../models/user');

module.exports.renderRegisterForm = (req, res) => {
    res.locals.username = req.session.username || '';
    res.locals.email = req.session.email || '';
    delete req.session.username;
    delete req.session.email;
    console.log(res.locals);
    res.render('users/register');
};

module.exports.register = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const user = new User({ username, email });
        const registerUser = await User.register(user, password);
        req.login(registerUser, err => {
            if(err) return next(err);
            delete req.session.username;
            delete req.session.email;
            req.flash('success', 'Welcome to YelpCamp!');
            res.redirect('/campgrounds');
        })
        
    }
    catch (e) {
        req.flash('error', e.message);
        res.redirect('/register');
    }
};

module.exports.renderLoginForm = (req, res) => {
    res.render('users/login');
};

module.exports.login = (req, res) => {
        req.flash('success', 'Welcome back!');

        const redirectUrl = req.session.returnTo || '/campgrounds';
        delete req.session.returnTo;
        res.redirect(redirectUrl);
};

module.exports.renderChangeForm = (req, res) => {
    res.render('users/changeForm');
}

module.exports.changePassword = async (req, res) => {
    User.findById(req.user._id, (err, user) => {
        // console.log(err, user);
        user.changePassword(req.body.password_former, req.body.password, err => {
            if(err) {
                req.flash('error', 'Your passwords do not match, please try again.');
                res.redirect('/changePassword');
            }
            else {
                req.flash('success', 'Successfully changed the password');
                res.redirect('/campgrounds');
            }
        })
    })
}

module.exports.logout = (req, res, next) => {
    req.logout(err => {
        if (err) return next(err);
        else {
            req.flash('success', 'See you!');
            res.redirect('/campgrounds');
        }
    });
};