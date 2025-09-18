const mongoose = require("mongoose");

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
module.exports = mongoose.model("Cart",cartSchema);