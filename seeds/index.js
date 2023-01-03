const mongoose = require('mongoose');
const path = require('path');
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')
const Campground = require('../models/campground');
const Review = require('../models/review')


mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error:"));
db.once('open', () => {
    console.log('Database connected')
})

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    await Review.deleteMany({});
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author: '63b087f02a274998d11f5caa',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            price: price,
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Modi adipisci minima quasi est perferendis eos alias aperiam, amet sint nemo enim quibusdam necessitatibus culpa, labore suscipit. Ipsum consectetur at dicta.',
            images: [
                {
                    url: 'https://res.cloudinary.com/dhwbsgmjw/image/upload/v1672787597/YelpCamp/photo-1437482078695-73f5ca6c96e2_tccs1j.jpg',
                    filename: 'YelpCamp/photo-1437482078695-73f5ca6c96e2_tccs1j',
                },
                {
                    url: 'https://res.cloudinary.com/dhwbsgmjw/image/upload/v1672787631/YelpCamp/photo-1464822759023-fed622ff2c3b_ylxyrp.jpg',
                    filename: 'YelpCamp/photo-1464822759023-fed622ff2c3b_ylxyrp',
                }
            ],
            geometry: {
                type: 'Point',
                coordinates: [ cities[random1000].longitude, cities[random1000].latitude ],
              },
        })
        await camp.save()
    }
}

seedDB()