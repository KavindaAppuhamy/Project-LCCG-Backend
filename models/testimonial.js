import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {            
    type: String,
    required: true
  },
  speech: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  disabled: {
    type: Boolean,
    default: false,
    required: true
  }
});

const Testimonial = mongoose.model("Testimonial", testimonialSchema);
export default Testimonial;
