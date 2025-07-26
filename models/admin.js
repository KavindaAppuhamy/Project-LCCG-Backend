import mongoose from "mongoose"

const adminSchema =mongoose.Schema( 
    {
        email :{
            type : String,
            required : true,
            unique : true
        },
        password : {
            type : String,
            required : true
        },
        userName : {
            type : String,
            required : true
        },
        status :{                 
            type: String,
            enum: ["pending", "accept", "reject"],
            default: "pending",
            required: true
        },
        disabled : {               
            type : Boolean,
            required : true,
            default : false
        },
        emailVerified : {
            type : Boolean,
            required : true,
            default : false
        }

    }
)

const Admin =mongoose.model("admin",adminSchema)
                                                        
export default Admin ;