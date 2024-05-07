import { useState, useContext, useEffect } from "react";
import styles from "./chat.module.css";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data'
import { userContext } from "@/providers/UserContextProvider";
import VideoChat from "../videochat/videochat";
import { init } from 'emoji-mart'



import {
  channelContext,
  connectionContext,
  rtcContext,
} from "@/providers/rtcProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFaceSmile,
  faPaperPlane,
  faVideo,
} from "@fortawesome/free-solid-svg-icons";

export default function Chatbox({
  callfrom,
  videoChatTo,
  handleSend,
  selected,
  chatRef,
  inputRef,
  messages,
}) {
  init({ data })
  const [message, setMessage] = useState("");
  const { id, name } = useContext(userContext);
  const [videocall, setVideoCall] = useState(false);
  const [me,setme]= useState(null)
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
 
  return (
    <div className={` ${styles.chatbox}  w-full bg-[#F0F0F0] `}>
      {videocall || callfrom ? (
        <VideoChat></VideoChat>
      ) : (
        <>
          {" "}
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
                      className={`chat p-4 rounded-md mb-3 ${
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
              <h1 className="text-2xl text-center font-bold  ">
                Select the user to see Chat
              </h1>
            )}
          </div>
          {selected && (
        
            <div className={`${styles.wrapper_input} mb-5 relative overflow-visible`}>
             <div className="picker absolute -top-96 right-4"> {emojiPickerVisible && (
                <Picker data={data} emojiSize={20} emojiButtonSize={28} onEmojiSelect={handleEmoji}  className='' />
             )}
             </div> 
                        <div
                className="chat_input w-3/4 mx-auto rounded-md flex flex-row"
                ref={inputRef}
              >
                <input
                  onChange={(e) => handleChange(e)}
                  type="text"
                  value={message}
                  placeholder="write a message..."
                  className="p-4 w-9/12 outline-none"
                  required
                />
                <div className="button w-3/12">
                  {" "}
                  <button
                    className="w-1/3 bg-blue-500 text-white p-4"
                    onClick={() => {
                      setVideoCall(true);
                      videoChatTo();
                    }}
                  >
                    <FontAwesomeIcon icon={faVideo} />
                  </button>
                  <button className="w-1/3 text-white bg-green-500  p-4"
                  onClick={()=>setEmojiPickerVisible(!emojiPickerVisible)}
                  >
                    {" "}
                    <FontAwesomeIcon icon={faFaceSmile} />
                  </button>
                 
                  <button
                    className="bg-slate-900 text-white w-1/3 p-4 hover:bg-slate-800"
                    onClick={() => {
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
      )}
    </div>
  );
}
