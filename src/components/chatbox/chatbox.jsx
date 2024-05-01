import { useState, useContext, useEffect } from "react"
import styles from './chat.module.css'

import { userContext } from "@/providers/UserContextProvider"
import VideoChat from "../videochat/videochat"

import { channelContext, connectionContext, rtcContext } from "@/providers/rtcProvider"


export default function Chatbox({callfrom, videoChatTo,handleSend, selected, chatRef, inputRef, messages }) {
  const [message, setMessage] = useState('')
  const { id, name } = useContext(userContext)
const [videocall , setVideoCall] = useState(false)


  const handleChange = (e) => {
    setMessage(e.target.value)
  }
  // console.log(callfrom);

  return (
    <div className={` ${styles.chatbox}  w-full bg-[#F0F0F0] `}>
   { (videocall || callfrom ) ? (<VideoChat></VideoChat>): (<> <div className={` p-4 w-full h-5/6 overflow-y-scroll` } ref={chatRef}>
    {selected ? (
      <div className="chat-messages flex  flex-col" >
        {messages.map((val, index) => (
          <div className={`wrapper  max-w-lg  ${val.senderId == id ? 'self-end' : 'self-start'}`} key={index}>
            <div className={`chat p-4 rounded-md mb-3 ${val.senderId == id ? 'text-white bg-gradient-to-r from-blue-900 to-purple-800' : 'text-white bg-slate-400'}`}>
              {val.des}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <h1 className="text-2xl text-center font-bold  ">Select the user to see Chat</h1>
    )}
    </div>
  
    {selected && (
      <div className={`${styles.wrapper_input} mb-5`}>
        <div className="chat_input w-3/4 mx-auto rounded-md flex flex-row" ref={inputRef}>
          <input onChange={(e) => handleChange(e)} type="text" placeholder="write a message..." className="p-4 w-9/12 outline-none" required />
        <div className="button w-3/12"> <button className="w-1/3 bg-blue-500 text-white p-4" onClick={() =>{
          setVideoCall(true);
          videoChatTo()
        }}>v</button>
          <button className="w-1/3 bg-slate-900 text-white p-4">f</button>
          <button onClick={() => { handleSend(message, selected,setMessage) }} className="bg-slate-900 text-white w-1/3 p-4 hover:bg-slate-800">S</button>
          </div>   </div>
      </div> 
    )}
    </>
   )}
  </div>
  )
}
