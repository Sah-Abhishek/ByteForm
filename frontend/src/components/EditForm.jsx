// EditForm.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useFormStore from "../store/formStore"; // Zustand store for forms
import LeftSideBar from "./LeftSideBar";
import FormPage from "./FormPage"; // Assuming the page rendering component is FormPage

const EditForm = () => {
    const { formId } = useParams(); // Get form ID from URL
    const { user } = useAuthStore(); // Get the current user from auth store
    const { selectForm, selectedForm, } = useFormStore(); // Zustand store for selected form
    const [currentPageIndex, setCurrentPageIndex] = useState(0); // Track current page
    const formTitle = selectedForm.title;
    const baseURL = import.meta.VITE_BACK_URL;
    const state = useFormStore.getState();

    useEffect(() => {
        selectForm(formId);
        
    console.log("The is the newest state: ", state);
    }, [formId, selectForm])

    useEffect(() => {
        // Fetch form data if not already selected
        if (!selectedForm) {
            selectForm(formId);
        }
    }, [formId, selectForm, selectedForm]);

    const handleNextPage = () => {
        if (currentPageIndex < selectedForm.pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1);
        }
    };

    return (
        <div className="h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 shadow-md">
                <div className="flex items-center gap-x-2">
                    <button className=" scale-75  bg-black rounded-md text-white p-2 h-10 w-10 font-semibold m-2 mx-3 mr-2">
                        {user.username.charAt(0)}
                    </button>

                    <span className="text-sm">{user.username}</span>
                    <div className="">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>

                    <span className="text-sm">{formTitle}</span>
                </div>
                <div>
                    <button className="bg-[#ae4e09] text-white rounded-md px-3 py-1 mr-4 text-sm">
                        View plans
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <div className="flex flex-grow">
                {/* Sidebar */}
                <div className="w-1/5">
                    {/* Pass setCurrentPageIndex to LeftSideBar */}
                    <LeftSideBar setCurrentPageIndex={setCurrentPageIndex} />
                </div>

                {/* Form Content */}
                <div className="flex-grow border m-4 p-6 rounded-xl">
                    {selectedForm ? (
                        <FormPage
                            selectedForm={selectedForm}
                            currentPageIndex={currentPageIndex}
                            handleNextPage={handleNextPage}
                            handlePreviousPage={handlePreviousPage}
                        />
                    ) : (
                        <p>Loading form...</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default EditForm;
