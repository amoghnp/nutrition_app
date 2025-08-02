var express = require('express');
var router = express.Router();
var urlparser = require('body-parser');
var { GoogleGenerativeAI } = require('@google/generative-ai');
var User = require('../models/user');
var AltFoods = require('../models/AltFoods');
var authenticateToken = require('../middleware/auth');
var dotenv = require('dotenv');
dotenv.config({ path: './api-key.env' });

const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-pro'});

router.get('/', authenticateToken, async function(req, res) {
  try {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }

    res.render('dashboard', { user: req.user || null, alternative: [] });
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.post('/', authenticateToken, async function(req, res) {
  try {
    const { foodItem } = req.body;
    let alternative = await AltFoods.find({ Dish: foodItem });

    if (!alternative || alternative.length === 0) {
      const prompt = `Suggest a healthier alternative for "${foodItem}" and provide a simple healthy recipe. 
      Return the answer in JSON format with keys: alternativeDish, altRecipe. 
      altRecipe must be an array of objects with keys: ingredients and detailed instructions. 
      If it is more than two recipes like chole bhature return combined recipe in one object.
      Example: { "alternativeDish": "Grilled Chicken Salad", 
      "altRecipe": [{ "ingredients": ["Chicken Breast", "Lettuce", "Tomato", "Cucumber"], 
      "instructions": ["Grill the chicken", "Chop the vegetables", "Mix together"] }] }
      STRICTLY ADHERE TO ABOVE FORMAT.`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();
      const jsonMatch = text.match(/\{[\s\S]*\}/);

      let data;
      try {
        data = JSON.parse(jsonMatch[0]);
      } catch (parseErr) {
        console.error('Failed to parse AI response:', text);
        return res.status(500).send('Failed to get valid alternative from AI');
      }

      const newAlt = new AltFoods({ Dish: foodItem, alternativeDish: data.alternativeDish, altRecipe: data.altRecipe });
      await newAlt.save();
      alternative = [newAlt];
    }

    res.render('dashboard', { user: req.user, alternative: alternative });} 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;