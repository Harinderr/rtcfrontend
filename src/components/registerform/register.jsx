'use client'
import { signIn, useSession } from "next-auth/react";
import { useContext, useState } from "react";
import axios from '@/utility/axios';
import { userContext } from "@/providers/UserContextProvider";
import { useRouter } from "next/navigation";

export default function Signup() {
    
    const [formdata, setFormdata] = useState({})
   const {setName, setId} = useContext(userContext)
   const router = useRouter()
    function handleChange(e) {
        const {name, value} = e.target
         setFormdata({...formdata, [name] : value})
         
    }
    async function handleSubmit(e) {
        e.preventDefault();
         try {
            let response = await axios.post('/register',formdata)
            setId(response.data.userid)
            setName(response.data.username)
            router.push('/')

         }
          catch (err) {
            console.log('there is an erro' + err)
         }
    }
    return (
        // <div className="login_form h-fit py-8">
            
        //     <div className="wrapper rounded-lg py-8 flex flex-col px-4 gap-4 w-1/2 mx-auto bg-slate-800 ">
        //     <div className="title text-center text-xl text-white font-semibold">Register </div>
        //       <label className="text-white font-semibold" htmlFor="name">Name</label>  <input className="p-3" type="name" onChange={(e)=> handleChange(e)} name="name" placeholder="Enter your name..." />
        //     <label className="text-white font-semibold" htmlFor="email">Email</label>    <input className="p-3"  type="email" onChange={(e)=> handleChange(e)} name="email" placeholder="Enter your email..." />
        //     <label className="text-white font-semibold" htmlFor="password">Password</label>    <input className="p-3"  type="password" onChange={(e)=> handleChange(e)} name="password" placeholder="Enter your password..." />
        //         <button onClick={(e)=> handleSubmit(e)} className="w-full p-3 bg-slate-600 text-white">Submit</button>
        //    <div onClick={()=> signIn('google')} className="login w-full  p-3 font-medium text-xl text-center bg-slate-600 hover:bg-slate-500 text-white rounded-sm">
        //     Sign in with Google
        //    </div>
        //    </div>
        // </div>
        <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-10 rounded-lg shadow-md w-1/2 h-auto">
            <div className="text-2xl font-bold text-gray-800 mb-4 text-center">Register</div>
            <form className="space-y-4">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                    <input 
                        type="username" 
                        id="username" 
                        name="username" 
                        autoComplete="username" 
                        required 
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-6 py-4 bg-gray-200" 
                        onChange={(e) => handleChange(e)} 
                        placeholder="Enter your username..." 
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        autoComplete="email" 
                        required 
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-6 py-4 bg-gray-200" 
                        onChange={(e) => handleChange(e)} 
                        placeholder="Enter your email..." 
                    />
                </div>
                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        autoComplete="current-password" 
                        required 
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-6 py-4 bg-gray-200" 
                        onChange={(e) => handleChange(e)} 
                        placeholder="Enter your password..." 
                    />
                </div>
                <button type="submit" className="block w-full bg-blue-500 text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600" onClick={(e) => handleSubmit(e)}>Sign In</button>
            </form>
            <div className="text-center mt-4">
                <span className="text-gray-600">OR</span>
            </div>
            <div onClick={() => signIn('google')} className="block text-center w-full bg-blue-600 text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-700 cursor-pointer mt-2">
                Sign in with Google
            </div>
        </div>
    </div>
    
    )
}