import mongoose from "mongoose"

const newsletterSchema =mongoose.Schema( 
    {
        title :{
            type : String,
            required : true
        },
        pdf : {
            type : String,
            required : true
        },
        date: {
            type: Date,
            default: Date.now
        },
        image : {
            type : String,
            required : true
        },
        disabled : {               
            type : Boolean,
            required : true,
            default : false
        }

    }
)

const Newsletter =mongoose.model("newsletter",newsletterSchema)
                                                        
export default Newsletter ;