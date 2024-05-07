'use client'

import { useContext, useEffect, useState } from "react"
import axios from '@/utility/axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
import { userContext } from "@/providers/UserContextProvider"
import { IoSearchOutline } from "react-icons/io5";



export default function Addpeople(){
    const [search, setSearch] = useState('')
    const [data, setData] = useState([])
    const [click, setClick] = useState('')
    const {id} = useContext(userContext)
    const handleChange = (e) => {
        
        const { value } = e.target
        setSearch(value)
    }

    async function fetchData() {
        try {
            const response = await axios.post('/addpeople',{ data : search,userid : id})
               setData(response.data)
        }
       catch(err){
        console.log('ther is an error')
       }
    }

    const addFriend = async () => {
      try  {  
        const res = await axios.post('/add',{userid: id, friendId : click})
    } catch(err) {
        console.log(`can't fetch data`,err)
    }
    }

    useEffect(  ()=> {
        
     const timer = setTimeout(() => {
        fetchData()
     },2000); 
     return ()=> {
        clearTimeout(timer)
     } 
    },[search])


    return (
        <div className="container h-screen bg-slate-700  ">
            <div className="wrapper mx-auto w-1/4 rounded-full flex flex-row my-10 ">
                <input type="text" className="p-4 w-3/4 " onChange={(e)=> handleChange(e)}/>
                <div onClick={()=>fetchData()} className="bg-white w-1/4 text-black p-4 "><IoSearchOutline className="text-2xl" /></div>
            </div>

                
                
        { search.length != 0 ?  ( data.map((val,index) => {
            return (
                <div key={index} className="person mb-2 w-1/4 text-white bg-slate-800 flex flex-row justify-between items-center text-2xl p-4 px-6 mx-auto rounded-md">
               <div className="profile w-1/2 flex flex-row gap-x-2">
               <div className="img rounded-full h-10 w-10 m-0 text-center bg-green-500">H</div>
               <div className="name">{val.name}</div>
               </div>
                
                <FontAwesomeIcon icon={faPlus} className="hover:text-blue-500" onClick={()=> {
                    setClick(val.id)
                    addFriend()
                }} ></FontAwesomeIcon>
            </div>
            )
           }) ):
           <div className=" text-center text-2xl text-white">Search to get results</div>
           }
        </div>
    )
}