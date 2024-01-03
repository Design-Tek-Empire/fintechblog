const nodemailer = require("nodemailer");

// Email Transporter
 const transporter = nodemailer.createTransport({
   service: "gmail",
   secure: true,
   auth: {
     user: process.env.user_email,
     pass: process.env.user_pass,
   },
 });


 module.exports = transporter




