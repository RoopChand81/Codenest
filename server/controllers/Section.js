const Section = require("../models/Section");
const Course = require("../models/Course");
const mongoose = require("mongoose");

exports.createSection = async (req, res) => {
  try {
    const { sectionName, courseId } = req.body;
    //validation
    if (!sectionName || !courseId) {
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    // ✅ Ensure `courseId` is a string before passing it to Mongoose
    const validCourseId =
      typeof courseId === "object" ? courseId.courseId : courseId;

    if (!mongoose.Types.ObjectId.isValid(validCourseId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Course ID format" });
    }

    //create a section
    const newSection = await Section.create({ sectionName });
    //update the course with section ObjectID;
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    );
    //HW :use populate to replace sections both in the updated/CourseDetails
    //return response
    res.status(201).json({
      message: "Course Section created successfully",
      success: true,
      updatedCourseDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Unable to create the Section Try Again ",
      success: false,
    });
  }
};
