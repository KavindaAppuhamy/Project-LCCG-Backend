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
            image: {
                type: String,
                required: true
            }
});

const Project = mongoose.model("Project", projectSchema);
export default Project;
