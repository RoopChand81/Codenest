const Section=require("../models/Section");
const Course=require("../models/Course");
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

    // ✅ Ensure courseId is a string before passing it to Mongoose
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
      { _id: validCourseId},
      {
        $push: {
          courseContent: newSection._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection", // ✅ This assumes each section has a 'subSection' field
        },
      })
      .exec();
  
    //return response
    return res.status(201).json({
      message: "Course Section created successfully",
      success: true,
      updatedCourseDetails,
    });
  } catch (error) {
    
    return res.status(500).json({
      message: "Unable to create the Section Try Again ",
      success: false,
    });
  }
}; 

exports.updateSection = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    // Validation
    if (!sectionName || !sectionId || !courseId) {
      console.log("Missing data:", { sectionName, sectionId, courseId });
      return res.status(400).json({
        message: "Please fill all fields",
        success: false,
      });
    }

    // Update section
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Fetch updated course details
    // ✅ Ensure `courseId` is a string before passing it to Mongoose
    const validCourseId = typeof courseId === "object" ? courseId.courseId : courseId;
                
      if (!mongoose.Types.ObjectId.isValid(validCourseId)) {
        return res.status(400).json({ success: false, message: "Invalid Course ID format" });
      }
    
      //find course Details
      const courseDetails=await Course.findById(
        {_id:validCourseId}
      )
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Response
    return res.status(200).json({
      message: "Section updated successfully",
      success: true,
      updatedCourse: courseDetails,
    });
  } catch (error) {
    //console.error("UPDATE SECTION ERROR:", error);
    return res.status(500).json({
      message: "Unable to update the section. Try again.",
      success: false,
    });
  }
};



exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    // Validate input
    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Section ID and Course ID are required",
      });
    }

    // Delete the section
    await Section.findByIdAndDelete(sectionId);

    // Pull sectionId from courseContent array of Course
    await Course.findByIdAndUpdate(
      courseId,
      { $pull: { courseContent: sectionId } },
      { new: true }
    );

    // Get the updated course with populated content
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "SubSection" },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      updatedCourse,
    });

  } catch (error) {
    console.error("Error deleting section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
