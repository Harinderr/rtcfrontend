'use client'
import { userContext } from '@/providers/UserContextProvider'
import Link from 'next/link'
import Image from 'next/image'
import styles from './navbar.module.css'
import { useContext } from 'react'
import { useRouter } from 'next/navigation'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus} from '@fortawesome/free-solid-svg-icons'
export default function Navbar() {
    const { name} = useContext(userContext)
    const router = useRouter()

    return (
        <div className="wrapper w-full bg-gradient-to-r  from-purple-800 via-pink-500 to-blue-900 flex flex-row justify-between px-20 py-4">
        <div className="flex items-center">
            <img src="/logo.png" alt="Logo" className="h-10 w-10 mr-2" />
            <div className="text-white text-lg font-bold">Messenger</div>
        </div>
       <div className="wrapper_right flex items-center w-40 justify-between">
       <div className="add   w-10 " onClick={()=>router.push('/addpeople')} >
        
            <FontAwesomeIcon icon={faPlus} className='text-white text-xl hover:text-blue-500 ' />
        
       </div>
        <div className="flex items-center">
        
            <div className="text-white mr-4">{name}</div>
            <div className="rounded-full border-2 border-lime-50 bg-yellow-700 h-10 w-10 flex items-center justify-center cursor-pointer" onClick={() => router.push('/dashboard')}>
                <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 19a2 2 0 01-2 2H7a2 2 0 01-2-2v-5a7 7 0 0114 0v5z"/>
                </svg>
            </div>
        </div>
        </div>
    </div>
    
    )
}