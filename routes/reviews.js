const express = require('express');
const router = express.Router({ mergeParams: true }); // Merge the params in the previous routes
const catchAsync = require('../utils/catchAsync');
const reviews = require('../controllers/reviews');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');


// For reviews
router.route('/')
    .post(isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.route('/:reviewId').
    delete(isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));


module.exports = router;