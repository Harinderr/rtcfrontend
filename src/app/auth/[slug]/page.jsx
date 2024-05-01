import Signup from "@/components/registerform/register"
import LogIn from "@/components/loginform/login"
export default function User({params}) {
    const {slug} = params;
    return (
        <div>
        {slug == 'register' && <Signup></Signup> }
        {slug == 'login' && <LogIn></LogIn> }
        </div>
        
       
    )
}