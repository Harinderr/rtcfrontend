'use client'
import { signIn } from "next-auth/react";
import { useContext, useEffect, useState } from "react";
import axios from "@/utility/axios";
import styles from './login.module.css'
import { userContext } from "@/providers/UserContextProvider";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Loader } from "lucide-react";

export default function LogIn() {
    const [formdata, setFormdata] = useState({});
    const { setName, setId ,id} = useContext(userContext);
    const [loading, setLoading] = useState(false)
    const [res, setres] = useState('')
    const router = useRouter();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    }
  

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            setLoading(true)
            let response = await axios.post('/login', formdata);
            if (response.status === 200) {
                setId(response.data.userid);
                setName(response.data.username);
                setLoading(false)
                router.push('/user/chat');
            } else {
               setres(response.data.result)
               setLoading(false)
            }
        } catch (err) {
            if (err.response) {
                setres(err.response.data.result || 'An error occurred');
            } else {
                setres('An unexpected error occurred');
            }
            setLoading(false)
        }
    }

    useEffect(()=> {
        id && router.push('/user/chat')
        
    },[])

    return (
       
        <div className="flex justify-center h-screen  bg-blue-100">
         <div className="login_wrapper flex flex-row h-fit">
        <div  className={` ${styles.login_box} p-10 w-1/2 rounded-lg shadow-2xl mt-8   mb-10  h-auto`}>
            <div className="text-2xl  font-bold text-gray-800 mb-4 text-center">Login</div>
            <form className="space-y-6">
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
                <button type="submit" disabled={loading} className="flex flex-row  w-full bg-black text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out  hover:bg-white hover:text-black" onClick={(e) => handleSubmit(e)}> 
                    {loading && <Loader></Loader>
                    }
                    <p className="mx-auto">Sign In</p>  </button>
                    {res && <p className="text-red-600">{res}</p>
                    }
            </form>
           
           
        </div>
        <div  style={{backgroundImage: "url('/nt.jpg')"}} className={`${styles.welcom_box}  w-1/2  mt-8 mb-10 py-24 px-10`}>
            <h1 className="text-5xl font-bold  leading-snug text-white text-center">Welcome back to SignIn</h1>
            <p className="px-10 mt-4 leading-normal text-white font-normal text-center">Chat with your Friends, enjoy and share your experiences <Link href={'/auth/register'} className="text-blue-500 cursor-pointer">Go to Register</Link></p>
           
        </div>
        </div>
    </div>
    
    );
}
