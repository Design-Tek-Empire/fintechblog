const mongoose = require("mongoose");
const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      min: 4,
      trim: true,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    email: {
      type: String,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, // Use a regular expression for email validation
    },
    password: {
      type: String,
      min: 6,
    },
    role: {
      type: String,
      enum: ["Admin", "Editor", "Partner", "Contributor"],
      default: "Contributor",
    },
    image: {
      type: String,
    },
    bookmarks: { type: Array, default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
