var mongoose = require('mongoose');

var altFoodSchema = new mongoose.Schema({
  Dish: {
    type: String,
    required: true,
    unique: true
  },
  alternativeDish: {
    type: String,
    required: true,
  },
  altRecipe: [
    {
        ingredients: {
          type: [String],
          required: true
        },
        instructions: {
          type: [String],
          required: true
        }
    }
  ]
});

var AltFoods = mongoose.model('AltFoods', altFoodSchema);   

module.exports = AltFoods;