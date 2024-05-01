"use client";

import { useState } from "react";
import Image from "next/image";
import styles from './people.module.css'
export default function People({ onlinePeople , setSelected ,selected}) {
//   console.log(onlinePeople)
let v = 1;
  return (
    <div className={`${styles.people_bar} w-[25rem] h-full  text-white bg-gradient-to-r from-blue-900  to-purple-900 overflow-y-auto`}>
    <div className="">
        
        <div className="flex items-center  px-4 py-5">
            <div className="w-full flex flex-row rounded-full">
                <input 
                    type="text" 
                    className="w-3/4 px-4 py-3 bg-gradient-to-r from-blue-500  to-purple-500 text-black focus:outline-none focus:ring focus:bg-slate-100 focus:border-blue-500 rounded-l-xl" 
                    placeholder="Search friends..."
                    required 
                />
                <button 
                    className="w-1/4 bg-purple-500 text-white rounded-r-xl transition duration-300 ease-in-out hover:opacity-70 flex items-center justify-center"
                >
                    <Image src={'/search2.png'} className="mx-auto mix-blend-color-burn" height={30} width={30} alt="Search" />
                </button>
            </div>
        </div>
        {/* <div className="font-bold mb-4 ml-4">Contacts</div> */}
        <ul>
            {onlinePeople.size &&
                [...onlinePeople].map(([key, value]) => {
                    return (
                        <li
                            key={v++}
                            onClick={() => {
                                setSelected(key)
                                
                            }}
                            className={`flex items-center border-b-purple-400 py-3 px-2  cursor-pointer bg-gradient-to-r from-blue-800  to-purple-800 hover:opacity-80 ${selected == key ? ' border-l-8 border-lime-500 bg-gradient-to-r from-blue-600  to-purple-600 ' : ''}`}
                        >
                            <img
                                src="https://via.placeholder.com/30"
                                alt="User Profile"
                                className="w-8 h-8 rounded-full mr-2"
                            />
                            <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            <span className="font-semibold text-lg">{value}</span>
                        </li>
                    );
                })}
        </ul>
    </div>
</div>


  );
}
