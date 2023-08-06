var express = require("express");
const bcrypt = require("bcrypt");
var router = express.Router();
const bodyParser = require("body-parser");
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());
var mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/myExpress");

const session = require("express-session");

router.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);
const User = require("../models/user");

checkSignIn = (req, res, next) => {
  if (req.session.user) {
    next(); //If session exists, proceed to page
  } else {
    res.redirect("/logout");
  }
};
//AUTH ROUTES
router.get("/signup", (req, res) => {
  res.render("signup", { message: "" });
});
router.post("/login", (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.render("signup", {
      message: "Please provide both email and password",
    });
  }

  User.findOne({ email: req.body.email })
    .then((user) => {
      if (!user) {
        return res.render("signup", { message: "User not found" });
      }

      const passwordMatch = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (passwordMatch) {
        req.session.user = {
          _id: user._id,
          email: user.email,
          role: user.role,
          name: user.name,
        };

        res.redirect("/dashboard");
      } else {
        res.render("signup", { message: "Invalid Credentials" });
      }
    })
    .catch((error) => {
      console.error("Error during login:", error);
      res.status(500).send("Internal Server Error");
    });
});
router.get("/login", (req, res) => {
  res.render("login", { message: "" });
});
router.post("/signup", (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (!email || !password) {
    return res.render("signup", {
      message: "Please provide both email and password",
    });
  }
  if (password !== confirmPassword) {
    return res.render("signup", { message: "Passwords do not match" });
  }

  // Check if the user's email already exists in the database
  User.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        return res.render("signup", { message: "User email already exists" });
      }

      // If the email is unique, create a new user
      const newUser = new User({
        name,
        email,
        password: bcrypt.hashSync(password, 10),
        role: "user",
      });

      // Save the new user to the database
      newUser
        .save()
        .then((user) => {
          req.session.user = user; // Store the user in the session
          res.redirect("/dashboard");
        })
        .catch((error) => {
          res.render("signup", { message: "Error creating user: " + error });
        });
    })
    .catch((error) => {
      res.render("signup", { message: "Error checking user email: " + error });
    });
});

router.get("/logout", function (req, res) {
  req.session.destroy(function () {
    console.log("user logged out.");
  });
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.redirect("/");
});

module.exports = router;
