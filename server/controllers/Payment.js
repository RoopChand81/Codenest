const crypto = require("crypto");
const mongoose = require("mongoose");
const Payment = require("../models/Payment");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CourseProgress");
const mailSender = require("../utils/mailSender");
const { instance } = require("../config/razorpay");
const courseEnrollmentEmail = require("../mail/templates/courseEnrollmentEmail");
const {
  paymentSuccessEmail,
} = require("../mail/templates/paymentSuccessEmail");


// CREATE ORDER (FRONTEND CALLS)
exports.capturePayment = async (req, res) => {
  try {
    const { courses } = req.body;
    const userId = req.user.id;

    if (!courses || courses.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "No courses selected" });
    }

    let totalAmount = 0;

    for (const courseId of courses) {
      const course = await Course.findById(courseId);
      if (!course) {
        return res
          .status(404)
          .json({ success: false, message: "Course not found" });
      }

      if (course.studentsEnrolled.includes(userId)) {
        return res.status(400).json({
          success: false,
          message: "Already enrolled in one of the courses",
        });
      }

      totalAmount += course.price;
    }

    const options = {
      amount: totalAmount * 100,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    };

    const order = await instance.orders.create(options);

    await Payment.create({
      orderId: order.id,
      userId,
      courses,
      amount: order.amount,
      status: "PENDING",
    });

    return res.status(200).json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Order creation failed" });
  }
};


// RAZORPAY WEBHOOK 
exports.razorpayWebhook = async (req, res) => {
  try {
    const signature = req.headers["x-razorpay-signature"];

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(req.rawBody)
      .digest("hex");

    if (signature !== expectedSignature) {
      return res.status(400).send("Invalid signature");
    }
    const event = JSON.parse(req.rawBody.toString());
    if (event.event === "payment.captured") {
      const paymentEntity = event.payload.payment.entity;

      const payment = await Payment.findOne({
        orderId: paymentEntity.order_id,
      });

      if (!payment || payment.status === "SUCCESS") {
        return res.status(200).send("Already processed");
      }

      // ENROLL STUDENT
      await enrollStudents(payment.courses, payment.userId);

      payment.status = "SUCCESS";
      payment.paymentId = paymentEntity.id;
      await payment.save();

      const user = await User.findById(payment.userId);

      await sendPaymentSuccessEmail(
        payment.userId,
        payment.orderId,
        paymentEntity.id,
        payment.amount,
      );
    }

    res.status(200).send("Webhook received");
  } catch (error) {
    console.error("Webhook Error:", error);
    res.status(500).send("Webhook error");
  }
};

// ENROLLMENT LOGIC
const enrollStudents = async (courses, userId) => {
  
  for (const courseId of courses) {
    await Course.findByIdAndUpdate(
      courseId,
      { $addToSet: { studentsEnrolled: userId } },
      { new: true },
    );
    
    await User.findByIdAndUpdate(
      userId,
      { $addToSet: { courses: courseId } },
      { new: true },
    );

    await CourseProgress.create({
      userID: userId,
      courseID: courseId,
      completedVideos: [],
    });

    const course = await Course.findById(courseId);
    const user = await User.findById(userId);

    //template for mail send
    const template = courseEnrollmentEmail(
      course.courseName,
      `${user.firstName} ${user.lastName}`,
    );
    // Send enrollment email
    const emailResponse = await mailSender(
      user.email,
      `Successfully Enrolled into ${course.courseName}`,
      template
    );
  }
};

const sendPaymentSuccessEmail = async (userId, orderId, paymentId, amount) => {
  try {
    if (!userId || !orderId || !paymentId || !amount) {
      throw new Error("Missing data for payment success email");
    }

    const enrolledStudent = await User.findById(userId);

    if (!enrolledStudent) {
      throw new Error("User not found");
    }

    await mailSender(
      enrolledStudent.email,
      "Payment Received",
      paymentSuccessEmail(
        `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
        amount / 100,
        orderId,
        paymentId,
      ),
    );

    console.log("Payment success email sent");
  } catch (error) {
    console.error("Failed to send payment success email:", error.message);
  }
};

