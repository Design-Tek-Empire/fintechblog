const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = {
  createUser: async (req, res) => {
    try {
      await User.create(req.body);
      res.redirect("/u/create");
    } catch (error) {
      console.log(error);
    }
  },

  viewAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find({});
      res.render("./userPages/allUsers", {
        title: "FintechBlog: All Users",
        layout: "../layouts/admin_layout",
        allUsers,
      });
    } catch (error) {
      console.log(error);
    }
  },

  singleUser: async (req, res) => {
    try {
      const userProfile = await User.findById(req.params.id);
      res.render("./userPages/userProfile", {
        title: `FintechBlog: ${userProfile.firstname}`,
        layout: "../layouts/admin_layout",
        userProfile,
      });
    } catch (error) {
      console.log(error);
    }
  },
  editUser: async (req, res) => {
    // Check if user is editing password
    if (req.body.password) {
      try {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      } catch (err) {
        console.log(err);
      }
    }

    try {
      await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });

      req.flash("success_msg", "Update Successful");
      res.redirect(`/u/user/${req.params.id}`);
    } catch (error) {
      console.log(error);
    }
  },
  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      req.flash("success_msg", "User Deleted");
      res.redirect(`/u/user/allUsers`);
    } catch (error) {
      console.log(error);
    }
  },
};
