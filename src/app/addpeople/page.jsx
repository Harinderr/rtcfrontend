'use client'

import { useContext, useEffect, useState } from "react"
import axios from '@/utility/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { userContext } from "@/providers/UserContextProvider"
import { IoSearchOutline } from "react-icons/io5"

export default function Addpeople() {
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [msg, setmsg]= useState(false)
    
    const { id } = useContext(userContext)

    const handleChange = (e) => {
        setSearch(e.target.value)
    }
    
    const handleClick = () => {
        setmsg(false)
    }
  

    const fetchData = async () => {
        try {
            const response = await axios.post('/addpeople', { data: search, userid: id })
            setData(response.data)
           
        } catch (err) {
            console.log('There is an error:', err)
        }
    }

    const addFriend = async (fd) => {
        try {
         const res  =   await axios.post('/add', { userid: id, friendId: fd })
         setmsg(true)
        } catch (err) {
            console.log(`Can't fetch data:`, err)
        }
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchData()
        }, 2000)
        return () => clearTimeout(timer)
    }, [search])

    useEffect(() => {
        const fetchFriends = async () => {
            const friends = await axios.post('/friends', {userId : id})
            console.log(friends)
        }
        fetchFriends()
    },[])
   
    return (
        <div className="h-screen relative bg-gray-900 flex flex-col items-center py-10 px-10">
         { msg &&   <div id="msg_box" className="msg absolute flex flex-row justify-between top-10 right-10 h-16 w-48 p-4 rounded-lg bg-green-500 text-white">
                <p>User added as friend</p>
                <div className="text-black cursor-pointer" onClick={handleClick}>Cut</div>
            </div>}
            <div className="wrapper w-full max-w-lg rounded-full flex items-center bg-white shadow-lg">
                <input
                    type="text"
                    className="p-4 w-full  rounded-l-full focus:outline-none"
                    onChange={handleChange}
                    value={search}
                    placeholder="Search for people..."
                />
                <div
                    onClick={fetchData}
                    className="bg-blue-500 text-white p-4 rounded-r-full cursor-pointer flex items-center justify-center hover:bg-blue-600"
                >
                    <IoSearchOutline className="text-2xl" />
                </div>
            </div>

            {
                <div className="results w-full max-w-lg mt-5 overflow-y-scroll">
                    {data.map((val, index) => (
                        <div
                            key={index}
                            className="person mb-4 p-4 flex items-center justify-between bg-gray-800 text-white rounded-lg shadow-lg"
                        >
                            <div className="profile flex items-center gap-4">
                                <div className="img rounded-full h-12 w-12 flex items-center justify-center bg-green-500 text-white text-lg">
                                    {val.name.charAt(0)}
                                </div>
                                <div className="name text-lg">{val.name}</div>
                            </div>
                            <FontAwesomeIcon
                                icon={faPlus}
                                className="hover:text-blue-500 cursor-pointer"
                                onClick={() => {
                                addFriend(val.id)
                                }}
                            />
                        </div>
                    ))}
                </div>
            }
        </div>
    )
}
