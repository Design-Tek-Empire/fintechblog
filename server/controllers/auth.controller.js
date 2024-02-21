const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const logger = require("../../logger")

// Hangle Registration
module.exports = {
  // Registration Handler Function
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;

      // Validate inputes
      if (!username || !email || !password) {
        throw new Error("Form inputes are required");
      }

      if (username == "") {
        throw new Error("Pls Enter Your username");
      } else if (email == "") {
        throw new Error("Pls Enter Your Email");
      } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        throw new Error("Email is Invalid");
      } else if (password == "") {
        throw new Error("Provide Password");
      } else if (password.length < 6) {
        throw new Error("Password should be at least 6 Characters");
      }

      // Check if the User Already Exists with either his email or username
      const userExists = await User.findOne({
        $or: [{ email: email }, { username: username }],
      });

      if (userExists) {
        return res.status(401).json({ msg: "You can't use this credentials" });
      } else {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
          username,
          email,
          password: hashedPassword,
        });

        const { password: hashedPasswordFromUser, ...otherUserDetails } =
          user._doc;

        res.status(201).json(otherUserDetails);
      }
    } catch (error) {
      logger.error(error);
      return res.status(422).json({ error: error.message });
    }
  },

  // Login Handler

  login: async (req, res) => {

   
     //  A user can login with a combination either username or Email and password
     let { username, password } = req.body;

    if (!username && !password) {
      return res.status(401).json("Inputs empty");
    } else if (username == "") {
      return res.status(401).json("Provide a Username");
    } else if (password == "") {
      return res.status(401).json("Enter Password to Continue" );
    }

    let email = "";

    email = username.includes("@") ? username : ""; // incase user chooses to login with email

    try {
      // check if user exists in DB
      const userExists = await User.findOne({ $or: [{ email }, { username }] });
      if (!userExists) {
        return res.status(403).json({ msg: "Please Create an account" });
      }

      // Compare user password with Bcryptjs
      const isCorrectPassword = await bcrypt.compareSync(
        password,
        userExists.password
      );

      if (!isCorrectPassword) {
        return res.status(401).json({ msg: "Username or password Incorrect" });
      }
      // Password and username are correct, authorize the user and redirect to Dashboard
      req.session.user = userExists;
      req.session.isAuthorized = true;
      const { password: hashedPassword, ...others } = userExists._doc;
      res.status(200).json(others);
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },

  // Logout Handler

  logout: async (req, res) => {
    try {
      // Destroy the session
      req.session.destroy((err) => {
        if (err) {
          logger.error(err);
        }
        res.status(200).json({ msg: "Logged Out" });
      });
    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
};
