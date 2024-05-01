import { useEffect, useRef, useState, useContext } from "react";
import { rtcContext } from "@/providers/rtcProvider";

export default function VideoChat() {
  const [stream, setStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const remoteRef = useRef(null);
  const localRef = useRef(null);
  const { connection } = useContext(rtcContext);

  async function userStream() {
  try { const localvideo = await navigator.mediaDevices.getUserMedia({video:true})
    setStream(localvideo);
    if (localRef.current) { // Check if localRef is available
      localRef.current.srcObject = localvideo;
    } else {
      console.error("Local video element not found.");
    }} catch(err) {
      console.log('eror in local video', err)
    }
  }

  useEffect(() => {
    userStream(); // Call the function to get user media stream

    // Check if the connection state is 'connected'
    if (connection && connection.connectionState === "connected") {
      // Iterate over each track in the stream and add it to the connection
      stream.getTracks().forEach((track) => {
        connection.addTrack(track, stream);
      });

      // Set up event listener for incoming tracks
      connection.ontrack = (event) => {
        // Attach incoming track to a video element for display
        const remoteVideo = remoteRef.current;
        if (remoteVideo) {
          setRemoteStream(event.streams[0]);
          remoteVideo.srcObject = event.streams[0];
        } else {
          console.error("Remote video element not found.");
        }
      };
    }
  }, []); // Depend on connection and stream for updates

  return (
    <div id="video" className="main bg-slate-700 h-full w-full relative">
      <div className="container flex flex-row w-full h-full">
        {stream && (
          <video
            id="local"
            className="h-full w-1/2"
            ref={localRef}
            autoPlay
          />
        )}
        {remoteStream && (
          <video
            id="remote"
            ref={remoteRef}
            className="h-full w-1/2"
            autoPlay
          />
        )}
      </div>
      <div className="controls w-full absolute bottom-6 ">
        <div className="button_wrapper w-1/3 mx-auto flex flex-row justify-around">
          <div className="button p-4 h-16 w-16 rounded-full video bg-red-600">
            v
          </div>
          <div className="button w-16 h-16 rounded-full p-4 audio bg-red-600">
            a
          </div>
          <div className="button w-16 h-16 rounded-full p-4 end_call bg-red-500">
            end
          </div>
        </div>
      </div>
    </div>
  );
}
