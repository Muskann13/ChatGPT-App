import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema({
    role:{
        type:String,
        enum:["user","assistant"],
        required:true
    },
    content:{
        type:String,
        required:true
    },
    Timestamp:{
        type:Date,
        default:Date.now
    }
});

const ThreadSchema = new mongoose.Schema({
    threadId:{
        type:String,
        required:true,
        unique:true
    },
    title:{
        type:String,
        required:true
    },
    messages:[MessageSchema],
    createat:{
      type:Date,
      default:Date.now
    },
    updateat:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model("Thread",ThreadSchema);