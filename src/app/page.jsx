'use client'

import { userContext } from "@/providers/UserContextProvider"
import { useRouter } from "next/navigation"
import { useContext, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"




  export default function Home() {
    const {id,name} = useContext(userContext)
    const router = useRouter()
  
   
    useEffect(()=> {

      {id && router.push('/user/chat')}
    },[id])
  
    
  
  return (
    <div className="home_wrapper w-full flex flex-row">
    <div className="left w-1/2 bg-gradient-to-r from-blue-900 to-blue-700 flex flex-col justify-center items-center">
      <h1 className="text-5xl font-bold px-8  leading-snug text-white text-center">Welcome to Unite</h1>
      <p className="px-10 mt-4 leading-normal text-white font-normal text-center">Connect with friends and make new ones on Messenger, the ultimate social platform.</p>
    </div>
    <div className="right w-1/2 relative">
      <div className="bg-cover bg-center h-full" style={{backgroundImage: "url('/nt.jpg')"}}>
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="absolute inset-0 flex flex-col justify-center items-center text-white">
          <div className="max-w-md text-center">
            <p className="leading-normal mb-4">Messenger is a chat app used worldwide for messaging, file sharing, and video calling. Renowned for its exceptional user experience and support.</p>
            <button onClick={() => router.push('/auth/register')} className="px-6 py-3 mr-4 rounded-md hover:bg-blue-800 hover:text-white bg-blue-100 text-black">Register</button>
            <button onClick={() => router.push('/auth/login')} className="px-6 py-3 rounded-md hover:bg-blue-800 hover:text-white bg-blue-100 text-black">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
  

  )
  }