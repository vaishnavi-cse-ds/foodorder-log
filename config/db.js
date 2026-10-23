const mongoose = require("mongoose");
const connectDB=async()=>{
    try{
        const connection=await mongoose.connect(process.env.mongodb_url);
        console.log(connection);
        console.log("MONGO DB connected successfully");
    } catch (error) {
       console.log("DB connection falied");
       console.log(error);
       process.exit(1);
    }
}

module.exports=connectDB;