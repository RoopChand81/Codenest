//reset the password when old Password forget
const User = require("../models/User");
const mailSender = require("../utils/mailSender"); //for sending mail
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const resetPasswordTemplate = require("../mail/templates/resetPasswordTemplate");

//reset Password Token
exports.resetPassowrdToken = async (req, res) => {
  try {
    //get email from req body
    const { email } = req.body;

    //check user for this email,email vaildiation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not Register",
      });
    }

    //generate token
    const token = crypto.randomUUID();

    //save token in user and expiry time
    const updateddetails = await User.findOneAndUpdate(
      { email: email }, //find base on this email
      {
        token: token, //update these
        resetPasswordExpires: Date.now() + 5 * 60 * 1000, //update and expire within 5 minute
      },
      { new: true } //return updated details
    );

    const resetLink = `http://localhost:3000/update-password/${token}`;
    const emailBody = resetPasswordTemplate("John", resetLink);
    await mailSender(email, "Reset Your Password", emailBody);

    return res.status(200).json({
      success: true,
      message: "Password reset link sent to your email",
      updateddetails,
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sendig reset link",
    });
  }
};


