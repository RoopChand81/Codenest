const Course=require("../models/Course");
const User=require("../models/User");
const Category=require("../models/Category");
const SubSection=require("../models/SubSection");
const Section = require("../models/Section");
const CourseProgress=require("../models/CourseProgress")
const {uploadImageToCloudinary}=require("../utils/imageUploader");
const mongoose=require("mongoose");
//const {convertSecondsToDuration}=require("../utils/secToDuration");

//==============Create New Course=============
exports.createCourse = async (req, res) => {
  try {
      const {
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag,
            status,
            instruction, // make sure frontend sends this as `instruction`
            category, // handle `category` field from FormData
      } = req.body;

      const thumbnail = req.files?.thumbnailImage;
      //console.log(status);

      // Validate required fields
      if (
            !courseName ||
            !courseDescription ||
            !whatYouWillLearn ||
            !price ||
            !category ||
            !thumbnail ||
            !tag
      ) {
            return res.status(400).json({
            message: "Please fill all fields",
            success: false,
            });
      }

      // Check instructor
      const userId = req.user.id;
      const instructorDetails = await User.findById(userId);
      if (!instructorDetails) {
            return res.status(400).json({
              message: "You are not an instructor",
              success: false,
            });
      }

      // Check category
      const categoryDetails = await Category.findById(category);
      if (!categoryDetails) {
            return res.status(400).json({
            message: "Invalid Category ID",
            success: false,
            });
      }

      // Upload thumbnail to Cloudinary
      const uploadedThumbnail = await uploadImageToCloudinary(
            thumbnail,
            process.env.FOLDER_NAME
      );

      // Create Course
      const newCourse = await Course.create({
            courseName,
            courseDescription,
            whatYouWillLearn,
            price,
            tag: JSON.parse(tag),
            instruction, // stringified in formData
            status, // should be "Draft" or "Published"
            thumbnail: uploadedThumbnail.secure_url,
            instructor: instructorDetails._id,
            category: categoryDetails._id,
            courseContent: [],
            studentsEnrolled: [],
            ratingAndReviews: [],
      });

      // Update instructor's course list
      await User.findByIdAndUpdate(
            userId,
            { $push: { courses: newCourse._id } },
            { new: true }
      );

      // Update category's course list
      await Category.findByIdAndUpdate(
            category,
            { $push: { courses: newCourse._id } },
            { new: true }
      );

      return res.status(201).json({
            message: "Course Created Successfully",
            success: true,
            course: newCourse,
      });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error occurred while creating course",
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
                        populate:{
                              path:"SubSection",
                        },
                  })
                  .populate({
                        path:"ratingAndReviews",
                        populate:{
                          path:"user",
                        }
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

exports.editCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    const updates = req.body;
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ error: "Course not found" });
    }

    // If Thumbnail Image is found, update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in the request body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//=========================extra add Course controllers============
exports.getFullCourseDetails = async (req, res) => {
  try {
    const  courseId  = req.query.courseId;
    console.log("controler all Data",req.query.courseId);
    const userId = req.user.id;
    console.log("courseId:-",courseId);
    //check the course present or Not
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "SubSection",
        },
      })
      .exec();

    const courseProgressCount = await CourseProgress.findOne({
      userID: new mongoose.Types.ObjectId(userId),
      courseID: new mongoose.Types.ObjectId(courseId),
    })
      .populate("completedVideos")
      .exec();
      
    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

//     let totalDurationInSeconds = 0;
//     courseDetails.courseContent.forEach((content) => {
//       content.SubSection.forEach((subSection) => {
//         const timeDurationInSeconds = parseInt(subSection.timeDuration);
//         totalDurationInSeconds += timeDurationInSeconds;
//       });
//     });

//     const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        //totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};



exports.getFullCourseDetailsForInstructor = async (req, res) => {
  try {
    const courseId = req.query.courseId;

    const userId = req.user.id;

    const course = await Course.findById({
      _id: courseId,
    })
      .select(
        "_id courseName courseDescription whatYouWillLearn price thumbnail category courseContent tag instruction"
      ) // only required fields
      .populate("category", "name") // only category name
      .populate({
        path: "courseContent",
        select: "sectionName SubSection", // only section name and subsections
        populate: {
          path: "SubSection",
          select: "title", // only subsection name (title)
        },
      })
      .lean(); // convert mongoose object to plain JS object

    if (!course) {
      return res.status(404).json({
        success: false,
        message: `Course not found with id: ${courseId}`,
      });
    }
    // Prepare simplified response
    // Prepare simplified course response
    const simplifiedCourse = {
      _id:course._id,
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      whatYouWillLearn: course.whatYouWillLearn || "",
      price: course.price || 0,
      thumbnail: course.thumbnail || "",
      category: course.category?.name || "No Category",
      tag: course.tag || [],
      instruction: course.instruction || [],
      courseContent:
        course.courseContent?.map((section) => ({
          sectionName: section.sectionName,
          SubSection: section.SubSection?.map((sub) => sub.title) || [],
        })) || [],
    };

    return res.status(200).json({
      success: true,
      data: simplifiedCourse,
    });
  }catch (error) {
    console.error("Error fetching simple course details:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Get a list of Course for a given Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // Get the instructor ID from the authenticated user or request body
    const instructorId = req.user.id;

    // Find all courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    }).sort({ createdAt: -1 });

    // Return the instructor's courses
    res.status(200).json({
      success: true,
      data: instructorCourses,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve instructor courses",
      error: error.message,
    });
  }
};
// Delete the Course


exports.deleteCourse = async (req, res) => {
  try {
    let { courseId } = req.body;

    console.log("courseId type:", typeof courseId);

    // ✅ Convert to ObjectId if it’s a string
    if (typeof courseId === "string") {
      if (!mongoose.Types.ObjectId.isValid(courseId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid courseId format",
        });
      }
      courseId = new mongoose.Types.ObjectId(courseId);
    }

    // ✅ Find the course by ID
    const course = await Course.findById(courseId);
    if (!course) {
      return res
        .status(404)
        .json({ success: false, message: "Course not found" });
    }

    // ✅ Unenroll students
    const studentsEnrolled = course.studentsEnrolled || [];
    for (const studentId of studentsEnrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: course._id },
      });
    }

    // ✅ Delete sections and sub-sections
    const courseSections = course.courseContent || [];
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        for (const subSectionId of section.SubSection || []) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      await Section.findByIdAndDelete(sectionId);
    }

    // ✅ Remove from instructor
    const instructorId = course.instructor;
    if (instructorId) {
      await User.findByIdAndUpdate(instructorId, {
        $pull: { courses: course._id },
      });
    }

    // ✅ Delete the course itself
    await Course.findByIdAndDelete(course._id);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};










