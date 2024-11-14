import { useForm } from 'react-hook-form'; // Import useForm hook from react-hook-form
import googleLogo from '../assets/google-logo-removebg-preview.png';
import microsoftLogo from '../assets/Microsoft-logo (1).png';
import useAuthStore from '../store/authStore';
// import { set } from 'mongoose';

const Login = () => {
    // Destructure the useForm hook
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login, loading, setLoading } = useAuthStore();

    // Handle form submission
    const onSubmit = async (data) => {
        console.log("Form Data:", data); // Log the form data
        const { email, password } = data;

        try {
            // Call the login function from the store
            await login(email, password);
        } catch (error) {
            console.log("Login failed", error);
        }
    };

    return (
        <div>
            {/* Signup */}
            <nav className="fixed top-0 right-0 m-3 text-sm">
                <div>Don't have an account? <span><button className="border rounded-md px-4 py-1 border-black mx-2">Sign up</button></span></div>
            </nav>
            <div className="flex flex-col space-y-5 justify-center items-center h-screen">
                <div className="text-3xl font-bold mb-5">ByteForm</div>

                {/* Google and Microsoft Buttons */}
                <div className="">
                    <button className="flex items-center space-x-6 justify-self-center border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm hover:bg-slate-200">
                        <img src={googleLogo} alt="Google Logo" className='w-[50px] h-[30px]' />
                        <span>Continue with Google</span>
                    </button>
                </div>
                <div className="">
                    <button className="flex items-center space-x-6 justify-self-center border border-black px-3 py-2 mb-3 rounded-md w-80 font-semibold text-sm hover:bg-gray-200">
                        <img src={microsoftLogo} alt="Microsoft Logo" className='w-[30px] h-[30px]' />
                        <span>Continue with Microsoft</span>
                    </button>
                </div>

                <div className='text-gray-800 font-semibold'>OR</div>

                {/* Form for Email and Password */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Email input */}
                    <div>
                        <input
                            type="text"
                            placeholder="Email Address"
                            className={`border ${errors.email ? 'border-red-500' : 'border-gray-400'} p-2 rounded-lg w-80`}
                            {...register('email', {
                                required: "Email is required",
                                pattern: {
                                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
                                    message: "Invalid email address"
                                }
                            })}
                        />
                        {errors.email && (
                            <div className="flex items-center mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <p id="email-error" className="text-red-600 text-sm">{errors.email.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Password input */}
                    <div>
                        <input
                            type="password"
                            placeholder="Password"
                            className={`border ${errors.password ? 'border-red-500' : 'border-gray-400'} p-2 rounded-lg w-80`}
                            {...register('password', {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />
                        {errors.password && (
                            <div className="flex items-center mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-600 mr-2">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                                </svg>
                                <p id="password-error" className="text-red-600 text-sm">{errors.password.message}</p>
                            </div>
                        )}
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className={`flex items-center space-x-6 justify-center text-sm `}>
                        <div className={`flex justify-center items-center border-2 ${loading ? "bg-gray-700" : "bg-black"} text-white px-3 py-2 hover:bg-gray-700 mb-3 h-12 rounded-md w-80 font-semibold`}>
                            <span>{loading ? 'Loading...' : 'Continue with email'}</span>
                        </div>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
