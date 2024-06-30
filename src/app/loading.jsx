import { Loader } from "lucide-react"

const Loading = () => {
  return (
    <div className="h-screen w-full bg-slate-900 flex justify-center items-center ">
             <Loader className="h-30 w-30 text-white"></Loader>
    </div>
   
  )
}

export default Loading