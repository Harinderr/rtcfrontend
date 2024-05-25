'use client'

import { userContext } from "@/providers/UserContextProvider"
import { useContext } from "react"
import axios from "@/utility/axios"
import { useRouter } from "next/navigation"

export default function Dashboard() {
    const { id, name, setId, setName,setAuthenticated } = useContext(userContext)
    const router = useRouter()
    const firstletter = name ? name.substring(0, 1).toUpperCase() : 'R'

    async function handleLogout() {
        try {
            const res = await axios.get('/logout')
            if (res.data) {
                console.log('logout success')
                setId(null)
                setName(null)
                setAuthenticated(false)
                router.push('/')
            }
        } catch (error) {
            console.error('Logout failed', error)
        }
    }

    return (
        <div className="h-screen bg-slate-700 text-white flex items-center justify-center">
            <div className="wrapper w-full max-w-md mx-auto py-8 px-4 bg-slate-800 rounded-lg shadow-lg flex flex-col items-center">
                <div className="image rounded-full bg-green-600 w-16 h-16 flex justify-center items-center text-2xl font-bold">
                    {firstletter}
                </div>
                {name && (
                    <h1 className="mt-4 text-3xl font-semibold overflow-hidden">
                        {name}
                    </h1>
                )}
                <div className="mt-8">
                    <button 
                        className="bg-red-700 hover:bg-red-800 text-white p-2 rounded-md transition duration-300"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    )
}
