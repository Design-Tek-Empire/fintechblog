const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    comment: String,
    email: String,
    full_name: String,
  },
  { timestamps: true }
);


module.exports = mongoose.model("Comment", commentSchema);
