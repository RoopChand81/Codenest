const { response } = require("express");
const Profile=require("../models/Profile");
const User=require("../models/User");
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const CourseProgress = require("../models/CourseProgress");
const Course = require("../models/Course");
//import the env

require('dotenv').config();


exports.updateProfile=async (req,res)=>{
      try{
            //get Data
            const {dateOfBirth="",about="",contactNumber="",gender="",firstName="",lastName=""}=req.body;
            console.log("Profile Update Data",req.body);

            //login userID
            const id=req.user?.id;
            if (!id) {
                  return res.status(401).json({ success: false, message: "Unauthorized" });
            }
            
            //find user details
            const userUpdatedDetails = await User.findByIdAndUpdate(
              id,
              {
                firstName,
                lastName,
              },
              { new: true }
            );
            
            if (!userUpdatedDetails) {
                  return res.status(404).json({ success: false, message: "User not found" });
            }
            //take  profiel id
            const profileId=userUpdatedDetails.additionalDetails;
            if (!profileId) {
                  return res.status(404).json({ success: false, message: "Profile not found" });
            }
            //update user Profile
            const updatedProfile = await Profile.findByIdAndUpdate(
                  profileId,
                  { dateOfBirth, about, contactNumber, gender },
                  { new: true }
            );

            if (!updatedProfile) {
                  return res.status(400).json({ success: false, message: "Profile update failed" });
            }
            //updated user detailes return;
            const user= await User.findById(id).populate("additionalDetails").exec();
            //return response
            res.json({
                  message:"Profile Updated Successfully",
                  user,
                  success:true

            });
      }catch(error){
            console.log(error);
            res.status(500).json({
                  message:"Error updating profile",
                  success:false
            });
      }
}

//upDate the Profile Photo
exports.updateDisplayPicture = async (req, res) => {
      try {
            const displayPicture = req.files.displayPicture
            const userId = req.user.id
            const image = await uploadImageToCloudinary(
                  displayPicture,
                  process.env.FOLDER_NAME,
                  1000,
                  1000
            )
            console.log(image)
            const updatedProfile = await User.findByIdAndUpdate(
                  { _id: userId },
                  { image: image.secure_url },
                  { new: true }
            )
            return res.status(200).json({
                  success: true,
                  message: `Image Updated successfully`,
                  user: updatedProfile,
            })
      } catch (error) {
            return res.status(500).json({
            success: false,
            message: error.message,
            })
      }
}

//delete Account 
//how to delete Account with schedule time;
exports.deleteAccount=async (req,res)=>{
      try{
            //get id
            const id=req.user.id;
            //check vaild id or not
            const userDetails=await User.findById(id);
            console.log(userDetails);
            if(!userDetails){
                  return res.status(404).json({
                        message:"User not found",
                        success:false
                  });
            }
            //delete profile
            await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});//find profile id using user schema;
            //HM : delete that student from that Courses which it taken;
            //delete user
            await User.findByIdAndDelete({_id:id});
            
            //return response
            return res.status(200).json({
                  message:"Account deleted successfully",
                  success:true
            });

      }catch(error){
            console.log(error);
            res.status(500).json({
                  message:"Error deleting account",
                  success:false,
                  
            })
            
      }
}

//fetch user Details;

exports.getUserDetails=async(req,res)=>{
      try{
            //get all details of a user
            const id=req.user.id;
            const userDetails=await User.findById(id).populate("additionalDetails").exec();//populate a column value which hold id of a other object;
            if(!userDetails){
                  return res.status(404).json({
                        message:"User not found",
                        success:false
                  });
            }
            //return response
            return res.status(200).json({
                  message:"User details fetched successfully",
                  userDetails:userDetails,
                  success:true
            });
      }catch(error){
            console.log(error);
            res.status(500).json({
                  message:"Error getting user details",
                  success:false
            });
      }

}

exports.getEnrolledCourses=async(req,res)=>{
      try{
            //get all enrolled courses of a user
            const id=req.user.id;
            const enrolledCourses=await User.findById(id)
            .populate({
                  path:"courses",
                  populate:{
                        path:"courseContent",
                  },
            }).exec();
            console.log("serverSide check courese",enrolledCourses);
            if(!enrolledCourses){
                  return res.status(404).json({
                        message:"No courses enrolled",
                        success:false
                  });
            }
            const progress=await CourseProgress.find({userID:id}).exec();    
            //return response
            return res.status(200).json({
                  message:"get Enrolled Courses successfully",
                  enrolledCourses:enrolledCourses,
                  progress:progress,
                  success:true
            });
      }catch(error){
            console.log(error);
            return res.status(500).json({
                  message:"Error getting enrolled courses",
                  success:false,
                  data:error
            });
      }
}

exports.instructorDashboard=async(req,res)=>{
      try{
            const courseDetails=await Course.find({instructor:req.user.id});
            const courseData =courseDetails.map((course)=>{
                  const totalStudentsEnrolled=course.studentsEnrolled.length;
                  const totalAmountGenerated=totalStudentsEnrolled*course.price;
                  //create an new object with addtional fields
                  const courseDataWithStats={
                        _id:course._id,
                        courseName:course.courseName,
                        courseDescription:course.courseDescription,
                        totalAmountGenerated,
                        totalStudentsEnrolled,
                  }
                  return courseDataWithStats;
            })
            return res.status(200).json({
                  message:"Data fetch suceessfull",
                  suceess:true,
                  courses:courseData
            })
      }catch(error){
            console.log(error);
            return res.status(400).json({
                  message:"Instructor Dasboard Data Not fetch",
                  success:false,
            })
      }
}


