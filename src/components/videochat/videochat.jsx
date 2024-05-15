import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { rtcContext } from "@/providers/rtcProvider";
import { MdCallEnd } from "react-icons/md";

export default function VideoChat({ setVideoCall ,setCallfrom ,callfrom,ws,selected}) {

  const { connection,channel,createOffer, stream ,setConnection} = useContext(rtcContext);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [text,setText] = useState('')
  const [video,setVideo] = useState(null)

  const sendStream = useCallback(async ()=> {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true }) ;
    localVideoRef.current.srcObject = stream;
    for (const track of stream.getTracks()){
      console.log('added tracks')
      connection.addTrack(track,stream)
      console.log(track)
    }
    
  },[])

  console.log(connection)
  const handleNego = useCallback(async()=> {
    const offer =  await createOffer()
    ws.send(JSON.stringify({
          type: "offer",
          offer: offer,
          userTo: selected
    }))
  },[])

  useEffect(()=> {
    connection.addEventListener('negotiationneeded',handleNego)
  },[connection])


useEffect(() => {
  const streamData = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true }) ;
    localVideoRef.current.srcObject = stream;
    setVideo(stream)
    for (const track of stream.getTracks()){
      console.log('added tracks')
      connection.addTrack(track,stream)
      console.log(track)
  }
    
    }
    connection && streamData()
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          track.stop(); // Stop all tracks
        });
        connection.close()
        
       
      }
    }

    
  },[connection])


  useEffect(() => {
    connection.ontrack = (event) => {
      console.log('tracks received');
   console.log(event)
    remoteVideoRef.current.srcObject =  event.streams[0]
    }
  }, [connection]);
 

  const endCall = () => {
    setVideoCall(false);
    setCallfrom(false);
    
    setVideo(null)
  ws.send(JSON.stringify({
        type : 'close',
        userTo : selected
      }))
    }


  return (
     <> 
     {/* <input type="text" name="msg" className="w-full" onChange={(e)=> setText(e.target.value)} /> */}
      {/* <button onClick={sendStream}>Send</button> */}
    <div id="video" className="main bg-slate-700 h-full w-full relative">
      <div className="container flex flex-row w-full h-full">
       
          <video
            id="localVideo"
            className="h-full w-1/2"
            ref={localVideoRef}
            autoPlay
          />
       
        <video
          id="remoteVideo"
          className="h-full w-1/2"
          ref={remoteVideoRef}
          autoPlay
        />
      </div>
      <div className="controls w-full absolute bottom-6 ">
        <div className="button_wrapper w-1/3 mx-auto flex flex-row justify-around">
          <div className="button p-4 h-16 w-16 rounded-full video bg-red-600">v</div>
          <div className="button w-16 h-16 rounded-full p-4 audio bg-red-600">a</div>
          <div className="button w-16 h-16 rounded-full p-4 end_call bg-red-500 cursor-pointer" onClick={endCall}><MdCallEnd /></div>
        </div>
      </div>
    </div>
    </>
  );
}
