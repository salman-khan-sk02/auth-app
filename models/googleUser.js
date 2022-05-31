const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var userSchema = mongoose.Schema({
    id: String,
    given_name: String,
    family_name: String,
    email: String,
    name: String,
    picture: String
});

module.exports = mongoose.model('googleUser', userSchema);