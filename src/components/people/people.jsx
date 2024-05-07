"use client";

import { useContext, useEffect, useState } from "react";
import Image from "next/image";
import styles from './people.module.css'
import { userContext } from "@/providers/UserContextProvider";
import axios  from "@/utility/axios";
export default function People({ onlinePeople , setSelected ,selected}) {
    const {id}= useContext(userContext)
    const [friends, setFriends] = useState([])
   
 
    useEffect(()=> {
   
      if(id){ 
        console.log(id)
         const getfriends = async () => {
            try {
                const res = await axios.post('/friends',{userid : id})
               setFriends(res.data)
            }catch(err){
                console.log('cant get friends data from db',err)
            }
        }
             getfriends()
        }
           
    },[id])
//   console.log(onlinePeople)
// console.log(friends)
let v = 1;
// if (!id) {
//     return <div>Loading...</div>;
//   }
// console.log(lastmsg)
  return (
    <div className={`${styles.people_bar} w-[25rem] h-full  text-white bg-gradient-to-r from-slate-900  to-slate-800 overflow-y-auto`}>
    <div className="">
        
        <div className="flex items-center  px-4 py-5">
            <div className="w-full flex flex-row rounded-full">
                <input 
                    type="text" 
                    className="w-3/4 px-4 py-3 bg-gradient-to-r from-slate-600  to-slate-500 text-black focus:outline-none focus:ring focus:bg-slate-100 focus:border-blue-500 rounded-l-xl" 
                    placeholder="Search friends..."
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
        <ul>
            {/* {onlinePeople.size &&
                [...onlinePeople].map(([key, value]) => { */}
                  {
                    friends.map((val,index)=> {
                        return (
                            <li
                                key={v++}
                                onClick={() => {
                                    setSelected(val.friendId)
                                    
                                }}
                                className={`flex items-center py-3 px-2  cursor-pointer bg-slate-800 hover:opacity-80 ${selected == val.friendId ? ' border-l-8 border-lime-500 bg-slate-600 ' : ''}`}
                            >
                                <img
                                    src="https://via.placeholder.com/30"
                                    alt="User Profile"
                                    className="w-8 h-8 rounded-full mr-2"
                                />
                                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                                <span className="font-semibold text-lg">{val.friendName}</span>
                               {/* { lastmsg.length > 0 && <span>{lastmsg[0].des}</span>} */}
                            </li>
                        )
                    })
                  }
                {/* })} */}
        </ul>
    </div>
</div>


  );
}
