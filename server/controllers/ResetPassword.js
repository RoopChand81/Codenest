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
