const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");

//=========create RatingAndReview============
exports.createRating = async (req, res) => {
  try {
    //get user id
    const userId = req.user._id;
    //fetchData from body
    const { rating, review, courseId } = req.body;
    //check if user is enrolled or not
    const courseDetails = await Course.findById({
      _id: courseId,
      studentEnrolled: { $elemMatch: { $eq: userId } }, //check that user id present in enroled column or not
    });
    if (!courseDetails) {
      return res.status(400).json({
        message: "You are not enrolled in this course",
        success: false,
      });
    }
    //check if user already reviewed
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(400).json({
        message: "You already reviewed this course",
        success: false,
      });
    }
    //create rating the review
    const ratingAndReview = await RatingAndReview.create({
      user: userId,
      rating,
      review,
      course: courseId,
    });
    //update the course with this rating and reviwe
    const updatedCourseDetails = await Course.findByIdAndUpdateupdateOne({
      _id: courseId,
      $push: {
        ratingAndReview: ratingAndReview._id,
      },
    });
    console.log(updatedCourseDetails);
    //return response;
    return res.status(200).json({
      message: "Rating and review created successfully",
      success: true,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Rating and Review not created ",
      success: false,
    });
  }
};
