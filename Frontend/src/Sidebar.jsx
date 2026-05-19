import "./Sidebar.css";
import { useContext, useEffect } from "react";
import { MyContext } from './MyContext';
import {v1 as uuidv1} from "uuid";
function Sidebar(){
    const {allThread,setAllThread,currThreadId,setNewChat,setPrompt,setReply,setPrevChats,setCurrThreadId}=useContext(MyContext);
    
    const getAllThreads = async()=>{
        try{
          const response=await fetch("http://localhost:8080/api/thread");
          const res = await response.json();
        //   console.log(res);
          const filterData=res.map(thread=>({threadId:thread.threadId,title:thread.title}));
        //   console.log(filterData);
          setAllThread(filterData);
        }catch(error){
            console.log(error);
        }
    };
    useEffect(()=>{
      getAllThreads();
    },[currThreadId]);


    const createNewChat=()=>{
      setNewChat(true);
      setPrompt("");
      setReply(null);
      setPrevChats([]);
      setCurrThreadId(uuidv1());
    }


    const changeThread =async(newThreadId)=>{
      setCurrThreadId(newThreadId);
      try{ 
        const response=await fetch(`http://localhost:8080/api/thread/${newThreadId}`);
        const res= await response.json();
        console.log(res);
        setPrevChats(res);
        setNewChat(false);
        setReply(null);
      }catch(error){
        console.log(error);
      }
    }


    const deleteThread=async(deleteThreadId)=>{
        try{
          const response=await fetch(`http://localhost:8080/api/thread/${deleteThreadId}`,{method:"DELETE"});
          const res=await response.json();
          console.log(res);
          console.log("deleteId:", deleteThreadId);
          
          setAllThread(prevThread=>{
            console.log("threads:", prevThread);
            return prevThread.filter(thread=>thread.threadId!==deleteThreadId);
          });
        }
        catch(error){
            console.log(error);
        }
    }
    return (
        <section className="sidebar">
            {/* new chat button */}
            <button onClick={createNewChat}>
                <img src="src/assets/blacklogo.png" alt="gpt logo" className="logo"></img>
                <span><i className="fa-solid fa-pen-to-square"></i></span>
            </button>
            
            {/* history */}
            <ul className="history">
               {
                allThread?.map((thread,idx)=>(
                    <li key={idx} 
                    onClick={(e)=>changeThread(thread.threadId)}>
                    {thread.title} <i className="fa-solid fa-trash"
                    onClick={(e)=>{
                      e.stopPropagation();
                      deleteThread(thread.threadId);
                    }
                    }
                    ></i></li>
                ))
               }
            </ul>

            {/* sign */}
            <div className="sign">
                <p>By Muskan &hearts;</p>
            </div>
        </section>
    )
}
export default Sidebar;