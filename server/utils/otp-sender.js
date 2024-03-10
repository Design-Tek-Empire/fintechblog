const bcrypt = require("bcrypt")
const { otpEmailTemplate } =  require("../utils/emailTemplates")
const transporter = require("../utils/emailing")

module.exports = {
  // Send OTP Email and Save New OTP in Database
  sendOTPemail: async (user, OTPModel, res) => {
    try {
      // destruction userId and user email from sentOTPemail Function

      // Generate 4 Distinct OTP Code
      const otp = JSON.stringify(Math.floor(1000 + Math.random() * 9000));

      // email sending options
      const mailOptions = {
        from: '"OTP Verification"<support@cheapay.com.ng>',
        to: user.email,
        subject: "Verify Your Email",
        html: otpEmailTemplate(otp, "15 Minutes"),
      };

      //  hash otp and send to user email
      const hashedOTP = await bcrypt.hash(otp, 10);

      await OTPModel.create({
        userId: user.id,
        hashedOTP,
        createdAt: Date.now(),
        expiresAt: Date.now() + 900000, // Expire in 15 minutes (Add 900,000 Milliseconds to the current Timestamp)
      });

      await transporter.sendMail(mailOptions);
      res.status(200).json({ msg: "Check Your Email for OTP Code" });

    } catch (err) {
      logger.fatal(err);
      res.status(500).json({ err: "Internal Server Error" });
    }
  },
};