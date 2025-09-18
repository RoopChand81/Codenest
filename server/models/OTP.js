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

//To send  otp on email when call the otp.create or otp.save
//Automatically sends an OTP email when a new OTP document is created.
// async function sendVerificationEmail(email,otp) {
//       try{
//             //This function call the mailSender function 
//             const mailResponse=await mailSender(
//                   email,//user mailAddress
//                   "Verification Email from Codenest",
//                   otp
//             );
//             console.log("Email sent Successfully :",mailResponse);
//       }catch(error){
//             console.log("error occured while sendig mails",error);
//             throw error;
//       }
// }
// //before saving the document send a mail ;
// OTPSchema.pre("save",async function (next){
//       await sendVerificationEmail(this.email,this.otp);
//       next();
// })


module.exports=mongoose.model("OTP",OTPSchema);

/*
      pre a mongoose hook .
      pre("save") → A Mongoose middleware that runs before saving the document.
      Triggers sendVerificationEmail when an OTP document is created
      Sends an OTP email before saving the OTP document.
      this.email and this.otp refer to the current document’s values.
      next() tells Mongoose to continue saving the document after sending the email.

*/

//Otp user ko chala jayega then uske baad DB me Save ho jayega;