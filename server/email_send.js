const nodemailer = require("nodemailer");
var express = require("express");
var router = express.Router();
const creds = require("./email_config/email_credentials");
var passport = require("passport");
var mongoose = require("mongoose");
const Email = require("./models/emails");

mongoose
  .connect("mongodb://localhost:27017/emailapp", {
    useNewUrlParser: true
  })
  .catch(error => handleError(error));

getToken = function(headers) {
  if (headers && headers.authorization) {
    var parted = headers.authorization.split(" ");
    if (parted.length === 2) {
      return parted[1];
    } else {
      return null;
    }
  } else {
    return null;
  }
};

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: creds.USER,
    pass: creds.PASS
  }
});

transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take messages");
  }
});

router.post(
  "/api/send",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    let token = getToken(req.headers);
    console.log(req.body);

    const name = req.body.name;
    const email = req.body.email;
    const message = req.body.message;
    const user = req.user.email;

    let mail = {
      from: user,
      to: email,
      subject: name,
      text: message
    };

    if (token) {
      const emailDATA = new Email(mail).save(function(err, response) {
        if (err) {
          res.send(err);
        } else {
          transporter.sendMail(mail, (err, info) => {
            if (err) {
              res.send(err);
            } else {
              res.status(201).send({ success: true, msg: "Sent!" });
            }
          });
        }
      });
    } else {
      res.status(403).send({ success: false, msg: "Unauthorized." });
    }
  }
);

module.exports = router;
