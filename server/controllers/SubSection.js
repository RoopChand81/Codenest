const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();
const mongoose = require("mongoose");

//===========Create Sub Section==============
exports.createSubSection = async (req, res) => {
  try {
    const { sectionId, title, description, timeDuration } = req.body;
    //extract file/video
    const video = req.files.videoFile;

    //validation
    if (!sectionId || !title || !description || !timeDuration || !video) {
      return res.status(400).json({
        message: "Please fill all the fields",
        success: false,
      });
    }
    //upload video on cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME_VIDEO
    );
    //create sub section
    const subSectionDetails = await SubSection.create({
      title: title,
      description: description,
      timeDuration: timeDuration,
      videoUrl: uploadDetails.secure_url,
    });

    //check id is object type
    if (!mongoose.Types.ObjectId.isValid(sectionId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid Section ID format" });
    }

    //update section
    const updatedSection = await Section.findByIdAndUpdate(
      sectionId,
      {
        $push: {
          SubSection: subSectionDetails._id,
        },
      },
      { new: true }
    );
    //Hm:log update section here after adding populating query
    //return response
    return res.status(201).json({
      message: "Sub Section created successfully",
      success: true,
      updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error creting the SubSection",
      success: false,
    });
  }
};

//Hm:udate subSection

//Hm:delete the SubSection
