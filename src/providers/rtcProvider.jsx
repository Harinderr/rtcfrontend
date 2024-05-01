'use client'
const { createContext, useState, useEffect, useRef } = require("react");

export const rtcContext= createContext()

export default function RTCcontextProvider({children}) {
    const [connection, setConnection] = useState(null)
    const [channel, setChannel] = useState(null)
    
    const updateChannel =(chn) => {
        setChannel(chn)
    }



  
   
     
console.log(connection)
   
      return (
        <rtcContext.Provider value={{connection,channel,updateChannel,setConnection}}>
            {children}
        </rtcContext.Provider>
    )
}