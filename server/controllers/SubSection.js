// Import necessary modules
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

// Create a new sub-section for a given section
exports.createSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { sectionId, title, description, courseId } = req.body;
    const video = req.files.videoFile;

    // Check if all necessary fields are provided
    if (!sectionId || !title || !description || !video || !courseId) {
      return res
        .status(404)
        .json({ success: false, message: "All Fields are Required" });
    }

    const ifsection = await Section.findById(sectionId);
    if (!ifsection) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }

    // Upload the video file to Cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_VIDEO
    );

    console.log(uploadDetails);
    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.create({
      title: title,
      // timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // Update the corresponding section with the newly created sub-section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { SubSection: SubSectionDetails._id } },
      { new: true }
    ).populate("SubSection");

    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "SubSection" } })
      .exec();
    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

// UPDATE a sub-section
exports.updateSubSection = async (req, res) => {
  try {
    // Extract necessary information from the request body
    const { SubsectionId, title, description, courseId } = req.body;
    const video = req?.files?.videoFile;

    let uploadDetails = null;
    // Upload the video file to Cloudinary
    if (video) {
      uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_VIDEO
      );
    }

    // Create a new sub-section with the necessary information
    const SubSectionDetails = await SubSection.findByIdAndUpdate(
      { _id: SubsectionId },
      {
        title: title || SubSection.title,
        // timeDuration: timeDuration,
        description: description || SubSection.description,
        videoUrl: uploadDetails?.secure_url || SubSection.videoUrl,
      },
      { new: true }
    );

    const updatedCourse = await Course.findById(courseId)
      .populate({ path: "courseContent", populate: { path: "SubSection" } })
      .exec();
    // Return the updated section in the response
    return res.status(200).json({ success: true, data: updatedCourse });
  } catch (error) {
    // Handle any errors that may occur during the process
    console.error("Error creating new sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId, courseId } = req.body;

    // Validation
    if (!subSectionId || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Check if sub-section and section exist
    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "Sub-section not found",
      });
    }

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Delete sub-section
    await SubSection.findByIdAndDelete(subSectionId);

    // Pull sub-section ID from section's subSection array
    await Section.findByIdAndUpdate(
      sectionId,
      { $pull: { subSection: subSectionId } }, // ✅ lowercase field name (check your schema)
      { new: true }
    );

    // Get updated course content
    const updatedCourse = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "Sub-section deleted successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error("Error deleting sub-section:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
