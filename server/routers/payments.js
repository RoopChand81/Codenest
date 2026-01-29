// const express =require('express');
// const router = express.Router();

// const {capturePayment,verifyPayment,sendPaymentSuccessEmail}=require('../controllers/Payment');
// const {auth,isStudent}=require('../middlewares/auth');

// router.post('/capturePayment',auth,isStudent,capturePayment);
// router.post('/verifyPayment',auth,isStudent,verifyPayment);
// router.post("/sendPaymentSuccessEmail",auth,isStudent,sendPaymentSuccessEmail);

// module.exports=router
const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");

const {
  capturePayment,
  razorpayWebhook,
} = require("../controllers/Payment");

const { auth,isStudent } = require("../middlewares/auth");

// frontend
router.post("/capturePayment", auth, isStudent, capturePayment);

// razorpay server
router.post(
  "/webhook",
  razorpayWebhook
);



module.exports = router;
