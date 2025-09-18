//connect(Initiate) the node js server to razoropay server 
const Razorpay=require("razorpay");
require('dotenv').config();

exports.instance=new Razorpay({
      key_id:process.env.RAZORPAY_KEY,
      key_secret:process.env.RAZORPAY_SECRET
});