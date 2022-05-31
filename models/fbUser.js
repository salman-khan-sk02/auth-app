const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/Users", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

var userSchema = mongoose.Schema({
    id: String,
    email: String,
    name: String
});

module.exports = mongoose.model('fbUser', userSchema);

