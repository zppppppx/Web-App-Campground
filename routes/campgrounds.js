const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Campground = require('../models/campground');
const { campgroundSchema } = require('../schemas');


// Validation Part
const validateCampground = (req, res, next) => {
    const { error } = campgroundSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}



// Whole index
router.get('', catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({});
    res.render('campgrounds/index', { campgrounds });
}))

// Create a new campground, this must be before show_get, because `new` will be
// treated as one id.
router.get('/new', (req, res) => {
    res.render('campgrounds/new') // cannot write as '/campgrounds/new'
})

router.post('', validateCampground, catchAsync(async (req, res) => {
    // if (!req.body.Campground) throw new ExpressError('Invalid Campground Data.', 400);
    const campground = new Campground(req.body.campground);
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
    // res.render('campgrounds/new');

}))


// Show specific id
router.get('/:id', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate('reviews');
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/show', { campground });
}))


// Edit the campground
router.get('/:id/edit', catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
}))

router.put('/:id/', validateCampground, catchAsync(async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });
    console.log('Putting')
    req.flash('success', 'Successfully updated campground!')
    // res.send('Worked!')
    res.redirect(`/campgrounds/${campground._id}`);
}))


router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    await Campground.findByIdAndDelete(id);

    // res.send('Worked!')
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect(`/campgrounds/`);
})

module.exports = router;