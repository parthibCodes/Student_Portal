import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

if(!mongoURI){
    throw new Error("MONGO_URI is not defined");
}

mongoose.connect(mongoURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
    console.log("Connected to MongoDB");
}).catch((error)=>{
    console.log("Error connecting to MongoDB: "+error);
});

export default mongoose;
