const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    }
}); // No need for username and password, passport will do them for us

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);