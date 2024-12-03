import axios from "axios";
import { BsThreeDots } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useAuthStore from "../store/authStore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFormStore from "../store/formStore";
import { useStore } from "zustand";

const Home = () => {
    const { token, user } = useAuthStore();
    const baseURL = import.meta.env.VITE_BACK_URL;
    const navigate = useNavigate();
    const { forms, setForms } = useFormStore();
    const { selectForm, getAllForms } = useFormStore();
    // const { user } = useAuthStore();

    useEffect(() => {
        // console.log(user, token);
        if (!user || !token) {
            navigate('/login');
        }
    }, [user, token])

    // Fetch forms data when the component mounts or when forms change
    useEffect(() => {
        const fetchForms = async () => {
            try {
                const response = await axios.get(`${baseURL}/getAllForms`);
                setForms(response.data); // Correctly set the forms state in zustand
                console.log("Fetched forms: ", response.data); // Log the data from the response
            } catch (error) {
                console.log("Error fetching forms: ", error);
            }
        };
        fetchForms();

        // getAllForms(); // Fetch forms when the component mounts or when forms change in zustand
    }, [forms]); // Dependency on the forms state

    // Function to create a new form
    const createDefaultForm = async () => {
        try {
            const response = await axios.post(`${baseURL}/createNewForm`, {}, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            });
            if (response.status === 200) {
                toast.success("Form created");
                // After creating the form, refetch forms
                const newForms = await axios.get(`${baseURL}/getAllForms`);
                setForms(newForms.data); // Update zustand with the latest forms

            }
        } catch (err) {
            console.log("Error creating form: ", err);
        }
    };

    const handleFormClick = async (formId) => {
        selectForm(formId);
        console.log("This is the formId from Home.jsx: ", formId);
        navigate(`/form/${formId}`);
    };

    return (
        <div>
            <nav className="flex items-center justify-between w-full pb-4">
                <div className="flex items-center">
                    <button className="bg-black rounded-md text-white p-2 h-10 w-10 font-semibold m-2 mx-3">
                        {user ? user.username.charAt(0) : "?"} {/* Default to "?" if user is null */}
                    </button>
                    <span>{user ? user.username : "Guest"}</span> {/* Fallback to "Guest" if user is null */}

                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-3 mx-3">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </span>
                </div>
                <div><button className="bg-red text-white rounded-md px-3 py-1 mr-4 bg-[#ae4e09] text-sm">View plans</button></div>
            </nav>
            <div className="flex flex-col justify-center items-center mx-6 bg-gray-100 h-[calc(100vh-72px)] overflow-auto rounded-xl">
                <div className="flex justify-center items-center">
                    <button onClick={createDefaultForm} className="px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-700 transition w-80 font-semibold">+ &nbsp; Create a new form</button>
                </div>
                <hr className="my-4 mt-10 border-t-2 border-gray-300 w-[1700px]" />
                <div className="flex items-center px-4 py-3 text-sm w-[1500px]">
                    <div className="w-[66.66%]"></div>
                    <div className="flex justify-between w-[33.33%]">
                        <h3>Responses</h3>
                        <h3 className="mr-20">Updated At</h3>
                    </div>
                </div>

                <div className="mt-4 space-y-3">
                    {forms.map((form, index) => (
                        <div onClick={() => handleFormClick(form._id)} key={index} className="flex cursor-pointer items-center justify-between px-4 py-3 bg-white border border-gray-300 w-[1500px] rounded-lg hover:shadow-[0_2px_4px_rgba(0,0,0,0.05),0_-2px_4px_rgba(0,0,0,0.05),2px_0_4px_rgba(0,0,0,0.05),-2px_0_4px_rgba(0,0,0,0.05)] transition">
                            <h3 className="w-[66.66%]">{form.title}</h3>
                            <div className="w-[33.33%] flex justify-between">
                                <div className="px-7">
                                    <div className="flex">{form.responses}</div>
                                </div>
                                <div className="flex space-x-12">
                                    <span className="text-gray-500">{form.updatedAt.split('T')[0]}</span>
                                    <span className="hover:rounded-md p-1 hover:bg-gray-200 transition">
                                        <BsThreeDots />
                                    </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Home;
