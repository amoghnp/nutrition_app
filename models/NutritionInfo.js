var mongoose = require('mongoose');

var NutritionInfoSchema = new mongoose.Schema({
    foodName: { type: String, required: true },
    calories: { type: Number, required: true },
    protein: { type: Number, required: true },
    carbs: { type: Number, required: true },
    fats: { type: Number, required: true },
    fiber: { type: Number, required: true },
    glucose: { type: Number, required: true }
});

var NutritionInfo = mongoose.model('NutritionInfo', NutritionInfoSchema);

module.exports = NutritionInfo;