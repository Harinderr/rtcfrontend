'use client'

import { userContext } from "@/providers/UserContextProvider"
import { useContext } from "react"
import axios  from "@/utility/axios"


export default function Dashboard() {
        const {name} = useContext(userContext)
        const firstletter = name.substring(0,1).toUpperCase() || 'ram'
        async  function handleLogout() {
            try {
               let res  = await axios.get('/logout')
               
               if(res.data){
                console.log('logout success')
               }   
            } catch (error) {
                throw new Error(error)
            }
        }

    return (
        <div className="container h-screen bg-slate-700 text-white ">
            <div className="wrapper w-1/2 mx-auto py-4 flex flex-col justify-start  ">
            <div className="image rounded-full bg-green-600 w-8 h-8 flex justify-center items-center">{firstletter}</div> 
            <h1 className="mt-2">{name}</h1>

            <div className="button">
                <button className="bg-red-700 text-white p-2 rounded-md" onClick={handleLogout} >Logout</button>
            </div>
            </div>
           

        </div>
    )
}