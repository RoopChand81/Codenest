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
