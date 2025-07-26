import express from 'express'
import adminRouter from './routes/adminRoutes.js'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import cors from 'cors'




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


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});