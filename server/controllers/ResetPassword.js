//reset the password when old Password forget
const User=require ("../models/User");
const mailSender=require("../utils/mailSender");//for sending mail
const bcrypt = require('bcrypt');
const crypto=require("crypto");
const resetPasswordTemplate = require("../mail/templates/resetPasswordTemplate");

//reset Password Token
exports.resetPassowrdToken=async(req,res)=>{
      try {
            //get email from req body
            const {email}=req.body;

            //check user for this email,email vaildiation
            const user=await User.findOne({email});
            if(!user)
            {
                  return res.status(400).json({
                        success:false,
                        message:"Email not Register"
                  });
            }

            //generate token
            const token= crypto.randomUUID();
            

            //save token in user and expiry time
            const updateddetails=await User.findOneAndUpdate(
                  {email:email},//find base on this email
                  {
                        token:token,//update these 
                        resetPasswordExpires:Date.now()+5*60*1000,//update and expire within 5 minute
                  },
                  {new:true}//return updated details
            );

            const name=user.firstName+" "+user.lastName;
            const resetLink = `https://codenest-edtech.netlify.app/update-password/${token}`;
            const emailBody = resetPasswordTemplate(name, resetLink);//html Reset password template
            await mailSender(
              email,
              "Reset Your Password",
              emailBody
            );

            return res.status(200).json({
                  success:true,
                  message:"Password reset link sent to your email",
                  updateddetails,
                  user
            });

      }catch(error){
            return res.status(500).json({
                  success:false,
                  message:"Something went wrong while sendig reset link"
            });
      }
}

//reset Password with new Password 
exports.resetPassword=async(req,res)=>{
      try {
            //fetch the data
            const {token,password,confirmPassword}=req.body;

            //check if token is valid
            if(password!==confirmPassword){
                  return res.status(400).json({
                        success:false,
                        message:"Password and Confirm Password does not match"
                  });
            }
            //find user details from DB using token
            const userDetails =await User.findOne({token:token});
            //check if user exists
            if(!userDetails){
                  return res.status(400).json({
                        success:false,
                        message:"Invalid token"
                  });
            }
            if(userDetails.resetPasswordExpires<Date.now())
            {
                  return res.status(400).json({
                        success:false,
                        message:"Password reset link has expired"
                  });
            }
            //hash the Password
            const hashedPassword =await bcrypt.hash(password,10);
            //update the user details with new password
            await User.findOneAndUpdate(
                  {token:token},
                  {password:hashedPassword},
                  {new:true },
            )
            //send response
            return res.status(200).json({
                  success:true,
                  message:"Password has been reset successfully"
            });    
      }catch(error){
            console.log(error);
            return res.status(500).json({
                  success:false,
                  message:"Somthing error Try Again"
            });
      }
}
