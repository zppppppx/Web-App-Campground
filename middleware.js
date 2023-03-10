const Campground = require('./models/campground');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schemas');

// Validation Part
module.exports.validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl; // req.path will only record the path in the router without the prefix
        req.flash('error', 'You must be signed in.');
        res.redirect('/login');
    }
    else {// if this else is dismissed, express will throw an error.
        next(); 
    }
}


// Check Authorization
module.exports.isCampAuthor = async (req, res, next) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);

    if (!req.user || !campground.author.equals(req.user._id)) {
        req.flash('error', 'Permission Denied.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!req.user || !review.author.equals(req.user._id)) {
        req.flash('error', 'Permission Denied.');
        return res.redirect(`/campgrounds/${id}`);
    }
    next();
}

module.exports.isSamePassword = (req, res, next) => {
    req.session.username = req.body.username || '';
    req.session.email = req.body.email || '';
    if(req.body.password !== req.body.password_confirm) {
        req.flash('error', 'Your passwords do not match, please try again.');
        return res.redirect(req.originalUrl);
    }
    next();
}