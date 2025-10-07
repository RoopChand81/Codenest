const mongoose = require("mongoose");

//create schema 
const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
   courses:
   [
      {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course",
      }
   ],
});
//create the model using that schema
module.exports = mongoose.model("Cart",cartSchema);