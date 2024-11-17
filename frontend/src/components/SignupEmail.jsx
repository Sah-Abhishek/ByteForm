import { useForm } from "react-hook-form";
import useAuthStore from "../store/authStore";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignupEmail = () => {
    const { signup, error } = useAuthStore();

    // Initialize React Hook Form
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [message, setMessage] = useState(error);
    const navigate = useNavigate();

    // Form submit handler
    const handleButtonSubmit = async (data) => {
        console.log("Form data: ", data);
        const { username, email, password } = data;
        
        try {
            setMessage();
            const response = await signup(username, email, password);
            if (response.status === 201) {
                setMessage(response.data.message);  // Set the success message from backend
                navigate("/login");  // Navigate to login page
            } else {
                setMessage("Something went wrong, please try again.");
            }
        } catch (err) {
            console.error("Signupkkk error: ", err);
            console.error("Signup error: ", message);
            // If backend provides a specific error message like 'email already in use'
            setMessage(error);
        }
    }

    return (
        <div className="flex flex-col justify-center items-center space-y-5">
            {/* Form wrapper */}
            <form onSubmit={handleSubmit(handleButtonSubmit)} className="space-y-5">
                {/* Username Input */}
                <div>
                    <input
                        type="text"
                        placeholder="Username"
                        className={`border border-gray-400 px-3 py-2 rounded-md w-72 ${errors.username ? 'border-red-500' : ''}`}
                        {...register("username", { required: "Username is required" })}
                    />
                    {errors.username && <p className="text-red-600 text-xs">{errors.username.message}</p>}
                </div>

                {/* Email Input */}
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        className={`border border-gray-400 px-3 py-2 rounded-md w-72 ${errors.email ? 'border-red-500' : ''}`}
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^[a-zA-Z0-9._-]+@[a-zAZ0-9.-]+\.[a-zA-Z]{2,6}$/,
                                message: "Invalid email address"
                            }
                        })}
                    />
                    {errors.email && <p className="text-red-600 text-xs">{errors.email.message}</p>}
                </div>

                {/* Password Input */}
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        className={`border border-gray-400 px-3 py-2 rounded-md w-72 ${errors.password ? 'border-red-500' : ''}`}
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 6,
                                message: "Password must be at least 6 characters"
                            }
                        })}
                    />
                    {errors.password && <p className="text-red-600 text-xs">{errors.password.message}</p>}
                </div>

                {/* Checkbox */}
                <div className="flex flex-col text-sm w-64 relative">
                    <input
                        type="checkbox"
                        className="peer absolute top-0 left-0 w-6 h-6 border border-gray-300 rounded-md focus:text-black checked:text-black checked:border-black focus:ring-0"
                        {...register("terms", { required: "You must agree to the terms and conditions" })}
                    />
                    <p className="ml-8">
                        I agree to Byteform’s <a href="#"><u>Terms of Service, Privacy Policy</u></a> and <a href="#"><u>Data Processing Agreement</u></a>.
                    </p>
                    {errors.terms && <p className="text-red-600 text-xs">{errors.terms.message}</p>}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="bg-black text-white px-3 py-2 rounded-md text-sm h-10 w-72 font-semibold mt-5 hover:bg-gray-700"
                >
                    Create my free account
                </button>
                <p className="text-sem text-red-500">{message}</p>
            </form>
        </div>
    );
};

export default SignupEmail;
