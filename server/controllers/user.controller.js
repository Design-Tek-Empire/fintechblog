const logger = require("../../logger");
const User = require("../models/UserModel");
const bcrypt = require("bcrypt");

module.exports = {

  viewAllUsers: async (req, res) => {
    try {
      const allUsers = await User.find({}).select("-password -updatedAt");
      res.status(200).json(allUsers)

    } catch (error) {
      logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },

  singleUser: async (req, res) => {
    try {
      const userProfile = await User.findById(req.params.id).select("-password");;
       if(userProfile){
         res.status(200).json(userProfile);
       }else{
        logger.info("No such user found")
         res.status(404).json("No such user found");
       }
    
    } catch (error) {
        logger.error(error);
      return res.status(500).json({ msg: "Internal Server Error" });
    }
  },
  editUser: async (req, res) => {
   try {
     // Check if the user is updating the password
     if (req.body.password) {
       const salt = await bcrypt.genSalt(10);
       req.body.password = await bcrypt.hash(req.body.password, salt);
     }

     // Update user information
     await User.findByIdAndUpdate(req.params.id, {
       $set: req.body,
     });
      
     // Send updated Profile
      res.status(200).json("Profile Edited Successfully")
   } catch (error) {
     logger.error("Error updating user:", error);
     res.status(500).send("Internal Server Error");
   }

  },


  deleteUser: async (req, res) => {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json({msg: "User Deleted Successfully"})
    } catch (error) {
      logger.error(error);
      res.status(500).send("Internal Server Error");
    }
  },
};
