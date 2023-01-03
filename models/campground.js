const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String,
})

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200,h_150,c_fill'); //using virtual can ease the storage.
})

ImageSchema.virtual('showPage').get(function() {
    return this.url.replace('/upload', '/upload/w_1920,h_1080,c_fill');
})

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [ImageSchema],
    description: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true,
        },
        coordinates: {
            type: [Number],
            required: true,
        }
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

https://res.cloudinary.com/dhwbsgmjw/image/upload/w_300/v1672680691/YelpCamp/fhnze88gcpuftwb9om9r.png


// This post middleware is binded to what we have used for deleting the campground `findByIdAndDelete`
CampgroundSchema.post('findOneAndDelete', async function (doc) {
    // here doc is what we deleted.
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)