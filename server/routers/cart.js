const express = require("express");
const router = express.Router();

const {
  addCourseToCart,
  removeCourseFromCart,
  clearCart,
  getUserCart,
} = require("../controllers/Cart");

// Middlewares
const { auth, isStudent } = require('../middlewares/auth');

// Add a course to cart
router.post("/addCart",auth,isStudent,addCourseToCart);

// Remove a single course from cart
router.delete("/removeCart", auth,isStudent,removeCourseFromCart);

// Clear all courses from cart
router.delete("/clearCart", auth,isStudent,clearCart);

// Get user cart with populated courses
router.get("/userCart", auth,isStudent,getUserCart);

module.exports = router;
