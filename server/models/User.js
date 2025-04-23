const mongoose =require("mongoose");
//4 fields not persent hai abhi is time pe
const userSchema = new mongoose.Schema({
      firstName:{
            type:String,
            required:true,
            trim:true,
      },
      lastName:{
            type:String,
            required:true,
            trim:true,
      },
      email:{
            type:String,
            required:true,
            trim:true,
      },
      password:{
            type:String,
            required:true,
      },
      accountType:{
            type:String,
            enum:["Admin","Student","Instructor"],
            required:true,
      },
      additionalDetails:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:"Profile",
      },
      courses:[
            {
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"Course",
            }
      ],
      image:{
            //user Profile Image upload here;
            type:String,
            required:true,
      },
      token:{
            //Reset Password token 
            type:String,
      },
      resetPasswordExpires:{
            type:Date,
      },
      courseProgress:[
            {
                  type:mongoose.Schema.Types.ObjectId,
                  ref:"CourseProgress",
            }
      ]
});

module.exports = mongoose.model("User",userSchema);