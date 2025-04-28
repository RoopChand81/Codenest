//send OTP after signup
const User=require("../models/User");
const OTP=require("../models/OTP");
const Profile=require("../models/Profile");
const crypto = require("crypto");//use for genrate otp
const bcrypt=require("bcrypt");//use for hash the password;
const jwt= require("jsonwebtoken");//for create token
const mailSender=require("../utils/mailSender");
const otpTemplate=require("../mail/templates/emailVerificationTemplate");
const cookie=require('jsonwebtoken');
const {passwordUpdated}=require("../mail/templates/passwordUpdate");
require('dotenv').config();

//==============send -OTP for Email Verification And create Account===========
exports.sendOTP=async(req,res)=>
{
     try{
            let {email,name}=req.body;
            name=name?name:"User";
            const checkUserPresent=await User.findOne({email});
            if(checkUserPresent)
            {
                  return res.status(401).json({
                        message:"User is Already Registered",
                        success:false
                  });
            }

            //generate OTP 
            function generateOTP() {
                  return crypto.randomInt(100000, 999999).toString(); // Secure 6-digit OTP
            }
            let otp=generateOTP();
            console.log("OTP genrated: ",otp);

            const template = otpTemplate(otp, name);
            await mailSender(email,'OTP Verification Email from CodeNest',template);


            //make enrty in DB with unique otp
            const otpPayload={email,otp};
            const otpBody=await OTP.create(otpPayload);//called OTP pre function and save otp in DB
            console.log("OTP entry created: ",otpBody);

            //return success msg as response
            res.status(200).json({
                  message:"OTP sent successfully",
                  success:true,
                  otp:otp
            });
            
     }catch(error){
            console.log(error);
            return res.status(401).json({
                  message:"Error while Genrating OTP",
                  success:false,
                  error:error.message


            });
     }     
}

//========SignUp=================
exports.signUp=async (req,res)=>{
      try{
            const {
                  firstName,
                  lastName,
                  email,
                  password,
                  confirmPassword,
                  accountType,
                  contactNumber,
                  otp
            }=req.body;
            //validation
            if(!firstName|| !lastName || !email || !password || ! confirmPassword || !otp)
            {
                  return res.status(401).json({
                        success:false,
                        message:"All fields are required",
                  })
            }
            //check  both password  is match or NOT;
            if(password!==confirmPassword)
            {
                  return res.status(400).json({
                        success:false,
                        message:"Password and ConfimPassword is not match"
                  });
            }

            //check user already registered 
            const existingUser = await User.findOne({email});

            if(existingUser)
            {
                  //if email already exist return back;
                  return res.status(400).json({
                        success:false,
                        message:"User is already registered,go to Login Page"
                  });
            }
            //fetch recent OTP crossponding this email from OTP table(DB)
            const recentOTP=await OTP.find({email}).sort({createdAt:-1}).limit(1);
            //.sort ({createdAt:-1}):
            //it's used to sort the result based on the createdAt field in descending order (-1 means descending order)
            //this way most recently created OTP will retunned first;
            //.limit(1): it limit the number of documents to 1

            console.log(recentOTP);
            //if OTP not found 
            if(!recentOTP || recentOTP.length==0)
            {
                  return res.status(400).json({
                        success:false,
                        message:"No OTP Exist in DataBase"

                  });
            }
            if(otp!==recentOTP[0].otp){
                  //enter otp and fetch recentotp  not match 
                  console.log(`questOTP: ${otp} \n DBOTP :${recentOTP}`);
                  return res.status(400).json({
                        success:false,
                        message:"Invalid OTP",
                  });
            }

            //Hsah- Secure the Password
            const hashedPassword = await bcrypt.hash(password, 10);

            //create a default profile for that particuler user and Store in DB
            const profileDetails=await Profile.create({
                  gender:null,
                  dateOfBirth:null,
                  about:null,
                  contactNumber:null,
            });
            //create a new user and store in DB;
            const user = await User.create({
                  firstName,
                  lastName,
                  email,
                  contactNumber,
                  password:hashedPassword,
                  accountType,
                  additionalDetails:profileDetails._id,
                  image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,//a default api create a name logo as image for profile image;
            })
            return res.status(200).json({
                  success:true,
                  message:"User Registered Successfully",
                  user:user
            })
      }catch(error){
            console.log(error);
            return res.status(500).json({
                  success:false,
                  message:"Account Not create Try Again !!",
            });
      }
}

//===============Login=================== 
exports.login=async (req,res)=>{
      try{
            const {email,password}=req.body;
            if(!email || !password)
            {
                  return res.status(401).json({
                        success:false,
                        message:"All field are required"
                  });
            }
            //check email exist or Not
            let user = await User.findOne({ email }).populate(
              "additionalDetails"
            ).exec();

            if(!user){
                  return res.status(401).json({
                        success:false,
                        message:"User are not registered with us"
                  });
            }

            //match given Password and saved Password from DB
            const match = await bcrypt.compare(password,user.password);
            if(!match){
                  return res.status(405).json({
                        success:false,
                        message:"Invalid Password (Password Not Match)"
                  });
            }
            
            
            const payload={
                  email:user.email,
                  id:user._id,
                  accountType:user.accountType,//this will help to check whether user have access to route while authorzation
            }
            //genrate token using jwt
            const token = jwt.sign(payload,process.env.JWT_SECRET,{
                  expiresIn:"24h"
            });

            user=user.toObject();
            user.token=token;//add token to user
            user.password=undefined;//remove the Password form Object ,not DB

            //create the cookies and send response
            const cookieOptions={
                  httpOnly:true,
                  expires:new Date(Date.now()+3*24*60*60*1000),//3 day valaid the cookies;
            }

            res.cookie("token",token,cookieOptions).status(200).json({
                  success:true,
                  message:"Login Successfull",
                  user,
                  token
            })

      }catch(error){
            console.log(error);
            return res.status(500).json({
                  success:false,
                  message:"Login Failure,please try again",
                  
            });
      }


}
//============Change the Password====================
exports.changePassword = async (req, res) => {
      try{
            //get Data from the req body
            const {oldPassword, newPassword, confirmPassword} = req.body;
            
            console.log("oldPass: ",oldPassword);
            console.log("newPass: ",newPassword);
            console.log("confirmPass: ",confirmPassword);
            //validation
            if(!oldPassword || !newPassword || !confirmPassword){
                  return res.status(400).json({
                        success:false,
                        message:"All fields are required"
                  });
            }
            if(newPassword !== confirmPassword){
                  return res.status(400).json({
                        success:false,
                        message:"Password and Confirm Password should be same "
                  });
            }
            //get User 
            const userDetails = await User.findById(req.user.id);

            //vaildate the old Password entered correct or not
            const isValidPassword = await bcrypt.compare(oldPassword, userDetails.password);

            //vaildate old Password
            if(!isValidPassword){
                  return res.status(400).json({
                        success:false,
                        message:"Old Password is Incorrect "
                  });
            }
            //hash the new password
            const hashedPassword = await bcrypt.hash(newPassword, 10);

            //update newPassword in DB
            const updateUserDeatails=await User.findByIdAndUpdate(
                  req.user.id,
                  {
                        password:hashedPassword,
                  },
                  {new:true}
            )

            //send the Mail to client 
            try{
                  const emailResponse=await mailSender(
                        updateUserDeatails.email,
                        "Password Changed Successfully",
                        //send a HTML template;
                        passwordUpdated(
                              updateUserDeatails.email,
                              `${updateUserDeatails.firstName} ${updateUserDeatails.lastName}`
                        )
                  );
                  return res.status(200).json({
                        success:true,
                        message:"Password Updated Successfully",
                        emailResponse
                  });
            }catch(error){
                 console.error("Error occured while sending email",error);
                 return res.status(500).json({
                        success:false,
                        message:"Error occured while sending email ",
                        error:error.message
                 }) 
            }   

      }catch(error){
            console.log('Error while changing Passowrd');
            return res.status(500).json({
                  success:false,
                  message:"Error while changing Password "
            });
      }

}