import { useState, useContext, useEffect } from "react";
import styles from './chat.module.css'
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { userContext } from "@/providers/UserContextProvider";
import VideoChat from "../videochat/videochat";
import { init } from 'emoji-mart'
import { ImAttachment } from "react-icons/im";


import {
  channelContext,
  connectionContext,
  rtcContext,
} from "@/providers/rtcProvider";
import { IoMdArrowRoundBack } from "react-icons/io";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faPaperPlane,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

export default function SmChatbox({
 
  callfrom,
  videoChatTo,
  handleSend,
  selected,
  chatRef,
  inputRef,
  messages,
  setCallfrom,
  ws,
  callend,
  active,
  setActive,
 windowWidth,
 selectedName,
 onlinePeople
  
}) {
  init({ data })
  const [message, setMessage] = useState("");
  const { id, name } = useContext(userContext);
  const [videocall, setVideoCall] = useState(false);
  const [emojiPickerVisible,setEmojiPickerVisible] = useState(false)
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  // console.log(callfrom);
const handleEmoji = (e) => {
const sym = e.unified.split('_')
const arr = [];
sym.forEach((val)=> arr.push('0x'+val))

let emoji = String.fromCodePoint(...arr)
console.log(emoji)
setMessage(message + emoji)
}

useEffect(()=> {
  let el  = document.getElementById('ch_box')
  if(windowWidth < 500) {
    if (active)
      { el.style.display = 'block'}
 else{
  el.style.display = 'none'
 }
  }

},[active])


 
  return (
    <div id="ch_box" className={` ${styles.chatbox} relative   w-full bg-[#F0F0F0]  `}>

      {videocall || callfrom  ? (
      <VideoChat callend={callend} setVideoCall={setVideoCall} ws={ws} selected={selected} callfrom={callfrom} setCallfrom={setCallfrom}></VideoChat>
      ) : (
        <>
          {" "}
          <div className="chat_with flex flex-row   items-center absolute top-0 left-0 w-full bg-slate-200 p-3 shadow-md hover:bg-slate-300">
          <div className="mr-4" 
          onClick={()=> setActive(false)}
          >
          <IoMdArrowRoundBack  className="text-2xl"/>
          </div>
          <span className={`inline-block  w-2 h-2 ${onlinePeople.has(selected) ? 'bg-green-600': 'bg-red-600'}  rounded-full mr-2`}></span>
          <div className="name font-bold text-xl">{selectedName}</div>

          </div>
         
          <div className={` p-4 w-full h-5/6 overflow-y-scroll`} ref={chatRef}>
            {selected ? (
             
                
              <div className="chat-messages flex  flex-col">
                
                {messages.map((val, index) => (
                  <div
                    className={`wrapper  max-w-lg  ${
                      val.senderId == id ? "self-end" : "self-start"
                    }`}
                    key={index}
                  >
                    <div
                      className={`${styles.chat} p-4 rounded-md mb-3 ${
                        val.senderId == id
                          ? "text-white bg-gradient-to-r from-blue-900 to-purple-800"
                          : "text-white bg-slate-400"
                      }`}
                    >
                      {val.des}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className={`${styles.nouserBox} h-full w-full overflow-hidden`}>
                <Image className="mx-auto  " src={'/Designer.png'} alt="no image" width={350} height={350}></Image>
              <h1 className="text-center text-4xl font-bold overflow-y-hidden">
              Let  Bring the World closer with Unite
              </h1>
              </div>
            )}
          </div>
          {selected && (
        
            <div className={`${styles.wrapper_input} mb-5 relative overflow-visible`}>
             <div className="picker absolute -top-96 right-4"> {emojiPickerVisible && (
                <Picker data={data} emojiSize={20} emojiButtonSize={28} onEmojiSelect={handleEmoji}  className='' />
             )}
             </div> 
                        <div
                className={`${styles.chat_input}  w-3/4 mx-auto rounded-md flex flex-row`}
                ref={inputRef}
              >
                 <button className=" bg-white  p-4"
                  onClick={()=>setEmojiPickerVisible(!emojiPickerVisible)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faFaceSmile} className="text-slate-400"/>
                  </button>
                <input
                  onChange={(e) => handleChange(e)}
                  type="text"
                  value={message}
                  placeholder="write a message..."
                  className="p-4 w-10/12 outline-none"
                  required
                />
                <div className={`${styles.sendBtn} w-3/12 flex flex-row`}>
                  {" "}
                  <button
                  type="file"
                    className="w-1/3 bg-white p-4"
                    onClick={() => {
                     
                    }}
                  >
                    <ImAttachment className="text-slate-400" />
                  </button>
                  <button
                    className="w-1/3 bg-white p-4"
                    onClick={() => {
                      setVideoCall(true);
                      videoChatTo();
                    }}
                  >
                    <FontAwesomeIcon icon={faVideo} className="text-slate-400"/>
                  </button>
                 
                 
                  <button
                    className="bg-slate-900 text-white w-1/3 p-4 hover:bg-slate-800"
                    onClick={() => {
                      // channel.send(message)
                      handleSend(message, selected, setMessage);
                      setEmojiPickerVisible(!emojiPickerVisible)
                    }}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faPaperPlane} />
                  </button>
                </div>{" "}
              </div>
            </div>
          )}
        </>
      )
      }
    </div>
  );
}
