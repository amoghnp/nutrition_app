var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    id : Number,
    username: String,
    password: String
});

var User = mongoose.model('User', userSchema);

module.exports = User;