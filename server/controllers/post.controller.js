const Post = require("../models/PostModel");
const Category = require("../models/CategoryModel")

module.exports = {
  createPostPage: async (req, res) => {
    try {
      const categories = await Category.find();
      res.render("./postPages/createPost", {
        title: "FintechBlog: Create Post",
        layout: "../layouts/admin_layout",
        categories,
      });
    } catch (error) {
      console.log(error);
    }
  },
  createPost: async (req, res) => {
    try {
      const { title } = req.body;

      if (!title.trim()) {
        req.flash("error_msg", "Provide Post Title");
        return res.redirect("/posts/create");
      }

      req.body.author = req.session.user._id;
      await Post.create(req.body);

      req.flash("success_msg", "Post Created, Awaiting Admin Approval");
      res.status(200).redirect("/posts/create");
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  editPostPage: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug });
      const categories = await Category.find();

      //  Check for the author
      if (req.session.user._id == post.author.toString()) {
        res.render("./postPages/editPost", {
          title: "FintechBlog: Edit Post",
          layout: "../layouts/admin_layout",
          post,
          categories,
        });
      } else {
        req.flash("error_msg", "Unauthorized Action");
        res.redirect(`/posts/${req.params.slug}`);
      }
    } catch (error) {
      console.log(error);
    }
  },
  editPost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { slug: req.params.slug },
        {
          $set: req.body,
        },
        { new: true }
      );
      req.flash("success_msg", "Edited Successfully");
      res.redirect(`/posts/${req.params.slug}`);
    } catch (error) {
      console.log(error);
    }
  },
  deletePost: async (req, res) => {
    try {
      await Post.findByIdAndDelete(req.params.id);
      req.flash("success_msg", "Deleted Successfully");
      res.redirect(`/posts/all`);
    } catch (error) {
      console.log(error);
    }
  },
  pendingPosts: async (req, res) => {
    
    try {
    
      let posts = await Post.find({ isApproved: false }) // Filter only approved Posts
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(10);

      res.render("./postPages/pendingPosts", {
        title: "FintechBlog: Pending Posts",
        layout: "../layouts/public_layout",
        posts,
      });

    } catch (error) {
      console.log(error);
    }
  },

  viewAllPosts: async (req, res) => {
    const { category, author } = req.query; // filtering posts by Category and author

    try {
      let posts = await Post.find({ isApproved: true }) // Filter only approved Posts
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(10);

      if (category) {
        posts = posts.filter((p) => p.category == category); // when a category is requested, eg all?category=Finances
      } else if (author) {
        posts = posts.filter((p) => p.author.username == author); // same as category above
      } else {
        posts = posts; // when no query is requested
      }

      res.render("./postPages/allPosts", {
        title: "FintechBlog: Posts",
        layout: "../layouts/public_layout",
        posts,
      });
    } catch (error) {
      console.log(error);
    }
  },

  viewSinglePost: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate(
        "author"
      );

      res.render("./postPages/singlePost", {
        title: `FintechBlog: ${post.slug}`,
        layout: "../layouts/public_layout",
        post,
      });
    } catch (error) {
      console.log(error);
    }
  },
  approvePost: async (req, res) => {
    try {
      await Post.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            isApproved: true,
          },
        },
        { new: true }
      );

      req.flash("success_msg", "Post Approved");
      // Send Notification Email
      res.redirect("/posts/all");
    } catch (error) {
      console.log(error);
    }
  },
};
