const jwt = require("jsonwebtoken");
require("dotenv").config();

//===============Auth===========
//
exports.auth = async (req, res, next) => {
  try {
    //extact token using any these 3 ways
    const token =
      req.cookies.token ||
      req.body.token ||
      req.header("Authorization").replace("Bearer ", "");

    // token missing then return
    if (!token) {
      return res.status(401).json({
        message: "Please provide a token",
        success: false,
      });
    }

    //verify the token
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = decoded; //add in user
    } catch (error) {
      return res.status(401).json({
        message: "Error while decoding token",
        success: false,
      });
    }
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Error while token validating ",
      success: false,
      error: error.message,
    });
  }
};
