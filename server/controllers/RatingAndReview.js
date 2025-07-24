const RatingAndReview=require("../models/RatingAndReview");
const Course=require("../models/Course");
const { default: mongoose } = require("mongoose");

//=========create RatingAndReview============
exports.createRating=async(req,res)=>{
      try{
            //get user id 
            const userId=req.user.id;
            //fetchData from body
            const {rating,review,courseId}=req.body;
            //check if user is enrolled or not
            const courseDetails=await Course.findById({
                  _id:courseId,
                  studentEnrolled:{$elemMatch:{$eq:userId}},//check that user id present in enroled column or not
            });
            if(!courseDetails){
                  return res.status(400).json({
                        message:"You are not enrolled in this course",
                        success:false
                  });
            }            
            //check if user already reviewed 
            const alreadyReviewed=await RatingAndReview.findOne({
                  user:userId,
                  course:courseId
            })
            if(alreadyReviewed){
                  return res.status(400).json({
                        message:"You already reviewed this course",
                        success:false
                  });
            }
            //create rating the review
            const ratingAndReview=await RatingAndReview.create({
                  user:userId,
                  rating,
                  review,
                  course:courseId
            })
            //update the course with this rating and reviwe
           const updatedCourseDetails = await Course.findByIdAndUpdate(
             courseId,
             {
               $push: {
                 ratingAndReviews: ratingAndReview._id, // note the correct field name
               },
             },
             { new: true }
           );
            console.log("create Rating Udated",updatedCourseDetails);
            //return response;
            return res.status(200).json({
                  message:"Rating and review created successfully",
                  success:true
            });
      }catch(error){
            console.error("Create Rating Error",error);
            return res.status(500).json({
                  message:"Rating and Review not created ",
                  success:false
            })

      }
}

//===========get Average Rating=========
exports.getAverageRating=async(req,res)=>{
      try{
            //get Course id
            const courseId=req.body.courseId;
            //calculate average rating
            const result=await RatingAndReview.aggregate([
                  {
                        $match:{
                              course:new mongoose.Types.ObjectId(courseId),
                        },
                  },
                  {
                        $group:{
                              _id:null,
                              averageRating:{ $avg:"$rating"},
                        }
                  }
            ])
            if(result.length>0){
                  return res.status(200).json({
                        message:"Average Rating found",
                        success:true,
                        averageRating:result[0].averageRating
                  })
            }
            else{
                  return res.status(200).json({
                        message:"No Rating and Review given at a time",
                        success:true
                  })
            }


      }catch(error){
            console.log(error);
            return res.status(500).json({
                  message:"Average Rating not found ",
                  success:false
            })

      }
}

//===================get all Rating and review==========
exports.getAllRatingAndReview=async(req,res)=>{
      try{
            const allReviews=await RatingAndReview.find({})
                        .sort({rating:"desc"})
                        .populate({
                              path:"user",
                              select:"firstName lastName email image",//only  these fields result give other not send 
                        })
                        .populate({
                              path:"course",
                              select:"courseName",
                        })
                        .exec();
            return res.status(200).json({
                  message:"All Rating and Review found",
                  success:true,
                  data:allReviews,
            });
      }catch(error){
            console.log(error);
            return res.status(500).json({
                  message:"All Rating and Review not found ",
                  success:false
            })

      }
}