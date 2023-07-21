var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
const user=require("./model/signup-login-schema.js")
const articleRouter=require('./route/articles')
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');

app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }))
app.use('/articles',articleRouter)

var signup=require('./route/signup.js')
app.use('/',signup)



app.set('view engine', 'ejs');
app.set('./views');





app.listen(3000,()=>console.log('server started on port no 3000'))