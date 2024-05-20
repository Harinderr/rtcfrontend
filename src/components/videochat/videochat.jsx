import { useEffect, useRef, useState, useContext, useCallback } from "react";
import { rtcContext } from "@/providers/rtcProvider";
import { MdCallEnd } from "react-icons/md";
import { FaVideo } from "react-icons/fa6";
import { AiFillAudio } from "react-icons/ai";
import styles from './videochat.module.css'
export default function VideoChat({ callend,setVideoCall ,setCallfrom ,callfrom,ws,selected}) {

  const { connection,channel,createOffer, stream ,setConnection} = useContext(rtcContext);
  const remoteVideoRef = useRef(null);
  const localVideoRef = useRef(null);
  const [text,setText] = useState('')
  const [video,setVideo] = useState(null)
  const [audioActive, setAudioActive] = useState(true)
  const [videoActive, setVideoActive] = useState(true)
  const [audioTracks, setAudioTracks] = useState(null)
  const [videoTracks, setVideoTracks] = useState(null)
  

  
  const handleNego = useCallback(async()=> {
    const offer =  await createOffer()
    ws.send(JSON.stringify({
          type: "offer",
          offer: offer,
          userTo: selected
    }))
  },[])

  useEffect(()=> {
   connection && connection.addEventListener('negotiationneeded',handleNego)
  },[connection])


useEffect(() => {
  const streamData = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio : true}) ;
    let atrack  = stream.getAudioTracks()[0]
    let vtrack = stream.getVideoTracks()[0]
    setAudioTracks(atrack)
    setVideoTracks(vtrack)
    localVideoRef.current.srcObject = stream;
    setVideo(stream)
  //   for (const track of stream.getTracks()){
  //     console.log('added tracks')
  //     connection.addTrack(track,videoTracks)
  //     console.log(track)
  // }
  connection.addTrack(vtrack,stream)
  connection.addTrack(atrack,stream)
    
    }
    connection && streamData()
    return () => {
      if (videoTracks && audioTracks) {
        videoTracks.stop()
        audioTracks.stop()
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
    if (videoTracks) {
      videoTracks.stop();
      setVideoTracks(null)
    }
    if (audioTracks) {
      audioTracks.stop();
      setAudioTracks(null)
    }
    setVideoCall(false);
    setCallfrom(false);
   remoteVideoRef.current = null
    setVideo(null)
    setConnection(null)
  ws.send(JSON.stringify({
        type : 'close',
        userTo : selected
      }))
    }

    function handleVideo() {
      if(videoTracks){
        console.log(videoTracks.enabled)
      videoTracks.enabled = !videoTracks.enabled;
      setVideoTracks(videoTracks);
    }
    setVideoActive(!videoActive)
    }
    function handleAudio() {
      if(audioTracks){
      audioTracks.enabled = !audioTracks.enabled;
      setAudioTracks(prevTrack => ({ ...prevTrack }));
    }
    setAudioActive(!audioActive)
    }

    useEffect(()=> {
        callend && endCall()
    },[callend])

  return (
     <> 
     {/* <input type="text" name="msg" className="w-full" onChange={(e)=> setText(e.target.value)} /> */}
      {/* <button onClick={sendStream}>Send</button> */}
    <div id="video" className="main bg-slate-700 h-full w-full relative">
      <div className={`${styles.video_chat} flex flex-row w-full h-full`}>
       
           <video
            id="localVideo"
            className="h-1/2 w-full"
            ref={localVideoRef}
            autoPlay
          />
       
        <video
          id="remoteVideo"
          className="h-1/2 w-full"
          ref={remoteVideoRef}
          autoPlay
        /> 

      
      </div>
      <div className="controls w-full absolute bottom-6 ">
        <div className="button_wrapper w-1/3 mx-auto flex flex-row justify-around">
          <div onClick={()=> handleVideo() } className={`button p-4 h-16 w-16 rounded-full video  cursor-pointer flex items-center justify-center ${videoActive ? 'bg-blue-500': 'bg-slate-500'}`} ><FaVideo className = 'text-2xl' /></div>
          <div onClick={()=> handleAudio()}  className={`button w-16 h-16 rounded-full p-4 audio cursor-pointer flex items-center justify-center ${audioActive ? 'bg-blue-500': 'bg-slate-500'}`}><AiFillAudio className = 'text-2xl' /></div>
          <div className="button w-16 h-16 rounded-full p-4 end_call bg-red-500 cursor-pointer flex items-center justify-center" onClick={endCall}><MdCallEnd className = 'text-2xl' /></div>
        </div>
      </div>
    </div>
    </>
  );
}
