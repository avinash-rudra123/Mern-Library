const mongoose = require("mongoose");
const handleSchema = new mongoose.Schema({
  info: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
    title: String,

    category: String,
  },

  time: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "issue",
    },
    returnDate: Date,
    issueDate: Date,
  },

  user_id: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: String,
  },

  fine: {
    amount: Number,
    date: Date,
  },

  entryTime: {
    type: Date,
    default: Date.now(),
  },
});
module.exports = mongoose.model("Handle", handleSchema);
