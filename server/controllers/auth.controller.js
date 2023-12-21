const User = require("../models/UserModel")
const bcrypt = require("bcrypt");
const passport = require("passport");


// Render Registration Page (Get Request)
module.exports.register = async (req, res) => {
  try {

    res.render("Register", {
      title: "FintechBlog: Sign Up",
      layout: "../layouts/public_layout",
    });

    
  } catch (error) {
    console.log(error);
  }
}

// Render Login Page (Get Request)
module.exports.login = async (req, res) => {
  try {

    res.render("Login", {
      title: "FintechBlog: Login",
      layout: "../layouts/public_layout",
    });

    
  } catch (error) {
    console.log(error);
  }
}

//  Create Actuall User (Post Request)
 module.exports.createAccount = async (req, res) => {
    const { username, email, password } = req.body;
    const errors = [];

    // Validate username
    
    if (!username) {
     return  errors.push({ msg: "Please provide a username" });
    } else if (username.length < 4) {
      errors.push({ msg: "Username is too short (min 4 characters)" });
    }

    // Validate email
    if (!email) {
      errors.push({ msg: "Please provide an email" });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.push({ msg: "Invalid email address" });
    }

    // Validate password
    if (!password) {
      errors.push({ msg: "Please provide a password" });
    } else if (password.length < 6) {
      errors.push({ msg: "Password is too short (min 6 characters)" });
    }
    // // Render the registration page with errors if any
    if (errors.length > 0) {
     res.render("register", {
       title: "FintechBlog: Sign Up",
       layout: "../layouts/public_layout",
       errors,
       username,
       email,
       password,
     });


    } else {
       try {
         const userExists = await User.findOne({ email: email });
         if (userExists) {
           req.flash("error_msg", "Account Already Exists");
           return res.redirect("/secure/register");
         } else {

           const salt = await bcrypt.genSalt(10);
           const hashedPassword = await bcrypt.hash(password, salt);
           await User.create({
             username,
             email,
             password: hashedPassword,
           });
           req.flash("success_msg", "Registration successful, Please Login");
           res.redirect("/secure/login");
         }
       } catch (error) {
         console.log(error);
       }
     }
  };

  // Actuall Login (Post Request)
  module.exports.signIn = async(req, res, next)=>{
     let { username, password } = req.body;

     if (username == "" && password == "") {
       return res.redirect("/secure/login");
     } 

     

        passport.authenticate("local", { failureRedirect: "/login" }),
          function (req, res) {
            res.redirect("/");
          };

  }