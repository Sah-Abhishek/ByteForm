import { useState } from 'react';
import googleLogo from '../assets/google-logo-removebg-preview.png';
import microsoftLogo from '../assets/Microsoft-logo (1).png'
import SignupEmail from './SignupEmail';
import { Link } from 'react-router-dom';

const Signup = () => {
    const [signupEmail, setSignupEmail] = useState(false);
    
    // const handleButtonSubmit = () => {
        
    // }

    return (
        <div>
            {/* Signup */}
            <nav className="fixed top-0 right-0 m-3 text-sm">
                <div>Already have an account ?<span><Link to="/login"><button className="border rounded-md px-4 py-1 border-black mx-2">Log in</button></Link></span></div>
            </nav>
            <div className="flex flex-col space-y-5 justify-center items-center h-screen">
                <div>
                    <div className="text-3xl font-bold mb-5">ByteForm</div>
                </div>
                {signupEmail ?
                    (<SignupEmail />) :
                    (<>
                        <div className="border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm">
                            <button className="flex items-center space-x-6 justify-self-center">
                                <img src={googleLogo} alt="Google Logo" className='w-[50px] h-[30px]' />
                                <span>Signup with Google</span>
                            </button>
                        </div>
                        <div className="border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm">
                            <button className="flex items-center space-x-6 justify-self-center">
                                <img src={microsoftLogo} alt="Google Logo" className='w-[30px] h-[30px]' />
                                <span>Signup with Microsoft</span>
                            </button>
                        </div>
                        <div className='text-gray-800 font-semibold'>
                            OR
                        </div>
                        <div className="flex justify-center items-center border-2 border-black bg-black text-white px-3 py-2 mb-3 h-12 rounded-md w-80 font-semibold">
                            <button
                                className="flex items-center justify-center w-full h-full text-sm bg-transparent border-0"
                                onClick={() => setSignupEmail(true)}
                            >
                                {/* <img src={microsoftLogo} alt="Google Logo" className="w-[30px] h-[30px]" /> */}
                                <span>Signup with email</span>
                            </button>
                        </div>

                    </>
                    )
                }


            </div>
        </div>
    );
};

export default Signup;
