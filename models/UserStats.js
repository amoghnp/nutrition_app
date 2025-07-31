var mongoose = require('mongoose');

var userStatsSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    weight: { type: Number},
    targetWeight: { type: Number },
    height: { type: Number},
    dateOfBirth: { type: String, required: true },
    caloriesConsumed: { type: Number, default: 0 },
    caloriesBurned: { type: Number, default: 0 }
});

var UserStats = mongoose.model('UserStats', userStatsSchema);

module.exports = UserStats;