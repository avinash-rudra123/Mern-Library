const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    joined: {
      type: Date,
      default: Date.now(),
    },
    rules: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
      default: "",
    },
    fines: {
      type: Number,
      default: 0,
    },
    resetToken: {
      type: String,
    },
    tokenExpiration: {
      type: Date,
    },
    bookIssueInfo: [
      {
        book_info: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "issue",
          },
        },
      },
    ],
    role: {
      type: String,
      default: "user",
      enum: ["user", "admin", "superadmin"],
    },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("user", userSchema);
