const User = require("../models/UserModel");
const Post = require("../models/PostModel")

module.exports = {
  //
  authenticateUser: (req, res, next) => {
    if (req.session && req.session.user) {
      return next();
    } else {
      req.flash("error", "Login is Required");
      return res.redirect("/secure/login");
    }
  },
  // Ensure user hasn't logged in
  ensureGuest: (req, res, next) => {
    if (!req.session.isAuthorized) {
      return next();
    } else {

      res.redirect("/d/dashboard");
    }
  },

  // Should be an admin or Editor to have the ability
  isAdminOrEditor: (req, res, next)=>{
    if(req.session.user.role != 'Subscriber'){
       return next();
    }else{
      req.flash("error_msg", "Admin Access Required")
       res.redirect("/");
     
    }
  },

  // must be an admin or must be the creator of the post
  isAuthorized: async (req, res, next)=>{
     try {
       const post = await Post.findById(req.params.id);
        if(req.session.user.role == "Admin" || req.session.user._id == post.author.toString()){
          next ()
        }else{
          req.flash('error_msg', 'unauthorized action')
          res.redirect("/d/dashboard");
        }

     } catch (error) {
      console.log(error)
     }
   
  },

  // Maintain case consistency
  usernameToLowerCase: (req, res, next) => {
    if (req.body.username) {
      req.body.username = req.body.username.toLowerCase().trim();
    }
    next();
  },
};
