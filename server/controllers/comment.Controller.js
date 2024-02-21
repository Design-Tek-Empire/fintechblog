const Comment = require("../models/Comments");


module.exports = {
  createComment: async (req, res) => {
    try {
      // const { title } = req.body;

      // if (!title.trim()) {
      //   return res.status(403).json({ msg: "Post title is required" });
      // }

      // req.body.author = req.session.user._id;
      // const newPost = await Post.create(req.body);

      // if (!newPost) {
      //   throw new Error("Error Creating the Post");
      // }

      // // Send Email to Admin for Approval

      // res.status(200).json(newPost);

    } catch (error) {
      console.error(error);
      return res.status(422).json({ error: error.message });
    }
  },


  // editComment: async (req, res) => {
  //   try {
  //     const { id: postId } = req.params;
  //     const post = await Post.findById(postId);
  //     const currentUserRole = req.session.user.role;

  //     const isAuthorized =
  //       post.author.toString() === req.session.user._id ||
  //       ["Admin", "Editor"].includes(currentUserRole);

  //     if (isAuthorized) {
  //       await post.updateOne({ $set: req.body });
  //       res.status(201).json(post);
  //     } else {
  //       return res.status(403).json({ error: "Unauthorized Action" });
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },

  // deleteComment: async (req, res) => {
  //   try {
  //     // A contributor should never be able to delete an approved Post
  //     // When an Editor Deletes, it should go to Recycle Bin, not fully deleted, can be restored by admin.

  //     const currentUser = req.session.user; // Current User
  //     const post = await Post.findById(req.params.id);

  //     // Check if Post is Approved and Live
  //     if (post.status == "Approved") {
  //       // Contibutor Should never be able to reach this endPoint

  //       if (currentUser.role !== "Contributor") {
  //         // Check if current User is an Editor

  //         if (currentUser.role !== "Admin") {
  //           // Current User is Editor
  //           //  Implement Achiving and sent to recycle bin
  //           const deletedPost = await post.updateOne({
  //             $push: {
  //               deleteManager: {
  //                 deletedBy: currentUser._id,
  //                 deleteReason: req.body.deleteReason,
  //                 deletedAt: new Date(Date.now()),
  //               },
  //             },
  //           });

  //           if (!deletedPost) {
  //             return res
  //               .status(500)
  //               .json({ error: "An Error Occurred in the Server" });
  //           }
  //           res
  //             .status(200)
  //             .json({ msg: "Post deleted Awaiting Admin Confirmation" });
  //         } else {
  //           // Current User is Admin,
  //           // Implement Permanent Delete
  //           await post.deleteOne();
  //           res.status(200).json({ msg: "Post Deleted Permanently" });
  //         }
  //       } else {
  //         return res.status(403).json({ error: "Unauthorized Action" });
  //       }
  //     } else {
  //       //  Post is either Pending or Declined.{}
  //       // 1. Admin and Editor can delete posts completely here
  //       // 2. The Author can Delete his/her post completely
  //       if (currentUser.role !== "Contributor") {
  //         await post.deleteOne();
  //         return res.status(200).json({ msg: "Post Deleted" });
  //       }

  //       // Author Deletes his/her own post
  //       if (post.author.toString() === currentUser._id) {
  //         await post.deleteOne();
  //         return res.status(200).json({ msg: "Post Deleted" });
  //       } else {
  //         return res.status(403).json({ error: "Unauthorized Action" });
  //       }
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },


  // viewAllComment: async (req, res) => {
  //   const { category, author } = req.query; // filtering posts by Category and author

  //   try {
  //     // Get all posts
  //     let posts = await Post.find()
  //       .populate([
  //         { path: "author", select: "-password -updatedAt -createdAt" },
  //       ])
  //       .sort({ createdAt: -1 })
  //       .limit(10);

  //     // Query Posts by Category or by Author

  //     if (category) {
  //       posts = posts.filter((p) => p.category == category); // when a category is requested, eg /?category=Finances
  //     } else if (author) {
  //       posts = posts.filter((p) => p.author.username == author); // same as category above
  //     } else {
  //       posts = posts; // when no query is requested
  //     }

  //     res.status(200).json(posts);
  //   } catch (error) {
  //     console.log(error);
  //     res.status(500).send("Internal Server Error");
  //   }
  // },

  // viewSingleComment: async (req, res) => {
  //   try {
  //     const post = await Post.findOne({ slug: req.params.slug }).populate([
  //       { path: "author", select: "-password -updatedAt -createdAt" },
  //     ]);

  //     if (post) {
  //       res.status(201).json(post);
  //     } else {
  //       res.status(404).json({ error: "Post Not Found" });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};
