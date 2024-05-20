'use client'
import { signIn, useSession } from "next-auth/react";
import { useContext, useState } from "react";
import axios from '@/utility/axios';
import styles from './register.module.css'
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

       
        <div className="flex justify-center   bg-blue-100">
            
        <div  className= {`${styles.register_box} p-10 rounded-lg shadow-2xl mt-8 w-2/5 mb-10  h-auto`}>
            <div className="text-2xl  font-bold text-gray-800 mb-4 text-center">Register</div>
            <form className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-grey-700">Username</label>
                    <input 
                        type="username" 
                        id="username" 
                        name="username" 
                        autoComplete="username" 
                        required 
                        className="mt-1  focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-6 py-4 bg-gray-200" 
                        onChange={(e) => handleChange(e)} 
                        placeholder="Enter your username..." 
                    />
                </div>
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-grey-700">Email</label>
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
                    <label htmlFor="password" className="block text-sm font-medium text-grey-700">Password</label>
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
                <button type="submit" className="block  w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out hover:bg-blue-600" onClick={(e) => handleSubmit(e)}>Sign Up </button>
            </form>
            {/* /* <div className="text-center mt-4">
                <span className="text-gray-600">OR</span>
            </div> */}
           
        </div>
        <div style={{backgroundImage: "url('/nt.jpg')"}} className={`${styles.welcom_box}  w-2/5  mt-8 mb-10 py-16 px-10`}>
            <h1 className="text-5xl font-bold px-8  leading-snug text-white text-center">Welcome to SignUp</h1>
            <p className="px-10 mt-4 leading-normal text-white font-normal text-center">Chat with your Friends, enjoy and share your experiences</p>
            <div onClick={() => signIn('google')} className="block mt-16 text-center w-full bg-white text-black font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out hover:bg-black hover:text-white cursor-pointer ">
                Sign up with Google
            </div> 
        </div>
    </div>
    
    )
}