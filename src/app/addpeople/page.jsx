'use client'

import { useEffect, useState } from "react"
import axios from '@/utility/axios'
export default function Addpeople(){
    const [search, setSearch] = useState('')
    const handleChange = (e) => {
        
        const { value } = e.target
        setSearch(value)
    }

    useEffect(()=> {
      async function fetchData() {
        try {
            const response = await axios.post('/addPeople')
            console.log(response)
        }
       catch(err){
        console.log('ther is an error')
       }
    }},[])
    
    return (
        <div className="container h-screen bg-slate-400">
            <div className="wrapper mx-auto w-fit rounded-full mt-10 ">
                <input type="text" className="p-4 " onChange={(e)=> handleChange(e)}/>
                <button className="bg-slate-700 text-white p-4 ">Search</button>
            </div>
        </div>
    )
}