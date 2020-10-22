const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const NotificationSchema = new Schema({
  book_info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,
    author: String,
    ISBN: String,
    category: String,
    description: String,
    stock: Number,
  },
  body: {
    type: String,
    required: [true, "Notification Message"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  views: {
    type: Boolean,
    default: false,
  },
  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: String,
  },
  isEnabled: {
    type: Boolean,
    default: false,
  },
  category: String,
});
const Notification = mongoose.model("notification", NotificationSchema);
module.exports = Notification;
