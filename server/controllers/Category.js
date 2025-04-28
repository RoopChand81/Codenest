const Category = require("../models/Category");
const Course = require("../models/Course");

//==========create Category=====================
exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    //validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields",
      });
    }
    //create entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    return res.status(201).json({
      success: true,
      message: "Category created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating Category",
      success: false,
      error: error.message,
    });
  }
};




//=============get all Category====================
exports.showAllCategories=async(req,res)=>{
      try {
            const allCategory = await Category.find(
              {},
              { name: true, description: true, courses:true,}
            );
            return res.status(200).json({
                  success:true,
                  message:"All Categories retrieved successfully",
                  data:allCategory
            });
      }catch(error){
            console.log(error);
            return res.status(404).json({
                  message:"Error while fetching all Category",
                  success:false
            });

      }
}

//==================CategoryPageDetails===========
exports.getCategoryPageDetails=async(req,res)=>{
      try {
            //get Categroy id
            const {categoryId}=req.body;

            //get all course under that category
            const selectedCategory=await Category.findById(categoryId).populate("courses").exec();
           
            //validation
            if(!selectedCategory){
                  return res.status(404).json({
                        message:"Category not found",
                        success:false
                  });
            }
            
            //Handle that category when no course
            if(selectedCategory.courses.length===0){
                  return res.status(404).json({
                        message:"No course found under this category",
                        success:false
                  });
            }

            //get Courses for different categrories 
            const differentCategory=await Category.find({
                  _id:{$ne:categoryId},
            }).populate("courses").exec();

            //get top selling course
            const topSellingCoursesId = await Course.find({})
                        .sort({ studentsEnrolled: -1 })  // Sort by number of students in descending order
                        .limit(10)                        // Get the top 10 courses
                        .select("_id"); 
                  
            const topSellingCourses =  await Course.find(
                  { _id: { $in: topSellingCoursesId} }, // Filter by course IDs
                  ).select(" id courseName price thumbnail"); // Selected feilds
            
            //return response 
            return res.status(200).json({
                  success:true,
                  message:"Category page details retrieved successfully",
                  data:{
                        selectedCategory,
                        differentCategory,
                        topSellingCourses,
                  }
            })

      }catch(error){
            return res.status(500).json({
                  message:"Error retrieving category page details",
                  success:false,
                  error: error.message,
            });

      }
}