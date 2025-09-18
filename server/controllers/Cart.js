const Cart = require("../models/Cart");
const Course = require("../models/Course");

// Add a course to cart
exports.addCourseToCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { email, id } = req.user; // ✅ extracted from token

    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "courseId is required",
      });
    }

    // Ensure course exists
    const validCourse = await Course.findById(courseId);
    if (!validCourse) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // Find cart or create new
    let cart = await Cart.findOne({ email });
    if (!cart) {
      cart = new Cart({ email, courses: [] });
    }

    // Prevent duplicate
    if (cart.courses.includes(courseId)) {
      return res.status(400).json({
        success: false,
        message: "Course already in cart",
      });
    }

    cart.courses.push(courseId);
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Course added to cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Remove a single course from cart
exports.removeCourseFromCart = async (req, res) => {
  try {
    const { courseId } = req.body;
    const { email } = req.user;

    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.courses = cart.courses.filter(
      (course) => String(course) !== String(courseId)
    );
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Clear all courses from cart
exports.clearCart = async (req, res) => {
  try {
    const { email } = req.user;

    let cart = await Cart.findOne({ email });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.courses = [];
    await cart.save();

    return res.status(200).json({
      success: true,
      message: "All courses removed from cart",
      cart,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all courses from user cart (deep populate)
exports.getUserCart = async (req, res) => {
  try {
    const { email } = req.user;

    const cart = await Cart.findOne({ email })
      .populate({
        path: "courses",
        model: "Course",
        populate: [
          {
            path: "instructor",
            populate: {
              path: "additionalDetails",
            },
          },
          { path: "category" },
          {
            path: "courseContent",
            populate: { path: "SubSection" },
          },
          {
            path: "ratingAndReviews",
            populate: { path: "user" },
          },
        ],
      })
      .exec();

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
        courses: [],
      });
    }

    return res.status(200).json({
      success: true,
      courses: cart.courses,
    });
  } catch (err) {
    console.error("Error fetching user cart:", err);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching cart",
      error: err.message,
    });
  }
};
