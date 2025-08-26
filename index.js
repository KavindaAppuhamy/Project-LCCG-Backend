import express from 'express'
import adminRouter from './routes/adminRoutes.js'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'
import memberRouter from './routes/memberRoutes.js'
import otpRouter from './routes/otpRoutes.js'
import newsletterRouter from './routes/newsletterRoutes.js'
import projectRouter from './routes/projectRouter.js'
import testimonialRouter from './routes/testimonialRoutes.js'




// Load environment variables from .env file
dotenv.config()

const app = express()

app.use(cors())

app.use(bodyParser.json())


// MongoDB connection string
const connectionString = process.env.MONGO_URL;


//Middleware
app.use((req,res,next)=>{                                               

    const token = req.header("Authorization")?.replace("Bearer ", "")   
                                                                        
    if(token != null){                          
      jwt.verify(token,process.env.JWT_KEY,                
        (err,decoded)=>{                        
        if(decoded != null){                    
          req.user = decoded                    
          next()                  
        }else{                                  
          next()
        }
  
      }
    )
    }else{
      next()
    }
  
  });

// Connect to MongoDB
mongoose.connect(connectionString).then(     
    ()=>{
        console.log("Connected to the databse")
    }
).catch(
    ()=>(
        console.log("Connection failed")
    )
)

// Route mounting
app.use("/api/admin",adminRouter)
app.use("/api/member", memberRouter)
app.use("/api/otp", otpRouter)
app.use("/api/newsletter", newsletterRouter)
app.use("/api/project", projectRouter)
app.use("/api/testimonials", testimonialRouter);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});