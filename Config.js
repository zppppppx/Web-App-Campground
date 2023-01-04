const session = require('express-session');
const MongoDBStore = require('connect-mongo');

const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com/",
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://stackpath.bootstrapcdn.com/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
    "https://cdn.jsdelivr.net"
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];

module.exports.helmetContentSecurityConfig = {
    directives: {
        defaultSrc: [],
        connectSrc: ["'self'", ...connectSrcUrls],
        scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
        styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
        workerSrc: ["'self'", "blob:"],
        objectSrc: [],
        imgSrc: [
            "'self'",
            "blob:",
            "data:",
            `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/`, //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
            "https://images.unsplash.com/",
        ],
        fontSrc: ["'self'", ...fontSrcUrls],
    },
}


// const dbUrl = process.env.DB_URL;
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const secret = prcess.env.SECRET ||'thisshouldbeabettersecret'
module.exports.dbUrl = dbUrl;

const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret: secret,
    touchAfter: 24 * 60 * 60 // in seconds
});
store.on("error", e => {
    console.log('Session Store Error', e);
})

module.exports.sessionConfig = {
    store: store,
    secret: secret,
    resave: false,
    saveUninitialized: true,
    name: 'session',
    cookie: {
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: Date.now() + 1000 * 60 * 60 * 24 * 7,
        httpOnly: true,
        // secure: true, // this will only allow https request
    }
};


