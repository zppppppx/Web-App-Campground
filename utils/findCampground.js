const Campground = require('../models/campground');
const ExpressError = require('./ExpressError');

module.exports.findCampground = async (query, next) => {
    // const test = await Campground.find({price: {$gt: 20}}).populate({
    //     path: 'author',
    //     match: {username: {$in: ['zszpx']}}
    // });
    // console.log(test);
    // const test = await Campground.find({});
    // console.log(test);
    // const test = await Campground.find({}).populate('author');
    let { price_low, price_high } = query;
    if (price_low || price_high) {
        // console.log(price_low, price_high);
        price_low = (price_low === '' || price_low === undefined) ? 0 : Number(price_low);
        price_high = (price_high === '' || price_high === undefined) ? Number.MAX_VALUE : Number(price_high);
        if (price_high < price_low) {
            next(new ExpressError('Please fill in reasonable price regions', 500));
        }
        return await Campground.find({ price: { $gte: price_low, $lte: price_high } });
    }
    else return await Campground.find({});
}