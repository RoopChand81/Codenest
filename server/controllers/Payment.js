const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../models/User");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail"); //template improt

//capture the payment and initiate the Razorpay order
exports.capturePayment = async (req, res) => {
  try {
    //get courseId and UserId
    const { course_id } = req.body;
    const userId = req.user.id;
    //validation
    //valid courseID
    if (!course_id) {
      return res.status(400).json({
        success: false,
        message: "Course ID is Invaild",
      });
    }
    //valid courseDetail
    let course;
    try {
      course = await Course.findById(course_id);
      if (!course) {
        return res.status(400).json({
          success: false,
          message: "Course Not Found",
        });
      }
      //check :-user already  buy or Not this course
      const uid = new mongoose.Types.ObjectId(userId); //convert the string userId to ObjectID;
      if (course.studentsEnrolled.includes(uid)) {
        return res.status(400).json({
          success: false,
          message: "You already enrolled this course",
        });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "course fetch failed",
      });
    }
    //order Create
    const amount = course.price;
    const currency = "INR";
    const option = {
      amount: amount * 100,
      currency: currency,
      receipt: Math.random(Date.now()).toString(),
      notes: {
        courseId: course_id,
        userId,
      },
    };
    try {
      //initiate the payment using razorPay
      const paymentResponse = await instance.orders.create(option);
      console.log(paymentResponse);
      return res.status(200).json({
        success: true,
        courseName: course.courseName,
        courseDescription: course.courseDescription,
        thumbnail: course.thumbnail,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount / 100,
      });
    } catch (error) {
      console.log(error);
      res.status(400).json({
        success: false,
        message: "Payment failed",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "payment capture failed",
    });
  }
};

//==============authorization=============
exports.verifySignature=async(req,res)=>{
      const webhookSecret="12345678";

      const signature=req.headers["x-razorpay-signature"];

      const shasum=crypto.createHmac("sha256",webhookSecret);
      shasum.update(JSON.stringify(req.body));
      const digest=shasum.digest("hex");
      if(signature===digest){
            console.log('Payment authorised');

            const {courseId,userId}=req.body.payload.payment.entity.notes;
            try{
                  //find student and add a course;
                  const enrolledStudent=await User.findByIdAndUpdate(
                        userId,
                        {
                              $push:{
                                    courses:courseId,
                              }
                        },
                        {new:true}
                  )
                  if(!enrolledStudent){
                        return res.status(404).json({
                              success:false,
                              message:"Student not found"
                        });
                  }
                  console.log(enrolledStudent);
                  //student push in Course
                  const enrolledCourse=await Course.findByIdAndUpdate(
                        courseId,
                        {
                              $push:{
                                    studentsEnrolled:userId,
                              }
                        },
                        {new:true}
                  );
                  if(!enrolledCourse){
                        return res.status(500).json({
                              success:false,
                              message:"course not found"
                        })
                  }
                  console.log(enrolledCourse);

                  //when student success full take the Course then send the mail
                  const emailResponde=await mailSender(
                        enrolledStudent.email,
                        "Congratulation form studyNoisn",
                        "You have successfully enrolled in the course",
                  )
                  console.log(emailResponde);
                  return res.status.status(200).json({
                        success:true,
                        message:"Course enrolled successfully",
                  });

            }catch(error){
                  console.log(error);
                  return res.status(500).json({
                        success:false,
                        message:"Student not enrolled in the Course"
                  })

            }
      }
      else{
            return res.status(400).json({
                  success:false,
                  message:"Invalid Requrest"
            });
      }
}
