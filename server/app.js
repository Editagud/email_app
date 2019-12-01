const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mongoose = require("mongoose");
const passport = require("passport");
const config = require("./email_config/database");
const Email = require("./models/emails");
const cors = require("cors");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );

  next();
});
app.use(express.json());

const sendMail = require("./email_send");
app.use(sendMail);

const router = require("./routes/userRoute");
app.use(router);

app.use(passport.initialize());

app.get("/", (req, res) => {
  res.send("Page under construction.");
});
app.get("/email_list", (req, res) => {
  let userEmails = Email.find({ from: "editagudan@gmail.com" }, function(
    err,
    result
  ) {
    if (err) {
      console.log(err);
    } else {
      res.json(result);
    }
  });
});
app.get("/logout", function(req, res) {
  req.logOut();
  req.session.destroy(function(err) {
    res.redirect("/"); //Inside a callback… bulletproof!
  });
});
app.listen(8080, function(error) {
  if (error) {
    console.log("Error runing on server", error);
  }
  console.log("Server is listening on port 8080");
});
