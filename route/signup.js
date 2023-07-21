
const express = require('express')
const router = express.Router()
var session = require('express-session');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');
const User = require('../model/signup-login-schema.js');





router.use(bodyParser.urlencoded({ extended: true })); 
router.use(session({
   secret: "signup",
   resave: false, // Set to false to avoid deprecated warning
   saveUninitialized: false // Set to true to avoid deprecated warning
  }));
router.use(function(req, res, next) {
  res.header('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

router.get('/logout', function(req, res){
 req.session.destroy(function(){
    console.log("user logged out.")
 });
 res.redirect('/signup');

});


router.get('/index', (req, res)=>{
    console.log(req.session.user);
    res.render('index',{User: req.session.User})
     });
     router.get('/signup',(req,res) => {
       res.render('signup',{message :''});
   });
   
     
   
     
//signup

router.post('/signup', (req, res) => {


    if (!req.body.email || !req.body.password) {
        res.render('signup', { message: 'Please provide both email and password' });
    } else {

        // Check if the email already exists in the database
        User.findOne({ email: req.body.email })
            .then(existingUser => {
                if (existingUser) {
                    // Email already registered, show an error message
                    res.render('signup', { message: 'Account with this email already exists' });
                } else {
                    // Email not found, proceed to create a new user
                    const newUser = new User({
                      
                        email: req.body.email,
                        password: req.body.password,
                        status: 'approved',
                        role: 'user',
                    });

                    newUser.save()
                        .then(() => {
                            res.redirect('/articles');
                        })
                        .catch((error) => {
                            res.render('signup', { message: 'Error creating user: ' + error });
                        });
                }
            })
            .catch((error) => {
                res.render('signup', { message: 'Error checking email: ' + error });
            });
    }
});

router.get('/articles', (req, res) => {
    res.render('articles', { user: req.session.user });
});



 
//  login



router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  
  const { email, password } = req.body;

  User.findOne({ email, password, status: 'approved', role: 'user' })
    .then((user) => {
      if (user) {
        // Store user details in the session
        req.session.user = {
          email: req.body.email,
          password: req.body.password,
          status:'approved',
          role:'user',
        };
        res.redirect('/articles');
      } else {
        res.render('login', { message: 'Invalid email or password' });
      }
    })
    .catch((error) => {
      res.render('login', { message: 'Error logging in: ' + error });
    });
});


      
  module.exports = router