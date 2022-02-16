const mongoose = require("mongoose");

const UserSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "user email cant be null"],
  },
  password: {
    type: String,
    required: [true, "user password cant be null field"],
  },
});

module.exports = mongoose.model("Users", UserSchema);
