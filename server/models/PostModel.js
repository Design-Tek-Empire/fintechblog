const mongoose = require("mongoose");
 const slug = require("mongoose-slug-generator");
 const domPurify = require("dompurify");
 const { JSDOM } = require("jsdom");
 const htmlPurify = domPurify(new JSDOM().window);
 const { stripHtml } = require("string-strip-html");

// // initialize plugin
 mongoose.plugin(slug);


const postSchema = new mongoose.Schema(
  {
    title: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    category:{ type : String, default: "Uncategorized"},
    description: String,
    slug: {
      type: String,
      slug: "title",
      unique: true,
      slug_padding_size: 2,
    },
    image: String,
    snippet: String,
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

postSchema.pre("validate", function (next) {
  if (this.description) {
    this.description = htmlPurify.sanitize(this.description);
    this.snippet = stripHtml(this.description.substring(0, 150)).result;
  }
  next();
});

module.exports = mongoose.model("Post", postSchema);
