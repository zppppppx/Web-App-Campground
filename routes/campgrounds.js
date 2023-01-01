const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const campgrounds = require('../controllers/campgrounds')

const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


// Whole index
router.get('', catchAsync(campgrounds.index));

// Create a new campground, this must be before show_get, because `new` will be
// treated as one id.
router.get('/new', isLoggedIn, campgrounds.renderNewForm);

router.post('', isLoggedIn, validateCampground, catchAsync(campgrounds.createCampground));


// Show specific id
router.get('/:id', catchAsync(campgrounds.showCampground));


// Edit the campground
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(campgrounds.renderEditForm));

router.put('/:id/', isLoggedIn, isCampAuthor, validateCampground, catchAsync(campgrounds.EditCampground));


// Delete the campground
router.delete('/:id', isLoggedIn, isCampAuthor, catchAsync(campgrounds.deleteCampground));

module.exports = router;