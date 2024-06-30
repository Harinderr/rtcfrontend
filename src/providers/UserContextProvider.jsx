'use client'
import { useRouter } from "next/navigation";
import axios from '@/utility/axios';
const { createContext, useState, useEffect, useCallback } = require("react");

export  const userContext = createContext()

export default function UserContextProvider({children}) {
    const [id, setId]  = useState('');
    const [name, setName] = useState('');
    const [authenticated, setAuthenticated] = useState(false)
    
    const profile = useCallback(async () => {
       try {
         const response = await axios.get('/user')
        // console.log(response)
        setName(response.data.username)
        setId(response.data.userid)
        if(response.data.username){
            setAuthenticated(true)
        }}
        catch(error){
            console.log('no one logged in ')
        }
    },[])
   
    useEffect( ()=> {
         profile() 
       },[id, name])
  
    return (
        <userContext.Provider value={{setId,id, name,setName,authenticated,setAuthenticated}}>
            {children}
        </userContext.Provider>
    )
}