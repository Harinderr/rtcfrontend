'use client'
import { signIn } from "next-auth/react";
import { useContext, useState } from "react";
import axios from "@/utility/axios";
import { userContext } from "@/providers/UserContextProvider";
import { useRouter } from "next/navigation";

export default function LogIn() {
    const [formdata, setFormdata] = useState({});
    const { setName, setId } = useContext(userContext);
    const router = useRouter();

    function handleChange(e) {
        const { name, value } = e.target;
        setFormdata({ ...formdata, [name]: value });
    }

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let response = await axios.post('/login', formdata);
            if (response.status === 200) {
                console.log(response);
                setId(response.data.userid);
                setName(response.data.username);
                router.push('/user/chat');
            } else {
                console.log('error in fetching data');
            }
        } catch (err) {
            console.log('there is an error: ' + err);
        }
    }

    return (
       
        <div className="flex justify-center   bg-blue-100">
            
        <div  className=" p-10 rounded-lg shadow-2xl mt-8 w-2/5 mb-10  h-auto">
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
                <button type="submit" className="block  w-full bg-black text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out  hover:bg-white hover:text-black" onClick={(e) => handleSubmit(e)}>Sign In </button>
            </form>
             <div className="text-center mt-4">
                <span className="text-gray-600">OR</span>
            </div>
             <div onClick={() => signIn('google')} className="block mt-4 text-center w-full bg-black text-white font-semibold px-6 py-4 rounded-md transition duration-300 ease-in-out hover:bg-white hover:text-black cursor-pointer ">
                Sign In with Google
            </div> 
           
        </div>
        <div style={{backgroundImage: "url('/nt.jpg')"}} className="register_right  w-2/5  mt-8 mb-10 py-24 px-10">
            <h1 className="text-5xl font-bold  leading-snug text-white text-center">Welcome back to SignIn</h1>
            <p className="px-10 mt-4 leading-normal text-white font-normal text-center">Chat with your Friends, enjoy and share your experiences</p>
           
        </div>
    </div>
    
    );
}
