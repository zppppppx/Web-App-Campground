const mongoose = require('mongoose');
const Review = require('./review');

const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
    title: String,
    price: Number,
    images: [
        {
            url: String,
            filename: String,
        }
    ],
    description: String,
    location: String,
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


// This post middleware is binded to what we have used for deleting the campground `findByIdAndDelete`
CampgroundSchema.post('findOneAndDelete', async function(doc) {
    // here doc is what we deleted.
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews,
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema)