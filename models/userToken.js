const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        require: true,
        ref: 'User',
    },
    token: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        ref: 'User'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 900, // it expires after 900 seconds, 15 mins.
    }
})

module.exports = mongoose.model('UserToken', userTokenSchema);