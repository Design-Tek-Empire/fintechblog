const User = require("../models/UserModel");
const bcrypt = require("bcrypt");
const { sendOTPemail } = require("../utils/otp-sender");
const OTPModel = require("../models/OTP-Record");
const { generateAccessToken } = require("../middlewares/authorisation")
const jwt = require("jsonwebtoken")

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

        // const { password: hashedPasswordFromUser, ...otherUserDetails } =
        //   user._doc;

        res.status(201).json({success: true, message: "Registration successful"});
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
      return res.status(401).json("Enter Password to Continue");
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
      // Generate Tokens

      req.session.user = userExists;
      req.session.isAuthorized = true;

      const accessToken = generateAccessToken(userExists, jwt);
      const {createdAt,updatedAt, password: hashedPassword, ...userDetails } = userExists._doc;
      res.send({
        accessToken,
        userDetails,
        success: true,
        msg: "Logged In",
      });

    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal server error" });
    }
  },
  // Request for password Rests
  forgotpassword: async (req, res) => {
    const { email } = req.body; // Extract email from body

    try {
      if (!email || email === "") throw new Error("Provide your email");
      if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email))
        throw new Error("Email is Invalid");

      // Check if the User Already Exists with the email
      const userExists = await User.findOne({ email });
      if (!userExists) throw new Error("Unknown credentials");
        
      //  Check if user has a valid OTP Previously to avaoid multiple requests
       const existingValidOTP = await OTPModel.findOne({userId: userExists.id, expiresAt: {$gte: Date.now() }})
         
      if(existingValidOTP) throw new Error("Your previous OTP is still Valid, Use it")

      // User Exists process OTP Token and send to User's Email
       sendOTPemail(userExists, OTPModel, res); 

    } catch (err) {
      logger.error(err);
      res.status(422).json({ err: err.message });
    }
  },
  verifyotp: async (req, res) => {
     
     try {
       let { userId, otp } = req.body;
       otp = otp.trim();

       // validate input.

       if (!otp) {
         return res.status(422).json({ err: "Please provide OTP to proceed" });
       } else if (!userId) {
         return res.status(401).json({ err: "Your account is not found " });
       } else {
         // verify the user
         const userOTPrecords = await OTPModel.find({ userId });

         if (userOTPrecords.length <= 0) {
           throw new Error("Account is Invalid or Already Verified");
         } else {
           // check expiry of OTP
           const { expiresAt, hashedOTP } = userOTPrecords[0];

           if (expiresAt < Date.now()) {
             // Delete the OTP record if it has expired
             await OTPModel.deleteOne({ userId });
             throw new Error("OTP has Expired, Please request a new OTP");
           } else {
             //OTP is Valid,
             // compare OTP with hashed OTP

             const isOTPCorrect = await bcrypt.compare(otp, hashedOTP); // this returns a boolan

             if (!isOTPCorrect) {
               throw new Error("OTP is Incorrect");
             } else {
               // OTP is Correct proceed to set new password
               res.status(201).json({ msg: "OTP Verified, Set new password" });

             }
           }
         }
       }
     } catch (err) {
       logger.error(err);
       res.status(422).json({ err: err.message });
     }

  },
  
   resetpassword: async( req, res )=>{
     const { id } = req.params;
     const { password, password2 } = req.body;

     try {
       // Find user by ID
       const user = await User.findById(id);
       if (!user) {
         return res.status(404).json({ error: "User not found" });
       }

       // Check OTP record
       const userOTPrecord = await OTPModel.findOne({ userId: id });
       if (!userOTPrecord) {
         return res.status(403).json({ error: "Unauthorized Action" });
       }

       // Validate passwords
       if (!password || !password2) {
         throw new Error("Please enter your password to continue");
       } else if (password !== password2) {
         throw new Error("Passwords don't match");
       } else if (password.length < 6) {
         throw new Error("Password must be at least 6 characters long");
       }

       // Hash the password
       const hashedPassword = await bcrypt.hash(password, 10);

       // Update user's password
       await user.updateOne({ password: hashedPassword });

       //  Delete OTP Record from DB
       await userOTPrecord.deleteOne({ userId: id });

       // Send success response
       res.status(201).json({ message: "Password reset successful" });
     } catch (error) {
       // Log the error
       logger.error(error);

       // Send error response
       res.status(500).json({ error: error.message });
     }
   } ,
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
