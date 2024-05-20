"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from './smpeople.module.css'
import { userContext } from "@/providers/UserContextProvider";
import axios  from "@/utility/axios";
export default function SmPeople({windowWidth,active,setActive , setSelected ,selected,setSelectedName}) {
    const {id}= useContext(userContext)
    const [friends, setFriends] = useState([])
    const [store, setStore] = useState([])
   
    
                
   function handleChange(e) {
    let val = (e.target.value).toLowerCase()
   if(val.length == 0) {
    setFriends(store)
    return
   }
 
    let filterlist = store.filter(v => v.username.toLowerCase().startsWith(val))
    setFriends(filterlist)
   }
 
    useEffect(()=> {
   
      if(id){ 
     
         const getfriends = async () => {
            try {
                const res = await axios.post('/friends',{userid : id})
             console.log(res.data)
                 setFriends(res.data)
                 setStore(res.data)
               
               
            }catch(err){
                console.log('cant get friends data from db',err)
            }
        }
             getfriends()
        }
           
    },[id])

let v = 1;

useEffect(()=> {
    let el = document.getElementById('pp_con')
    if(windowWidth < 500) {
        if (active){ 
            el.style.display = 'none'}
     else{
      el.style.display = 'block'
     }
      }
    
},[active])



  return (
    <div id="pp_con" className={`${styles.people_bar} w-[25rem] h-full  text-white bg-gradient-to-r from-slate-900  to-slate-800 overflow-y-auto`}>
    <div className="">
        
        <div className={`${styles.searchWrapper} flex items-center  px-4 py-5`}>
            <div className={`${styles.searchContainer} w-full flex flex-row rounded-full`}>
                <input 
                    type="text" 
                    name="search"
                    className="w-3/4 px-4 py-3 bg-gradient-to-r from-slate-600  to-slate-500 text-black focus:outline-none focus:ring focus:bg-slate-100 focus:border-blue-500 rounded-l-xl" 
                    placeholder="Search friends..."
                    onChange={(e)=> handleChange(e)}
                    required 
                />
                <button 
                    className="w-1/4 bg-slate-500 text-white rounded-r-xl transition duration-300 ease-in-out hover:opacity-70 flex items-center justify-center"
                >
                    <Image src={'/search2.png'} className="mx-auto mix-blend-color-burn" height={30} width={30} alt="Search" />
                </button>
            </div>
        </div>
        {/* <div className="font-bold mb-4 ml-4">Contacts</div> */}
        <ul className={`${styles.friendsList}`}>
           
                  {
                    friends.map((val,index)=> {
                        return (
                            <li
                                key={v++}
                                onClick={() => {
                                    setSelected(val.userid)
                                    setSelectedName(val.username)
                                   windowWidth < 500 && setActive(true)
                                    
                                }}
                                className={`flex items-center py-3 px-2  cursor-pointer bg-slate-800 hover:bg-slate-700 `}
                                
                            >
                                <img
                                    src="https://via.placeholder.com/30"
                                    alt="User Profile"
                                    className="w-10 h-10 rounded-full mr-2"
                                />
                                
                              <div className="flex flex-col ml-2">
                              <span className={`${styles.user} font-semibold text-lg`}>{val.username}</span>
                              <span className={`${styles.chat} text-xs overflow-hidden`}>{ val?.latestMsg ? val.latestMsg.substring(0,20)+'...':''}</span>

                                </div>  
                               
                            </li>
                        )
                    })
                  }
                
        </ul>
    </div>
</div>


  );
}
