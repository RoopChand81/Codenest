const Category =require("../models/Category");
const Course=require("../models/Course");

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}


//==========create Category=====================
exports.createCategory=async(req,res)=>{
      try {
            const {name,description}=req.body;
            //validation 
            if(!name || !description){
                  return res.status(400).json({
                        success:false,
                        message:"Please fill in all fields"
                  });
            }
            //create entry in DB
            const categoryDetails=await Category.create({
                  name:name,
                  description:description
            });
            return res.status(201).json({
                  success:true,
                  message:"Category created successfully",
            });
      }catch(error){
            return res.status(500).json({
                  message:"Error while creating Category",
                  success:false,
                  error:error.message
            });
      }
}
//===================Delete Category==================


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
        const { categoryId } = req.body;

        //get all course under that category
        const selectedCategory = await Category.findById(categoryId)
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
              path: "ratingAndReviews",
            },
          })
          .exec();

        //validation
        if (!selectedCategory) {
          return res.status(404).json({
            message: "Category not found",
            success: false,
          });
        }

        //Handle that category when no course
        if (selectedCategory.courses.length === 0) {
          return res.status(404).json({
            message: "No course found under this category",
            success: false,
          });
        }

        // Get courses for other categories
        const categoriesExceptSelected = await Category.find({
          _id: { $ne: categoryId },
        });

        //random chose one category from except selected Category
        let differentCategory = await Category.findOne(
          categoriesExceptSelected[
            getRandomInt(categoriesExceptSelected.length)
          ]._id
        )
          .populate({
            path: "courses",
            match: { status: "Published" },
            populate: {
              path: "ratingAndReviews",
            },
          })
          .exec();

        //get top selling course
        const topSellingCoursesIds = await Course.find({})
          .sort({ studentsEnrolled: -1 }) // Sort by number of students in descending order
          .limit(10) // Get the top 10 courses
          .select("_id");

        // Fetch course details for those IDs
        const topSellingCourses = await Course.find({
          _id: { $in: topSellingCoursesIds },
          status: "Published", // Ensure only published courses
        })
          .select("courseName price thumbnail instructor")
          .populate({
            path: "instructor",
            select: "firstName lastName", // Populate only these fields from instructor
          })
          .populate({
            path: "ratingAndReviews",
          }).exec();
          

        //return response
        return res.status(200).json({
          success: true,
          message: "Category page details retrieved successfully",
          data: {
            selectedCategory,
            differentCategory,
            topSellingCourses,
          },
        });
      }catch(error){
            return res.status(500).json({
                  message:"Error retrieving category page details",
                  success:false,
                  error: error.message,
            });

      }
}