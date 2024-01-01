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

  mustbeAdmin: (req, res, next)=>{
   
    if( req.session.user && req.session.user.role == 'Admin'){
       next();
    }else{
      req.flash("error_msg", "Admin Access Required")
       res.redirect("/");
     
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
