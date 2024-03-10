const Comment = require("../models/Comments");
const Post = require("../models/PostModel")


module.exports = {
  createComment: async (req, res) => {
    try {
      const { full_name, email, comment, postId } = req.body;

      if (!req.session.user) {
        // Blogger reader is not logged in
        if (full_name == "" || email == "") {
          return res.status(403).json("Fill all input fields");
        } else if (comment.trim() == "") {
          return res.status(403).json("You can't post an empty comment");
        }

        const newComment = await Comment.create({
          full_name,
          email,
          comment,
          postId,
        });
        res.status(201).json(newComment);
      } else {
        req.body.full_name = req.session.user.full_name;
        req.body.email = req.session.user.email;
        req.body.postId = postId;
        req.body.comment = comment;
        req.body.author = req.session.user._id; // For a user that does't have first or last name
        // validate comment input
        if (comment == "") {
          logger.info("Empty Content not allowed");
          return res.status(403).json("Empty Comment not allowed");
        } else {
          const newComment = await Comment.create(req.body);
          res.status(201).json(newComment);
        }
      }
    } catch (error) {
      logger.error(error);
      return res.status(500).json("Internal Server Error");
    }
  },

  editComment: async (req, res) => {
    try {
      const comment = await Comment.findById(req.params.id);
      const currentUserRole = req.session.user.role;

      // Check if the comment was written by a registered user and the registered user is the owner author of the comment or the current User is admin or Editor
      if (
        (comment?.author &&
          comment.author.toString() === req.session.user._id) ||
        ["Admin", "Editor"].includes(currentUserRole)
      ) {
        await comment.updateOne({ $set: req.body });
        res.status(201).json("Update Successfull");
      } else {
        // The comment was not written by a registered user and the current user isn't an Admin or Editor
        if (comment.email === req.session.user.email) {
          // When the comment was written, the non-registered user dropped his email and Fullnames.
          await comment.updateOne({ $set: req.body });
          res.status(201).json("Update Successfull");
        } else {
          return res.status(403).json("Unauthorized Action");
        }
      }
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  deleteComment: async (req, res) => {
    try {
      // A contributor should never be able to delete an approved Post
      // When an Editor Deletes, it should go to Recycle Bin, not fully deleted, can be restored by admin.

      const currentUserRole = req.session.user.role; // Current User
      const commentToDelete = await Comment.findById(req.params.id);

      if (
        (commentToDelete?.author &&
          commentToDelete.author.toString() === req.session.user._id) ||
        ["Admin", "Editor"].includes(currentUserRole)
      ) {
        await commentToDelete.deleteOne();
        res.status(200).json("Delete Successfull");
      } else {
        // The comment was not written by a registered user and the current user isn't an Admin or Editor
        if (commentToDelete.email === req.session.user.email) {
          // When the comment was written, the non-registered user dropped his email and Fullnames.
          await commentToDelete.deleteOne();
          res.status(201).json("Deleted Successfull");
        } else {
          return res.status(403).json("Unauthorized Action");
        }
      }
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },

  viewAllComments: async (req, res) => {
    try {
      const allComments = await Comment.find({ postId: req.params.postId });

      if (allComments.length > 0) {
        res.status(200).json(allComments);
      } else {
        res.status(404).json("No comments found");
      }
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
