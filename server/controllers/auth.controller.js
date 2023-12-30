const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

// Hangle Registration
module.exports = {
  // Get Registration Page
  registerPage: async (req, res) => {
    try {
      res.render("./authPages/Register", {
        title: "FintechBlog: Sign Up",
        layout: "../layouts/public_layout",
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Registration Handler Function
  register: async (req, res) => {
    const { username, email, password } = req.body;
    const errors = [];

    // Validate inputes
    if (username == "" && email == "" && password == "") {
      return res.redirect("/secure/register");
    }
    if (username == "") {
      errors.push({ msg: "Pls Enter Your username" });
    } else if (email == "") {
      errors.push({ msg: "Pls Enter Your Email" });
    } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      errors.push({ msg: "Email is Invalid" });
    } else if (password == "") {
      errors.push({ msg: "Provide Password" });
    } else if (password.length < 6) {
      errors.push({ msg: "Password should be at least 6 Characters" });
    }

    // // Render the registration page with errors if any
    if (errors.length > 0) {
      res.render("./authpages/register", {
        title: "FintechBlog: Sign Up",
        layout: "../layouts/public_layout",
        errors,
        username,
        email,
        password,
      });
    } else {
      try {
        // Check if the User Already Exists with either his email or username
        const userExists = await User.findOne({
          $or: [{ email: email }, { username: username }],
        });

        if (userExists) {
          req.flash("error_msg", "You can't use this credentials");
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
  },

  // Render Login Page
  loginPage: async (req, res) => {
    try {
      res.render("./authPages/Login", {
        title: "FintechBlog: Login",
        layout: "../layouts/public_layout",
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Login Handler

  login: async (req, res) => {
    let { username, password } = req.body;

    if (username == "" && password == "") {
      return res.redirect("/secure/login");
    } else if (username == "") {
      req.flash("error_msg", "Please provide your Username");
      return res.redirect("/secure/login");
    } else if (password == "") {
      req.flash("error_msg", "Enter Password to Continue");
      return res.redirect("/secure/login");
    }

    let email = "";

    email = username.includes("@") ? username : ""; // incase user chooses to login with email

    try {
      // ES6+  check if user exists in DB
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (!userExists) {
        req.flash("error_msg", "Please Create Account");
        res.redirect("/secure/login");
      }

      // Compare user password with Bcryptjs
      const isCorrectPassword = await bcrypt.compareSync(
        password,
        userExists.password
      );

      if (!isCorrectPassword) {
        req.flash("error_msg", "Wrong Credentials");
        res.redirect("/secure/login");
      }
      // Password and username are correct, authorize the user and redirect to Dashboard
      req.session.user = userExists;
      req.session.isAuthorized = true;

      res.redirect("/d/dashboard");
    } catch (error) {
      console.log(error);
    }
  },

  // Logout Handler

  logout: async (req, res) => {
    // Destroy the session
    req.session.destroy((err) => {
      if (err) {
        console.error(err);
      }
      res.redirect("/");
    });
  },
};
