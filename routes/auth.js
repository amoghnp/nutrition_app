var express = require('express');
var bycrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var User = require('../models/user');
var router = express.Router();
var urlparser = require('body-parser');
const { route } = require('./home');

router.get('/login', function(req, res) {
  let message = null;
  if (req.query.message) {
    message = "Registration successful. Please log in.";
  }
  res.render('login', { message: message });
});

router.post('/login', urlparser.json(), async function(req, res) {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username: username });

    if (!user) {
      return res.status(400).send('User not found');
    }

    const isMatch = await bycrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).send('Invalid password');
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.cookie('token', token, { httpOnly: true, secure: false, sameSite: 'strict' });
    res.redirect('/dashboard');
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

router.get('/logout', function(req, res) {
  res.clearCookie('token');
  res.redirect('/');
});

router.get('/register', function(req, res) {
  res.render('register');
}); 

router.post('/register', urlparser.json(), async function(req, res) {
  const { username, password, email, name } = req.body;

  try {
    const hashedPassword = await bycrypt.hash(password, 10);

    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      return res.status(400).send('User already exists');
    }

    const newUser = new User({ username, password: hashedPassword, email: email, name: name });

    await newUser.save();

    res.redirect('/auth/login?message=Registration successful. Please log in.');
  } 
  catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;