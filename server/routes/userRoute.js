const router = require("express").Router();
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
var passport = require("passport");
require("../email_config/passport")(passport);
var config = require("../email_config/database");

mongoose
  .connect("mongodb://localhost:27017/emailapp", {
    useNewUrlParser: true
  })
  .catch(error => handleError(error));

router.post("/api/users/signup", (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  }).save(function(err, response) {
    if (err) console.log(err);
    else console.log("Saved : ", response);
  });
});

router.post("/api/users/login", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) res.json({ message: "Login failed, user not found!" });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err;
      if (!isMatch) return res.status(400).json({ message: "Wrong Password" });

      let token = jwt.sign(user.toObject(), config.secret);
      // return the information including token as JSON
      res.json({ success: true, token: "JWT " + token });
    });
  });
});

module.exports = router;
