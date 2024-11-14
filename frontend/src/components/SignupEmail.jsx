import { useState } from "react";

const SignupEmail = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    return (
        <div className="flex flex-col justify-center items-center space-y-5">
            <div className="">
                <input type="text" placeholder="Username"  className="border border-gray-400 px-3 py-2 rounded-md w-72"/>
            </div>
            <div className="">
                <input type="text" placeholder="Email"  className="border border-gray-400 px-3 py-2 rounded-md w-72"/>
            </div>
            <div className="">
                <input type="password" placeholder="Password" className="border border-gray-400 px-3 py-2 rounded-md w-72"/>
            </div>
            <div className="text-sm w-64 flex relative">

                    <input type="checkbox" className="peer absolute top-0 left-0 w-6 h-6 border border-gray-300 rounded-md focus:text-black checked:text-black checked:border-black focus:ring-0" />
                    <p className="ml-8">I agree to Byteform’s <a href="#"><u>Terms of Service, Privacy Policy</u></a> and <a href="#"> <u>Data Processing Agreement</u></a>.</p>
                
            </div>

            <div >
                <button className="bg-black text-white px-3 py-2 rounded-md text-sm h-10 w-72 font-semibold mt-5 hover:bg-gray-700">Create my free account</button>
            </div>
        </div>
    )
}

export default SignupEmail;