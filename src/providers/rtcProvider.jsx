"use client"
const { createContext, useState, useEffect, useRef, useMemo } = require("react");

export const rtcContext = createContext();

export default function RTCcontextProvider({ children }) {
  const [connection, setConnection] = useState(null);
  const [channel, setChannel] = useState(null);

  const updateChannel = (chn) => {
    setChannel(chn);
  };

  const createOffer = async () => {
    if (connection) {
      const offer = await connection.createOffer();
      await connection.setLocalDescription(offer);
      return offer;
    }
  };

  const createAnswer = async (offer) => {
    if (connection) {
      await connection.setRemoteDescription(new RTCSessionDescription(offer));
      const answer = await connection.createAnswer();
      await connection.setLocalDescription(answer);
      return answer;
    }
  };

  useEffect(() => {
    // Ensure this runs only in the browser
    if (typeof window !== 'undefined') {
      const peer = new RTCPeerConnection({
        iceServers: [{ urls: ["stun:stun.l.google.com:19302"] }],
      });
      setConnection(peer);
    }
  }, []); // Empty dependency array means this runs once on mount

  return (
    <rtcContext.Provider
      value={{ connection, channel, updateChannel, createOffer, createAnswer, setConnection }}
    >
      {children}
    </rtcContext.Provider>
  );
}
