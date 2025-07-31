var express = require('express');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.config({ path: './api-key.env' });
var connectDB = require('./models/connectDB');
var cookieParser = require('cookie-parser');

var app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.use("/bootstrap", express.static(__dirname + "/node_modules/bootstrap/dist"));

connectDB();

app.use("/auth", require('./routes/auth'));
app.use("/", require('./routes/home'));
app.use("/", require('./routes/dashboard'));

app.listen(3000, function() {
  console.log('Server is running on http://localhost:3000');
});