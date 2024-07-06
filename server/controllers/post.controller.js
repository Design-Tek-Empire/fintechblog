const Post = require("../models/PostModel");
const User = require("../models/UserModel");
const { countWordsLength } = require("../utils/countWords");

module.exports = {
  createPost: async (req, res) => {
    try {
      const { title, desc } = req.body;

      if (!title.trim()) {
        return res.status(422).json({ msg: "Post title is required" });
      }

      if (!desc) {
        return res.status(422).json({ msg: "Provide Post Content" });
      }

      // Confirm that total words in the post is up to 700 words.
      const wordlength = countWordsLength(desc);

      if (wordlength < 700) {
        return res.status(422).json({
          msg: `Minimum words length: 700 words, You've written : ${wordlength} words`,
        });
      }

      req.body.author = req.session.user._id;
      const newPost = await Post.create(req.body);

      if (!newPost) {
        throw new Error("Error Creating the Post");
      }

      // Send Email to Admin for Approval

      res.status(200).json(newPost);
    } catch (error) {
      logger.error(error);
      return res.status(422).json({ error: error.message });
    }
  },
  // Approve A Post
  approvePost: async (req, res) => {
    try {
      const { status } = req.body;

      const approvedPost = await Post.findByIdAndUpdate(
        req.params.id,
        { $set: { status } },
        { new: true }
      );

      res.status(201).json(approvedPost);
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  editPost: async (req, res) => {
    try {
      const { id: postId } = req.params;
      const post = await Post.findById(postId);
      const currentUserRole = req.session.user.role;

      const isAuthorized =
        post.author.toString() === req.session.user._id ||
        ["Admin", "Editor"].includes(currentUserRole);

      if (isAuthorized) {
        await post.updateOne({ $set: req.body });
        res.status(201).json("Post Updated Successfully");
      } else {
        logger.error("Unauthorized Action");
        return res.status(403).json("Unauthorized Action");
      }
    } catch (error) {
      logger.error(error, "Internal Server Error");
      res.status(500).send("Internal Server Error");
    }
  },

  deletePost: async (req, res) => {
    try {
      // A contributor should never be able to delete an approved Post
      // When an Editor Deletes, it should go to Recycle Bin, not fully deleted, can be restored by admin.

      const currentUser = req.session.user; // Current User
      const post = await Post.findById(req.params.id);

      // Check if Post is Approved and Live
      if (post.status == "Approved") {
        // Contibutor Should never be able to reach this endPoint

        if (currentUser.role !== "Contributor") {
          // Check if current User is an Editor

          if (currentUser.role !== "Admin") {
            // Current User is Editor
            //  Implement Achiving and sent to recycle bin
            const deletedPost = await post.updateOne({
              $push: {
                deleteManager: {
                  deletedBy: currentUser._id,
                  deleteReason: req.body.deleteReason,
                  deletedAt: new Date(Date.now()),
                },
              },
            });

            if (!deletedPost) {
              return res
                .status(500)
                .json({ error: "An Error Occurred in the Server" });
            }
            res
              .status(200)
              .json({ msg: "Post deleted Awaiting Admin Confirmation" });
          } else {
            // Current User is Admin,
            // Implement Permanent Delete
            await post.deleteOne();
            res.status(200).json({ msg: "Post Deleted Permanently" });
          }
        } else {
          return res.status(403).json({ error: "Unauthorized Action" });
        }
      } else {
        //  Post is either Pending or Declined.{}
        // 1. Admin and Editor can delete posts completely here
        // 2. The Author can Delete his/her post completely
        if (currentUser.role !== "Contributor") {
          await post.deleteOne();
          return res.status(200).json({ msg: "Post Deleted" });
        }

        // Author Deletes his/her own post
        if (post.author.toString() === currentUser._id) {
          await post.deleteOne();
          return res.status(200).json({ msg: "Post Deleted" });
        } else {
          return res.status(403).json({ error: "Unauthorized Action" });
        }
      }
    } catch (error) {
      console.log(error);
      res.status(500).send("Internal Server Error");
    }
  },

  restoreDeletedPost: async (req, res) => {
    try {
      //  const post = await Post.findById(req.params.id)
      const currentUser = req.session.user;

      const updatedPost = await Post.findByIdAndUpdate(req.params.id, {
        $set: {
          "deleteManager.$[].status": "Restored",
          "deleteManager.$[].restoredBy": currentUser._id,
          "deleteManager.$[].restoreReason": req.body.restoreReason,
          "deleteManager.$[].restoredAt": new Date(Date.now()),
        },
      });

      if (!updatedPost) {
        return res.status(404).send("Post not found");
      }

      return res.status(200).send("Post Restored");
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  viewAllPosts: async (req, res) => {
    const { category, author } = req.query; // filtering posts by Category and author

    try {
      // Get all posts
      let posts = await Post.find({ status: "Approved" })
        .populate([
          { path: "author", select: "-password -updatedAt -createdAt" },
        ])
        .sort({ createdAt: -1 })
        .limit(10);

      // Query Posts by Category or by Author

      if (category) {
        posts = posts.filter((p) => p.category == category); // when a category is requested, eg /?category=Finances
      } else if (author) {
        posts = posts.filter((p) => p.author.username == author); // same as category above
      } else {
        posts = posts; // when no query is requested
      }

      if (posts.length > 0) {
        res.status(200).json(posts);
      } else {
        res.status(204).json("No Posts found");
      }
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  singleUserAllPosts: async (req, res) => {

    try {

      const userAllPosts = await Post.find({
        author: req.params.userId,
      }).populate([
        { path: "author", select: "-password -updatedAt -createdAt" },
      ]);

      res.status(200).json(userAllPosts)
      
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  viewSinglePost: async (req, res) => {
    try {
      const post = await Post.findOne({ slug: req.params.slug }).populate([
        { path: "author", select: "-password -updatedAt -createdAt" },
      ]);

      if (post) {
        res.status(201).json(post);
      } else {
        res.status(204).json({ error: "Post Not Found" });
      }
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  likePost: async (req, res) => {
    // Extract current postId from the body

    const { postId } = req.body;

    try {
      const post = await Post.findById(postId);

      if (!post.likes.includes(req.session.user._id)) {
        // If current user hasn't previously liked the post then update likes
        await post.updateOne({
          $push: { likes: req.session.user._id },
        });
        return res.status(201).json("Post Liked");
      } else {
        //  If current User already liked, then unlike the post
        await post.updateOne({
          $pull: { likes: req.session.user._id },
        });
        return res.status(201).json("Post disliked");
      }
    } catch (error) {
      logger.error(error);
    }
  },
  bookmarkAPost: async (req, res) => {
    // Extract current postId from the body

    const { postId } = req.body;
    const currentUser = req.session.user;

    try {
      const post = await Post.findById(postId);

      if (!post.bookmarks.includes(currentUser._id)) {
        // If current user hasn't previously liked the post then update likes
        await post.updateOne({
          $push: { bookmarks: { userId: currentUser._id } },
        });
        await User.findOneAndUpdate(
          { _id: currentUser._id },
          {
            $push: { bookmarks: { postId } },
          }
        );
        return res.status(201).json("Post Bookmarked");
      } else {
        //  If current User already liked, then unlike the post
        await post.updateOne({
          $pull: { bookmarks: { userId: currentUser._id } },
        });

        await User.findOneAndUpdate(
          { _id: currentUser._id },
          {
            $pull: { bookmarks: { postId } },
          }
        );

        return res.status(201).json("Bookmark removed");
      }
    } catch (error) {
      logger.error(error);
    }
  },

  userBookmarks: async (req, res) => {
    try {
      const { userId } = req.params;
      const user = req.session.user;

      // Check if the user is Admin, Editor, or the same user as requested
      if (
        user.role !== "Admin" &&
        user.role !== "Editor" &&
        user._id !== userId
      ) {
        return res.status(403).json({ err: "Forbidden" });
      }
      const bookmarksAr = await Post.find({
        bookmarks: { $elemMatch: { userId: userId } },
      });

      if (bookmarksAr.length > 0) {
        res.status(200).json(bookmarksAr);
      } else {
        return res.status(204).json("No Bookmarks Found");
      }
    } catch (err) {
      logger.error(err);
    }
  },
};
