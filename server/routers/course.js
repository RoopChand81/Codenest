const express = require('express');
const router = express.Router();

const {
      createCourse,
      getCourseDetails,
      getAllCourses,
      editCourse,
      getFullCourseDetails,
      getInstructorCourses,
      deleteCourse,
} = require('../controllers/Course');



// categories Controllers
const {
      createCategory,
      showAllCategories,
      getCategoryPageDetails,
      
} = require('../controllers/Category');

// section controllers
const {
      createSection,
      updateSection,
      deleteSection,
} = require('../controllers/Section');

// subSections Controllers
const {
      createSubSection,
      updateSubSection,
      deleteSubSection,
} = require('../controllers/SubSection');

// rating Controllers
const {
      createRating,
      getAverageRating,
      getAllRatingAndReview,
} = require('../controllers/RatingAndReview');

const {
      updateCourseProgress
}=require("../controllers/courseProgress")

// Middlewares
const { auth, isAdmin, isInstructor, isStudent } = require('../middlewares/auth');

// ===================Course Router ==================
// Courses can only be Created by Instructors
router.post('/createCourse', auth, isInstructor, createCourse);
router.post("/editCourse",auth,isInstructor,editCourse);
router.get('/getFullCourseDetails', auth,isStudent,getFullCourseDetails);
router.get('/getInstructorCourses', auth,isInstructor, getInstructorCourses);
router.delete('/deleteCourse',auth,isInstructor,deleteCourse);


// Add a Section to a Course
router.post('/addSection', auth, isInstructor, createSection);
// update a Section
router.put('/updateSection', auth, isInstructor, updateSection);
// Delete a Section
router.delete('/deleteSection', auth, isInstructor, deleteSection);


// Add a SubSection to a Section
router.post('/addSubSection', auth, isInstructor, createSubSection);
router.post('/updateSubSection',auth,isInstructor,updateSubSection);
router.delete('/deleteSubSection', auth, isInstructor, deleteSubSection);

//for every one this Route no need to login it
// Get Details for a Specific Courses
router.post('/getCourseDetails', getCourseDetails);
// get all Course
router.get('/getAllCourse', getAllCourses);



// =========Category routes (Only by Admin)===============
router.post('/createCategory', auth, isAdmin, createCategory);
router.get('/showAllCategories', showAllCategories);
router.post('/getCategoryPageDetails', getCategoryPageDetails);


//=============Rating And Review===========================
router.post('/createRating', auth,isStudent,createRating);
router.get('/getReviews',getAllRatingAndReview);

//===================courseProgess======================
router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

module.exports = router;
