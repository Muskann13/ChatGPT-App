import "./ChatWindow.css";
import Chat from "./Chat.jsx"
import { MyContext } from "./MyContext";
import { useContext, useState,useEffect } from "react";
import {ScaleLoader} from "react-spinners";
function ChatWindow(){
   const {prompt,setPrompt,reply,setReply,currThreadId,setThreadId,prevChats,setPrevChats,setNewChat}=useContext(MyContext);
   const [Loading,setLoading]=useState(false);
   const getReply=async()=>{
      if (Loading) return;
      setLoading(true);
      setNewChat(false);
      const options={
         method:"POST",
         headers:{
            "Content-type":"application/json"
         },
         body:JSON.stringify({
            messages:prompt,
            threadId:currThreadId
         })
      };
      try{
         const response=await fetch("https://chatgpt-app-4ybb.onrender.com/api/chat",options);
         const res= await response.json();
         setReply(res.reply);
      }catch(err){
         console.log(err);
      }
      finally{
         setLoading(false);
      }
   }

useEffect(()=>{
   if(prompt && reply){
      setPrevChats(prevChats =>(
         [...prevChats,{
            role:"user",
            content:prompt
            },{
               role:"assistant",
               content:reply
            }]
      ))
      }
      setPrompt("");
   },[reply]);
   
    return(
       <div className="chatWindow">
        <div className="navbar">
           <span>ChatGPT <i className="fa-solid fa-chevron-down"></i></span>
           <div className="userIcondiv">
            <span className="userIcon"><i className="fa-solid fa-user"></i></span>
           </div>
        </div>

        {/* <Chat></Chat> */}
        <Chat/>
        <ScaleLoader color="#fff" loading={Loading}>
        </ScaleLoader>

        <div className="chatInput"> 
         <div className="InputBox">
            <input placeholder="Ask anything"
            value={prompt} 
             onChange={(e)=>setPrompt(e.target.value)}
             onKeyDown={(e)=>e.key ==='Enter' && !Loading ?getReply():""}
            >
            </input>
            <div id="submit" onClick={!Loading ?getReply:null}><i className="fa-solid fa-paper-plane"></i></div>
         </div>
         <p className="info">
            ChatGPT can make mistakes. Check important info. See Cookie Preferences.
         </p>
        </div>
       </div>
      )
}
export default ChatWindow;