import express from "express";
import "dotenv/config";
import cors from "cors";
import mongoose from "mongoose";
import chatRouter from "./routes/chat.js";

const app=express();
const PORT=8080;
app.use(cors());
app.use(express.json()); 

app.use("/api",chatRouter);

app.listen(PORT,()=>{
    console.log(`server is running ${PORT}`);
    connectdb();
});

const connectdb = async() =>{
  try{
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Mongo URL:", process.env.MONGODB_URL);
    console.log("Connected with Database.")
  }catch(error){
      console.log("Failed connect with database",error);
  }
}

  