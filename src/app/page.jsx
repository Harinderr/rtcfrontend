"use client";
import Image from "next/image";
import People from "@/components/people/people";
import { handleOnlineUserData } from "@/func/handleonlineuser";
import Chatbox from "@/components/chatbox/chatbox";
import {  useContext, useEffect, useRef, useState } from "react";
import { userContext } from "@/providers/UserContextProvider";
import axios from "@/utility/axios";
import {  rtcContext } from "@/providers/rtcProvider";

export default function Home() {
  const [ws, setWs] = useState(null);
  
  const { id, name } = useContext(userContext);
  const [onlinePeople, setOnlinePeople] = useState(new Map());
  const [selected, setSelected] = useState("");
  
  
  const [callfrom, setCallfrom] = useState(false);
  const [callTo, setCallTo] = useState(false);
  // const [connection,updateConnection] = useState(null)
  // const [channel, updateChannel] = useState(null)
  const {connection,channel,updateChannel,setConnection}= useContext(rtcContext);
  // const {iceCdt,setIceCdt} = useState([])
  const [messages, setMessages] = useState([]);
  const [rtcMessages, setRtcmessages] = useState([])
  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const iceCandidatesStore  = [];
  
  


 
  

  //websocket
  function connnectToWs() {
    const ws = new WebSocket("ws://localhost:5000");

    setWs(ws);

    ws.onopen = (e) => {
      console.log("open");
    

    
    };


    ws.onmessage = async (e) => {
      let data = JSON.parse(e.data);

      if ("online" in data) {
        handleOnlineUserData(data, id)
          .then((val) => setOnlinePeople(val))
          .catch((err) => console.log("There is an error" + err));
      } else if(data.type == 'message') {
        
                
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

  const videoChatTo = () => {
     
  
    try  {
      let localconnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });

      

     
      const dataChannel = localconnection.createDataChannel("chat");
 
       dataChannel.onopen = () => console.log("connnection open");
       dataChannel.onmessage = (e) => console.log("ready to message" + e.data);
 
       dataChannel.onerror = (err) => console.log("error in channel creation",err);
 
       updateChannel(dataChannel);
      console.log(localconnection)
        
    
       localconnection
         .createOffer()
         .then((offer) => localconnection.setLocalDescription(offer))
         .then(() => {
           ws.send(
             JSON.stringify({
               type: "offer",
               offer: localconnection.localDescription,
               userTo: selected,
             })
           );
         })
         .catch((err) => console.log("cant create an offer",err));
      
         localconnection.onicecandidate = ({candidate}) => {
       
       
          if(selected && candidate){
          ws.send(JSON.stringify({
            type : 'candidate',
            userTo : selected,
            candidate
          }))} 
         
      }
 setConnection(localconnection)

     
 } catch(err) {
   console.log('on video to coonection no',err)
 }
     
   };

   const onOffer = async ({ offer,id }) => {
     setSelected(id)
     setCallfrom(true)
   

    try {
      let localconnection = new RTCPeerConnection({
        iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
      });
      localconnection.ondatachannel = (e) => {
        let remoteChannel = e.channel;
        remoteChannel.onopen = () => {
          console.log("channel is ready to use");
         
        };
        remoteChannel.onmessage = () => console.log("message here");
        updateChannel(remoteChannel);
      };;

     
        await localconnection.setRemoteDescription(new RTCSessionDescription(offer))
        const answer = await localconnection.createAnswer()
             await  localconnection.setLocalDescription(answer)
       
           
          ws.send(
            JSON.stringify({
              type: "answer",
              userTo: selected,
              answer: localconnection.localDescription,
            })
          );

          localconnection.onicecandidate = ({candidate}) => {
       
       
            if(selected){
            ws.send(JSON.stringify({
              type : 'candidate',
              userTo : selected,
              candidate
            }))} 
          }
           

          setConnection(localconnection)
        
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
   if(connection) {
     await connection.addIceCandidate(new RTCIceCandidate(candidate))
      console.log('candidates set')}
  }
  catch(err){console.log('cant set the candidates',err)}
  };


  // messeges on load
  useEffect(() => {
    async function fetchMessages() {
      try {
        let res = await axios.get(`/messages/${selected}`);
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
         videoChatTo={videoChatTo}
          handleSend={handleSend}
          selected={selected}
          messages={messages}
          chatRef={chatRef}
          inputRef={inputRef}
          connection={connection}
          callfrom={callfrom}
        ></Chatbox>
      </div>
    </div>
  );
}
