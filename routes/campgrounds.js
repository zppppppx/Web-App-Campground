const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');

const { isLoggedIn, isCampAuthor, validateCampground } = require('../middleware');


// Whole index
router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// Create a new campground, this must be before show_get, because `new` will be
// treated as one id.
router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new') // cannot write as '/campgrounds/new'
})

router.post('', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data.', 400);
    const campground = new Campground(req.body.campground);
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.render('campgrounds/new');

}))


// Show specific id
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author',
            // select: 'username', // if we only need the username
        }
    }).populate('author'); // First populate will populate the reivews and the second campground
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))


// Edit the campground
router.get('/:id/edit', isLoggedIn, isCampAuthor, catchAsync(async (req, res) => {
    const{ id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id/', isLoggedIn, isCampAuthor, validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // Break this up to allow permission

    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete('/:id', isLoggedIn, isCampAuthor, async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect(`/campgrounds/`);
})

module.exports = router;