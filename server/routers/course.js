const express = require("express");
const router = express.Router();

const {
  createCourse,
  getCourseDetails,
  getAllCourses,
} = require("../controllers/Course");

// categories Controllers
const {
  createCategory,
  showAllCategories,
  getCategoryPageDetails,
} = require("../controllers/Category");

// section controllers
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// subSections Controllers
const { createSubSection } = require("../controllers/SubSection");

// rating Controllers
const {
  createRating,
  getAverageRating,
  getAllRatingAndReview,
} = require("../controllers/RatingAndReview");

// Middlewares
const {
  auth,
  isAdmin,
  isInstructor,
  isStudent,
} = require("../middlewares/auth");

// ===================Course Router ==================
// Courses can only be Created by Instructors
router.post("/createCourse", auth, isInstructor, createCourse);

// Add a Section to a Course
router.post("/addSection", auth, isInstructor, createSection);

// update a Section
router.put("/updateSection", auth, isInstructor, updateSection);

// Delete a Section
router.delete("/deleteSection", auth, isInstructor, deleteSection);

// Add a Sub Section to a Section
router.post("/addSubSection", auth, isInstructor, createSubSection);

// Get Details for a Specific Courses
router.get("/getCourseDetails", getCourseDetails);

// get all Course
router.get("/getAllCourse", getAllCourses);

// =========Category routes (Only by Admin)===============
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.get("/getCategoryPageDetails", getCategoryPageDetails);

module.exports = router;
