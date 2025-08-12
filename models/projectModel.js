import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
            name: {
                type: String,
                required: true
            },
            description: {
                type: String,
                required: true
            },
            venue: {
                type: String,
                required: true
            },
            date: {
                type: Date,
                required: true
            },
            time: {
                type: String,
                required: true
            },
            organizer: {
                type: String,
                required: true
            },
            status :{                 
                type: String,
                enum: ["upcoming", "done", "disabled"],
                default: "upcoming",
                required: true
            },
            highlight : {               
                type : Boolean,
                required : true,
                default : false
            },
              order: {
                type: Number,
                required: false,
                default: 0 // optional default
            },    
            image: {
                type: String,
                required: true
            }
});


// Unique highlight already assumed created somewhere else
// Add unique partial index for order:
projectSchema.index(
  { order: 1 },
  {
    unique: true,
    partialFilterExpression: { highlight: false, order: { $gt: 0 } }
  }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
