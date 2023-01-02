const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const campgrounds = require('../controllers/campgrounds')

const multer = require('multer');
const { storage } = require('../cloudinary/index')
const upload = multer({ storage });


const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


// Whole index
router.route('/')
    .get(catchAsync(campgrounds.index))
    .post(isLoggedIn, upload.array('image'), validateCampground, catchAsync(campgrounds.createCampground));


// Create a new campground, this must be before show_get, because `new` will be
// treated as one id.
router.get('/new', isLoggedIn, campgrounds.renderNewForm);


// Show specific id
router.route('/:id')
    .get(catchAsync(campgrounds.showCampground))
    .put(isLoggedIn, isCampAuthor, validateCampground, catchAsync(campgrounds.EditCampground))
    .delete(isLoggedIn, isCampAuthor, catchAsync(campgrounds.deleteCampground))


// Edit the campground
router.route('/:id/edit')
    .get(isLoggedIn, isCampAuthor, catchAsync(campgrounds.renderEditForm))


module.exports = router;