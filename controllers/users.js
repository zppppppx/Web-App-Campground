const User = require('../models/user');
const crypto = require('crypto');
const UserToken = require('../models/userToken');
const bcrypt = require('bcrypt');
const ExpressError = require('../utils/ExpressError');
const { sendEmail } = require('../utils/sendEmail');

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
            if (err) return next(err);
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
            if (err) {
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


module.exports.renderResetQuestForm = (req, res, next) => {
    res.render('users/resetQuestForm');
}

module.exports.sendResetLink = async (req, res, next) => {
    const user = await User.findOne({ $or: [{username: req.body.username}, {email: req.body.username}] }); // this needs to be modified to email allowed
    if (!user) {
        req.flash('error', 'User does not exist, please try again.');
        return res.redirect('/forgotPassword');
    } else {
        const token = await UserToken.findOne({ user: user._id });
        if (token) await token.deleteOne();
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hash = await bcrypt.hash(resetToken, 12, async (err, hash) => {
            if (err) throw new ExpressError(err.message, 500);
            else {
                await new UserToken({
                    user: user._id,
                    email: user.email,
                    token: hash,
                    createdAt: Date.now(),
                }).save();
            }
        });

        await sendEmail(resetToken, user, next);

        req.flash('success', 'An email has been sent to your mailbox.');
        res.redirect('/forgotPassword');

    }
}

module.exports.renderResetForm = async (req, res, next) => {
    const passwordResetToken = await UserToken.findOne({ user: req.query.user });
    if (!passwordResetToken) {
        req.flash('error', 'Invalid or expired password reset token, please try it again.');
        return res.redirect('/forgotPassword');
    }
    // console.log(passwordResetToken, req.query);
    const isValid = await bcrypt.compare(req.query.token, passwordResetToken.token);
    // console.log(isValid);
    if (!isValid) {
        req.flash('error', 'Invalid or expired password reset token, please try it again.');
        return res.redirect('/forgotPassword');
    }
    else {
        res.render('users/resetForm', { token: req.query.token, user: req.query.user });
    }

}

module.exports.resetPassword = async (req, res, next) => {
    const user = await User.findById(req.query.user);
    if (!user) {
        req.flash('error', 'Invalid token or user, please try again.');
        res.redirect('/forgotPassword');
    } else {
        await user.setPassword(req.body.password, async (err, user) => {
            if (err) {
                throw new ExpressError('Invalid token or user, please try again.', 500);
            }
            else {
                await user.save();
            }
        });
        req.flash('success', 'You have successfully reset the password, remember it!');
        res.redirect('/campgrounds');
    }
}