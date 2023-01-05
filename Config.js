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


// const dbUrl = 'mongodb://127.0.0.1:27017/yelp-camp';
const dbUrl = process.env.DB_URL || 'mongodb://127.0.0.1:27017/yelp-camp';
const secret = process.env.SECRET || 'thisshouldbeabettersecret'
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


module.exports.pageLimit = 12; // How many items showed in the index page
module.exports.pageSpan = 6; // How many pages in the middel bar of pagination

module.exports.pageSetConfig = (item_num, pageLimit, page, pageSpan) => {
    const pages = Math.ceil(item_num / pageLimit);
    const startPage = page % pageSpan === 0 ? Math.floor((page - 1) / pageSpan) * pageSpan + 1 : Math.floor(page / pageSpan) * pageSpan + 1;
    const endPage = page + pageSpan - 1 >= pages ? pages : startPage + pageSpan - 1;

    return {
        page: page,
        pages: pages,
        pageLimit: pageLimit,
        startPage: startPage,
        endPage: endPage,
    }
}