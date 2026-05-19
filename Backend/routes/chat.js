import express from "express";
import Thread from "../models/Thread.js";
import getGeminiAIAPIResponse from "../utils/gemini.js";
const router=express.Router();

//test
router.post("/test",async(req,res)=>{
    try{
      const thread=new Thread ({
        threadId:"abc123",
        title:"testing of thread"
      });
      const response=await thread.save();
      res.send(response);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to save in Db"});
    }
})

//Get all history
router.get("/thread",async(req,res)=>{
    try{
       const thread=await Thread.find({}).sort({updateat:-1});
       res.json(thread);
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to Fetch history"});
    }
})

//Get all Message
router.get("/thread/:threadId",async (req,res)=>{
    const {threadId}=req.params;
    try{
      const thread=await Thread.findOne({threadId});

      if(!thread){
        res.status(404).json({error:"Thread not Found"});
      }else{
        res.json(thread.messages);
      }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to Fetch chat"});
    }
})

//Delete the history
router.delete("/thread/:threadId",async(req,res)=>{
    const {threadId}=req.params;
    try{
       const deletethread=await Thread.findOneAndDelete({threadId});
       if(!deletethread){
        res.status(404).json({error:"Thread not Found"});
       }
       else{
        res.status(200).json({success:"Thread deleted Successfully"});
       }
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Failed to delete the thread"});
    }
})
//chat with chatGPT
router.post("/chat",async(req,res)=>{
    const {threadId,messages}=req.body;
    console.log(req.body);
    if(!threadId ||!messages){
        return res.status(404).json({error:"missing required fields"});
    }

    try{
        let thread=await Thread.findOne({threadId});
        if(!thread){
            //create a new thread
            thread=new Thread({
                threadId,
                title:messages,
                messages:[{role:"user",content:messages}]
            })        
        }else{
            thread.messages.push({role:"user",content:messages});
        }

        const assistantreply= await getGeminiAIAPIResponse(messages);
        thread.messages.push({role:"assistant",content:assistantreply});
        thread.updateat=new Date();
        await thread.save();
        res.json({reply :assistantreply});
       
    }catch(error){
        console.log(error);
        res.status(500).json({error:"Something went wrong"});
    }
})

export default router;