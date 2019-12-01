const mongoose = require("mongoose");

const emailSchema = mongoose.Schema({
  from: {
    type: String
  },
  to: {
    type: String
  },
  subject: {
    type: String
  },
  text: {
    type: String
  }
});

const Email = mongoose.model("Email", emailSchema, "emails");

module.exports = Email;
