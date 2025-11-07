const jwt=require("jsonwebtoken");
require("dotenv").config();

//===============Auth===========
//
exports.auth =async(req,res,next)=>{
      try {
            //extact token using any these 3 ways
            const token =
              req.cookies.token ||
              req.body.token ||
              req.header("Authorization").replace("Bearer ", "");
           
            // token missing then return 
            if(!token)
            {
                  return res.status(401).json({
                        message:"Please provide a token",
                        success:false
                  });
            }
            //verify the token 
            try{
                  const decoded =  jwt.verify(token,process.env.JWT_SECRET);
                  console.log("Decode Data:" ,decoded);
                  req.user = decoded;//add in user
            }catch(error){
                  console.log("this is error :", error);
                  return res.status(401).json({
                        message:"Error while decoding token",
                        success:false,
                        error
                        
                  });
            }
            next();

      }catch(error){
            console.log(error);
            return res.status(500).json({
                  message:"Error while token validating ",
                  success:false,
                  error:error.message
            });

      }
}

//================Student Role Verify=================
exports.isStudent =async(req,res,next)=>{
      try{
            if(req.user.accountType !== "Student"){
                  return res.status(403).json({
                        message:"You are not a student",
                        success:false
                  });
            }
            next();
      }catch(error){
            return res.status(401).json({
                  message:"This route protected for  Student Role is not verify",
                  success:false
            });
      }
}

//==================== Is Instructor=================
exports.isInstructor =async(req,res,next)=>{
      try{
            if(req.user.accountType !== "Instructor"){
                  return res.status(403).json({
                        message:"This route protected for  Instructor",
                        success:false
                  });
            }
            next();
      }catch(error){
            return res.status(401).json({
                  message:"You are not a Instructor Role not verify",
                  success:false
            });
      }
}

//is Admin Role verify
exports.isAdmin =async(req,res,next)=>{
      try{
            if(req.user.accountType !== "Admin"){
                  return res.status(403).json({
                        message:"This route protected for  Admin",
                        success:false
                  });
            }
            next();
      }catch(error){
            return res.status(401).json({
                  message:"You are not a Admin Role not verify",
                  success:false
            });
      }
}
