const CourseProgress=require("../models/CourseProgress");
const SubSection=require("../models/SubSection");
exports.updateCourseProgress=async(req,res)=>{
      const {courseId,SubSectionId}=req.body;
      const userId=req.user.id;
      try{
            //check Sub section is exist or not 
            const subSection=await SubSection.findById(SubSectionId);
            if(!subSection){
                  return res.status(404).json({message:"Sub Section not found"})
            }
            //check this entry exist or not in courseProgress
            const courseProgress=await CourseProgress.findOne({
                  userID:userId,
                  courseID:courseId
            });
            if(!courseProgress){
                  return res.status(400).json({
                        message:"Course Progress not Exit",
                        success:false
                  })
            }
            //update course progress
            if(courseProgress.completedVideos.includes(SubSectionId)){
                  return res.status(400).json({
                        message:"You have already completed this Lecture",
                        success:false
                  })
            }
            courseProgress.completedVideos.push(SubSectionId);
            await courseProgress.save();
            return res.status(200).json({
                  message:"Course Progress Updated Successfully",
                  success:true
            })

      }catch(error){
            console.log(error);
            return res.status(200).json({
                  message:"Lecture not mark as Completed",
                  success:false
            })
      }

}