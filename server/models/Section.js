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
            },
      ]
});

const Section = mongoose.models.Section || mongoose.model("Section", sectionSchema);
module.exports = Section;