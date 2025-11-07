const mongoose=require("mongoose");
const mailSender = require("../utils/mailSender");

const OTPSchema =new mongoose.Schema({
      email:{
            type:String,
            required:true,
      },
      otp:{
            type:String,
            required:true,
      },
      createdAt:{
            type:Date,
            default:Date.now,//set defualt value of that column with current time;
            expaires:3*60,//Automatically deletes the document after 5 minutes
      }
});

module.exports=mongoose.model("OTP",OTPSchema);
