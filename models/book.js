const mongoose = require("mongoose");
const bookSchema = new mongoose.Schema({
  title: String,
  ISBN: String,
  author: String,
  description: String,
  category: String,
  stock: Number,
  photo: {
    data: Buffer,
    contentType: String,
  },
  cancel: String,
  issued: String,
});

module.exports = mongoose.model("Book", bookSchema);
