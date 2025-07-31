var express = require('express');
var router = express.Router();
var urlparser = require('body-parser');
var User = require('../models/user');
var UserStats = require('../models/UserStats');
var authenticateToken = require('../middleware/auth');

router.get('/dashboard', authenticateToken, async function(req, res) {
  try {
    if (!req.user) {
      return res.status(401).send('Unauthorized');
    }
    const userStats = await UserStats.findOne({ userId: req.user.userId });

    if (!userStats) {
      return res.status(404).send('User stats not found');
    }

    res.render('dashboard', { user: req.user, stats: userStats });
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;