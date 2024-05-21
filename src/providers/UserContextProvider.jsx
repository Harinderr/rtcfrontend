'use client'
import { useRouter } from "next/navigation";
import axios from '@/utility/axios';
const { createContext, useState, useEffect } = require("react");

export  const userContext = createContext()

export default function UserContextProvider({children}) {
    const [id, setId]  = useState('');
    const [name, setName] = useState('');
    const [authenticated, setAuthenticated] = useState(false)
    
 
   
    useEffect( ()=> {
        const profile = async () => {
            const response = await axios.get('/user')
            // console.log(response)
            setName(response.data.username)
            setId(response.data.userid)
            if(response.data.username){
                setAuthenticated(true)
            }
        }
    
   profile()
   
   
    },[id,name])
  
    return (
        <userContext.Provider value={{setId,id, name,setName,authenticated,setAuthenticated}}>
            {children}
        </userContext.Provider>
    )
}