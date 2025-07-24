const  express=require("express");
const router=express.Router();

const {auth,isStudent, isInstructor}=require("../middlewares/auth");

//controllers
const {
      updateProfile,
      getUserDetails,
      deleteAccount,
      updateDisplayPicture,
      getEnrolledCourses,
      instructorDashboard

}=require('../controllers/Profile')



//=============Profile routes==========

//Delete User Account
router.delete('/deleteProfile',auth,deleteAccount);
router.put('/updateProfile',auth,updateProfile);
router.get('/getUserDetails',auth,getUserDetails);
router.put('/updateDisplayPicture',auth,updateDisplayPicture);
router.get('/getEnrolledCourses',auth,isStudent,getEnrolledCourses);
router.get("/instructorDashboard",auth,isInstructor,instructorDashboard);




module.exports = router;
