import "./Chat.css";
import { useContext, useState,useEffect } from "react";
import { MyContext } from "./MyContext";
import ReactMarkdown from 'react-markdown';
import rehypeHighlight from 'rehype-highlight';
import "highlight.js/styles/github-dark.css";

function Chat(){
    const {newChat,prevChats,reply}=useContext(MyContext);
    let [latestReply,setLatestReply]=useState(null);
  
    useEffect(()=>{
      if(reply===null){
         setLatestReply(null);
         return;
      }
      if(!prevChats.length||!reply) return;
      setLatestReply("");
      const content=reply.split(" ");
      let idx=0;
      const interval=setInterval(() => {
         setLatestReply(content.slice(0,idx+1).join(" "));
         idx++;
         if(idx>=content.length) clearInterval(interval);
      }, 60);
      return ()=>clearInterval(interval);
      
    },[prevChats,reply]);
    return(
        <>
        {newChat && <h1>Hey Muskan, how can I help you?</h1>}
        <div className="chats">
         {
            prevChats?.slice(0,-1).map((chat,idx)=>
               <div className={chat.role==="user" ? "userdiv" : "gptdiv"}key={idx}>
                    {
                     chat.role ==="user" ?
                     <p className="userMessage">{chat.content}</p>:
                     <ReactMarkdown rehypePlugins={rehypeHighlight}>{chat.content}</ReactMarkdown>
                    }
               </div>
            )
         }
         {
            prevChats.length > 0 &&(
               <>
                {
                  latestReply!==null ?(
                     <div className="gptdiv" key={"typing"}>
                      <ReactMarkdown rehypePlugins={rehypeHighlight}>{latestReply}</ReactMarkdown>
                     </div>
                  ):(
                     <div className="gptdiv" key={"non-typing"}>
                     <ReactMarkdown rehypePlugins={rehypeHighlight}>{prevChats[prevChats.length-1].content}</ReactMarkdown>
                     </div>
                  )
                }
               </>
            )
         }
        </div>
        </>
      )
}   
export default Chat;