const express = require("express");
const router = express.Router();

const {
  signUp,
  login,
  sendOTP,
  changePassword,
} = require("../controllers/Auth");

//Reset Password controllers
const {
  resetPassowrdToken,
  resetPassword,
} = require("../controllers/ResetPassword");

//Midleware
const { auth } = require("../middlewares/auth");

//==========Authentication Routers
router.post("/signup", signUp);
router.post("/login", login);
router.post("/sendotp", sendOTP);

router.post("/changepassword", auth, changePassword);

//=================Reset Password===================
router.post("/reset-password-token", resetPassowrdToken);

router.post("/reset-password", resetPassword);

//===================getAllStudents & gettAllInstructors===============
//============Access only Admin==============

module.exports = router;
