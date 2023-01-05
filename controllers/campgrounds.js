
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;

const Campground = require('../models/campground');
const { cloudinary } = require('../cloudinary/index');
const { pageLimit, pageSpan, reviewPageLimit, reviewPageSpan, pageSetConfig } = require('../Config');
// const { pageSetConfig } = require('../utils/pageSetConfig');

const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    // console.log(req.originalUrl);
    res.locals.pageUrl = '/campgrounds';
    var { page, ...otherQueries } = req.query;
    suffixQuery = '';
    for(let query in otherQueries) {
        suffixQuery += `&${query}=${otherQueries[query]}`;
    }
    // console.log(suffixQuery);

    page = page ? Number(page) : 1;
    const campgrounds_all = await Campground.find({});
    const item_num = campgrounds_all.length;
    // console.log(campgrounds.length);
    const campgrounds = campgrounds_all.slice((page - 1) * pageLimit, page * pageLimit);
    
    const pageConfig = pageSetConfig(item_num, pageLimit, pageSpan, page);
    // console.log(pageConfig);

    const loadMap = true;
    res.render('campgrounds/indexPage', { campgrounds_all, campgrounds, loadMap, pageConfig, suffixQuery });
};


module.exports.renderNewForm = (req, res) => {
    res.render('campgrounds/new') // cannot write as '/campgrounds/new'
};

module.exports.createCampground = async (req, res) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.campground.location,
        limit: 1,
    }).send();
    const campground = new Campground(req.body.campground);
    // here [0] corresponds to limit 1, thats to say only one data sent back.
    campground.geometry = geoData.body.features[0].geometry
    campground.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.author = req.user._id;
    await campground.save();
    req.flash('success', 'Successfully made a new campground!');
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.showCampground = async (req, res) => {
    res.locals.pageUrl = `/campgrounds/${req.params.id}`;
    var { page, ...otherQueries } = req.query;
    suffixQuery = '';
    for(let query in otherQueries) {
        suffixQuery += `&${query}=${otherQueries[query]}`;
    }
    page = page ? Number(page) : 1;

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
    const item_num = campground.reviews.length;
    const pageConfig = pageSetConfig(item_num, reviewPageLimit, reviewPageSpan, page);
    const loadMap = true;
    res.render('campgrounds/show', { campground, loadMap, pageConfig });
};

module.exports.renderEditForm = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findById(id);
    if (!campground) {
        req.flash('error', 'Cannot find that campground!');
        res.redirect('/campgrounds');
    }
    res.render('campgrounds/edit', { campground });
};

module.exports.EditCampground = async (req, res) => {
    const { id } = req.params;
    const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground }); // Break this up to allow permission
    const images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    campground.images.push(...images);
    await campground.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await campground.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } });
    }
    req.flash('success', 'Successfully updated campground!')
    res.redirect(`/campgrounds/${campground._id}`);
};

module.exports.deleteCampground = async (req, res) => {
    const { id } = req.params;

    await Campground.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the campground!');
    res.redirect(`/campgrounds/`);
};