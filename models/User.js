var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id : Number,
    name: String,
    email: String,
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;