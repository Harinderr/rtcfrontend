"use client"
const { createContext, useState, useEffect, useRef, useMemo } = require("react");

export const rtcContext = createContext();

export default function RTCcontextProvider({ children }) {
 const [connection,setConnection] = useState(null)
  const [channel, setChannel] = useState(null);
//   const [stream, setStream] = useState(null)

  const updateChannel = (chn) => {
    setChannel(chn);
  };

  const peer = useMemo(
    () =>
      new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      }),
    []
  );




  const createOffer = async () => {
    const offer = await connection.createOffer()
   
   await connection.setLocalDescription(offer)
   return offer
 }

 const createAnswer = async (offer) => {
  
    await connection.setRemoteDescription(new RTCSessionDescription(offer))
    const answer = await connection.createAnswer()
  
    await connection.setLocalDescription(answer)
    return answer
    
 }

 useEffect(()=> {
  setConnection(peer)
 },[peer])

  return (
    <rtcContext.Provider
      value={{ connection, channel, updateChannel,createOffer,createAnswer,setConnection }}
    >
      {children}
    </rtcContext.Provider>
  );
}
