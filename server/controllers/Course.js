const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const mongoose = require("mongoose");
//const {convertSecondsToDuration}=require("../utils/secToDuration");

//==============Create New Course=============
exports.createCourse = async (req, res) => {
  try {
    const {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      CategoryId,
      tag,
    } = req.body;
    //get thumbnail
    const thumbnail = req.files.thumbnailImage;

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !CategoryId ||
      !thumbnail
    ) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    //check for instructor
    const userId = req.user.id;
    const instructorDetails = await User.findById(userId);
    console.log(instructorDetails);

    //validation instructor
    if (!instructorDetails) {
      return res.status(400).json({
        message: "You are not an instructor",
        success: false,
      });
    }

    //validation Category
    const categoryDetails = await Category.findById(CategoryId);

    if (!categoryDetails) {
      return res.status(400).json({
        message: "Invalid tag",
        success: false,
      });
    }

    //Upload Thumbnail to Cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create an entry for new Course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      thumbnailImage,
      tag,
      instructor: instructorDetails._id,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    //add the new Course in user Details
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //Add the new course to the Categories
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );
    //return response
    return res.status(201).json({
      message: "Course Created Successfully",
      success: true,
      course: newCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Error Occured While Creating Course",
      success: false,
    });
  }
};

//==================show all Courses=================
exports.getAllCourses=async(req,res)=>{
      try{
            const allCourses=await Course.find({}).populate("instructor").exec();

            return res.status(200).json({
                  message:"All Courses Retrieved Successfully",
                  success:true,
                  data:allCourses
            });

      }catch(error){
            return res.status(400).json({
                  message:"Error While Fetching All Courses",
                  success:false
            });
      }
}


//=====================get Course Details================
exports.getCourseDetails=async(req,res)=>{
      try{
            const {courseId}=req.body;

            // ✅ Ensure `courseId` is a string before passing it to Mongoose
            const validCourseId = typeof courseId === "object" ? courseId.courseId : courseId;
            
            if (!mongoose.Types.ObjectId.isValid(validCourseId)) {
                  return res.status(400).json({ success: false, message: "Invalid Course ID format" });
            }

            //find course Details
            const courseDetails=await Course.findById(
                  {_id:validCourseId}
            )
                  .populate(
                        {
                              path:"instructor",
                              populate:{
                                    path:"additionalDetails",
                              },
                        }
                  )
                  .populate("category")
                  //.populate("ratingAndreviews")
                  .populate({
                        path:"courseContent",
                        // populate:{
                        //       path:"subSection",
                        // },
                  })
                  .exec();
            if(!courseDetails){
                  return res.status(404).json({
                        message:`Could not found the course with ${courseId}`,
                        success:false
                  });
            }
            //return response
            return res.status(200).json({
                  message:"Course Details Retrieved Successfully",
                  success:true,
                  data:courseDetails
            })
      }catch(error){
            return res.status(400).json({
                  //message:"Error While Fetching Course Details",
                  success:false,
                  error

            });
      }
}
