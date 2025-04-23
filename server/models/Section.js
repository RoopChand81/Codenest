const mongoose =require("mongoose");
const SubSection = require("./SubSection");

const sectionSchema = new mongoose.Schema({
     sectionName:{
            type:String,
      },
      SubSection:[
            {
                  type:mongoose.Schema.Types.ObjectId,
                  ref: 'SubSection',
                  //required:true,
            },
      ]
});

const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);
module.exports = Section;