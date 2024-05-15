"use client";
import Image from "next/image";
import People from "@/components/people/people";
import { handleOnlineUserData } from "@/func/handleonlineuser";
import Chatbox from "@/components/chatbox/chatbox";
import {  useContext, useEffect, useRef, useState } from "react";
import { userContext } from "@/providers/UserContextProvider";
import axios from "@/utility/axios";
import {  rtcContext } from "@/providers/rtcProvider";

export default function Chat() {
  const [ws, setWs] = useState(null);
  
  const { id, name } = useContext(userContext);
  const [onlinePeople, setOnlinePeople] = useState(new Map());
  const [selected, setSelected] = useState("");
   const [callfrom, setCallfrom] = useState(false);
  const [callTo, setCallTo] = useState(false);
   const {connection,channel,updateChannel,setConnection,createOffer,createAnswer}= useContext(rtcContext);
  const [messages, setMessages] = useState([]);
  const [rtcMessages, setRtcmessages] = useState([])
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  
  //websocket
  function connnectToWs() {
    const ws = new WebSocket("ws://witty-graceful-winterberry.glitch.me");

    setWs(ws);

    ws.onopen = (e) => {
      console.log("open");
    

    
    };


    ws.onmessage = async (e) => {
      let data = JSON.parse(e.data);
     
      if (data.online) {
        handleOnlineUserData(data, id)
          .then((val) => setOnlinePeople(val))
          .catch((err) => console.log("There is an error" + err));
      }
      else if (data.type == 'message') {
        
            console.log(data) 
          setMessages((prev) => {
            if (prev.some((val) => val.msgId == data.msgId)) {
              // If it exists, return the previous state as is
              return prev;
            } else {
              // If it doesn't exist, add the new data to the previous messages
              return [...prev, data];
            }
          });
        
      }
          else {
           setRtcmessages(prev => [...prev,data])
          }
    };
    ws.onclose = (e) => {
      setTimeout(() => {
        connnectToWs();
      }, 100);
    };
  }
  // messageinput data
  const handleSend = async (message, recId, setMessage) => {
    if (message.length) {
      ws.send(
        JSON.stringify({
          type: "message",
          des: message,
          receiverId: recId,
        })
      );

      setMessages((prev) => [
        ...prev,
        { des: message, receiverId: recId, senderId: id },
      ]);
      setMessage("");
    }
  };

  const videoChatTo = async () => {
     try  {
      const dataChannel = connection.createDataChannel("chat");

    dataChannel.onopen = () => console.log("connnection open");
    dataChannel.onmessage = (e) => console.log("ready to message" + e.data);

    dataChannel.onerror = (err) => console.log("error in channel creation", err);

    updateChannel(dataChannel);
    
     const offer = await createOffer()
      ws.send(
        JSON.stringify({
          type: "offer",
          offer: offer,
          userTo: selected,
           })
      );
      connection.onicecandidate = ({candidate}) => {
        if(selected && candidate){
          console.log('this is candidates')
      ws.send(JSON.stringify({
       type : 'candidate',
       userTo : selected,
       candidate
      }))} 
      
      }
      } catch(err) {
   console.log('on video to coonection no',err)
 }
     
   };

   const onOffer = async ({ offer,id }) => {
     setSelected(id)
     setCallfrom(true)
     

   try {

     connection.ondatachannel = (event)=> {
        const rdc = event.channel
        updateChannel(rdc)
        rdc.onopen = ()=> {
          console.log('connection is open')
        }

        rdc.onmessage = (e) => {
          console.log('message here',e.data)
        }
     }
      const answer = await createAnswer(offer)
         ws.send(
            JSON.stringify({
              type: "answer",
              userTo: id,
              answer: answer,
            })
          );

          connection.onicecandidate = ({candidate}) => {
            if(selected && candidate){
              console.log('this is candidates')
          ws.send(JSON.stringify({
           type : 'candidate',
           userTo : selected,
           candidate
          }))} 
          
          }
         } catch(err) {
        console.log('cant create answer',err)
       }
    }


    
  // on answer from peer
   const onAnswer = async ({ answer }) => {
    console.log('this is the answer',answer)
   
   await connection.setRemoteDescription(new RTCSessionDescription(answer));
  };

  // on ice candidates from peer
   const onCandidates = async({ candidate }) => {
    
  try{
   if(connection && (candidate != null)) {
     await connection.addIceCandidate(new RTCIceCandidate(candidate))
      console.log('candidates set')}
  }
  catch(err){console.log('cant set the candidates',err)}
  };


  const endCall = () => {
    if(connection){
      connection.close()
     
    }
  }

  // messeges on load
  useEffect(() => {
    async function fetchMessages() {
      try {
        let res = await axios.get(`/messages/${selected}`);
        // console.log(res)
        setMessages(res.data);
      } catch (err) {
        console.log("there is an error");
      }
    }
    fetchMessages();
  }, [selected]);

  useEffect(() => {
    connnectToWs();
  }, []);
  useEffect(() => {
    // Scroll to the bottom of the chatbox whenever messages change
    chatRef.current != null &&
      (chatRef.current.scrollTop = chatRef.current.scrollHeight);
      // let lastone = []
      //  lastone.push(messages[messages.length - 1]) 
      // setLastmsg(lastone)
  }, [messages]);



  useEffect(()=> {
    if (rtcMessages.length == 0) return; 
    let data = rtcMessages.pop()
    switch (data.type) {
      case "offer":
        {
          if (data.offer) {
            console.log("this is offer", data);
            document.getElementById("callFrom").classList.remove("hidden");
            document.getElementById("callFrom").classList.add("flex");

            document.getElementById("accept").onclick = (e) => {
             e.preventDefault()
             setCallfrom(true)
              onOffer(data);
              document.getElementById("callFrom").classList.remove("flex");
              document.getElementById("callFrom").classList.add("hidden");
            };
            document.getElementById("decline").onclick = () => {
              onCallReject("call rejected");
              document.getElementById("callFrom").classList.remove("flex");
              document.getElementById("callFrom").classList.add("hidden");
            };
          }
        }
        break;
      case "answer":
        {
          console.log('this is answer',data.answer);
          onAnswer(data);
        }
        break;
      case "candidate":
        {
          console.log('these are candidats',data.candidate)
          onCandidates(data);
        }
        break;
     case "close" : {
      console.log('connection closed')
      endCall()
     }break;
      default:
        {
          console.log("nothing found here");
        }
        break;
    }
  },[rtcMessages])

//  console.log(iceCandidatesStore)
  return (
    <div className="relative">
      <div
        id="callFrom"
        className="wrapper  bg-slate-300  p-4 absolute left-1/2 transform -translate-x-1/2 hidden justify-between h-18 rounded-2xl  w-1/3 z-10 shadow-md"
      >
        <button
          id="accept"
          className="bg-green-500 w-1/4 p-3 rounded-xl hover:bg-green-300"
        >
          Accept
        </button>
        <button
          id="decline"
          className="bg-red-600 w-1/4 p-3 rounded-xl hover:bg-red-400"
        >
          Decline
        </button>
      </div>

      <div className="flex flex-row overflow-hidden ">
        <People
          onlinePeople={onlinePeople}
          messages={messages}
          setSelected={setSelected}
          selected={selected}
          
        ></People>
        <Chatbox
        
        setCallfrom={setCallfrom}
         videoChatTo={videoChatTo}
          handleSend={handleSend}
          selected={selected}
          messages={messages}
          chatRef={chatRef}
          inputRef={inputRef}
          connection={connection}
          callfrom={callfrom}
          ws = {ws}
        ></Chatbox>
      </div>
    </div>
  );
}
