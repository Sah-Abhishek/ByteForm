import { useState } from 'react';
import googleLogo from '../assets/google-logo-removebg-preview.png';
import microsoftLogo from '../assets/Microsoft-logo (1).png'
import SignupEmail from './SignupEmail';

const Login = () => {
    return (
        <div>
        {/* Signup */}
        <nav className="fixed top-0 right-0 m-3 text-sm">
            <div>Don't have an account ?<span><button className="border rounded-md px-4 py-1 border-black mx-2">Sign up</button></span></div>
        </nav>
        <div className="flex flex-col space-y-5 justify-center items-center h-screen">
            <div>
                <div className="text-3xl font-bold mb-5">ByteForm</div>
            </div>
            <div className="">
                            <button className="flex items-center space-x-6 justify-self-center border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm hover:bg-slate-200">
                                <img src={googleLogo} alt="Google Logo" className='w-[50px] h-[30px]' />
                                <span>Continue with Google</span>
                            </button>
                        </div>
                        <div className="">
                        <button className="flex items-center space-x-6 justify-self-center border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm hover:bg-gray-200">
                        <img src={microsoftLogo} alt="Google Logo" className='w-[30px] h-[30px]' />
                                <span>Continue with Microsoft</span>
                            </button>
                        </div>
                        <div className='text-gray-800 font-semibold'>
                            OR
                        </div>
                        <div>
                            <input type="text" placeholder="Email Address" className='border border-gray-400 p-2 rounded-lg w-80'/>
                        </div>
                        <div>
                            <input type="password" placeholder="Password" className='border border-gray-400 p-2 rounded-lg w-80'/>
                        </div>
                        <div className="flex justify-center items-center border-2 bg-black text-white px-3 py-2 hover:bg-gray-700 mb-3 h-12 rounded-md w-80 font-semibold">
                            <button className="flex items-center space-x-6 justify-self-center text-sm">
                                {/* <img src={microsoftLogo} alt="Google Logo" className='w-[30px] h-[30px]' /> */}
                                <span>Continue with email</span>
                            </button>
                        </div>


            </div>
        </div>

        
    )
}

export default Login;