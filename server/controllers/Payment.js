const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const courseEnrollmentEmail= require("../mail/templates/courseEnrollmentEmail");
const { paymentSuccessEmail } = require("../mail/templates/paymentSuccessEmail");
const { default: mongoose } = require("mongoose");
const crypto = require("crypto");
const CourseProgress = require("../models/CourseProgress");

exports.capturePayment = async (req, res) => {
  //get courseId and UserID
  const { courses } = req.body;
  const userId = req.user.id;
  //validation
  //valid courseID
  try {
    if (courses.length === 0) {
      return res.json({
        success: false,
        message: "Please provide valid course ID",
      });
    }

    let totalAmount = 0;

    for (const course_id of courses) {
      let course;
      // console.log("courseid=",course_id);
      try {
        course = await Course.findById(course_id);
        if (!course) {
          return res.json({
            success: false,
            message: "Could not find the course",
          });
        }

        //user already pay for the same course
        const uid = new mongoose.Types.ObjectId(userId);
        if (course.studentsEnrolled.includes(uid)) {
          return res.status(400).json({
            success: false,
            message: "Student is already enrolled",
          });
        }
        totalAmount += course.price;
      } catch (error) {
        console.error(error);
        return res.status(500).json({
          success: false,
          message: error.message,
        });
      }
      // totalAmount += course.price;
    }
    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: Math.random(Date.now()).toString(),
    };

    try {
      //initiate the payment using razorpay
      const paymentResponse = await instance.orders.create(options);
      console.log("payment", paymentResponse);
      //return response
      return res.status(200).json({
        success: true,
        orderId: paymentResponse.id,
        currency: paymentResponse.currency,
        amount: paymentResponse.amount,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//Payment verification
exports.verifyPayment = async (req, res) => {
  const razorpay_order_id = req.body?.razorpay_order_id;
  const razorpay_payment_id = req.body?.razorpay_payment_id;
  const razorpay_signature = req.body?.razorpay_signature;
  const courses = req.body?.courses;
  const userId = req.user.id;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !courses ||
    !userId
  ) {
    return res.status(400).json({
      success: false,
      message: "Payment Failed",
    });
  }

  let body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_SECRET)
    .update(body.toString())
    .digest("hex");

  if (expectedSignature === razorpay_signature) {
    //enrolled student
   await enrollStudents(courses, userId); // No res passed
   return res.status(200).json({
     success: true,
     message: "Payment Verified and Student Enrolled",
   });

  }
  return res.status(500).json({
    success: false,
    message: "Payment Verification Failed",
  });
};

const enrollStudents = async (courses, userId) => {
  if (!courses || !userId) {
    throw new Error("Please provide data for courses or userId");
  }

  for (const courseId of courses) {
    try {
      // Add student to course
      const enrolledCourse = await Course.findOneAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );

      if (!enrolledCourse) {
        throw new Error("Course not found");
      }

      // Add course to student
      const enrolledStudent = await User.findByIdAndUpdate(
        userId,
        { $push: { courses: courseId } },
        { new: true }
      );

      //add course progress for userid and courseid

      const courseProgress = await CourseProgress.create({
        userID: userId,
        courseID: courseId,
        completedVideos:[]
      });
      if(!courseProgress){
        throw new Error("Course Progress not created");
      }

      //template for mail send
      const template = courseEnrollmentEmail(
        enrolledCourse.courseName,
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
      );
      // Send enrollment email
      const emailResponse = await mailSender(
        enrolledStudent.email,
        `Successfully Enrolled into ${enrolledCourse.courseName}`,
        template
      );

      console.log("Email Sent Successfully", emailResponse);
    } catch (error) {
      console.error("Error enrolling student:", error.message);
      throw new Error("Failed to enroll student: " + error.message);
    }
  }

  return true;
};

exports.sendPaymentSuccessEmail = async (req, res) => {
  const { orderId, paymentId, amount } = req.body;
  const userId = req.user.id;

  if (!orderId || !paymentId || !amount || !userId) {
    return res.status(400).json({
      success: false,
      message: "Please provide all the fields",
    });
  }
  try {
    const enrolledStudent = await User.findById(userId);
    await mailSender(
      enrolledStudent.email,
      `Payment Recieved`,
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId
      )
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to Send Payment Success Email",
    });
  }
};

