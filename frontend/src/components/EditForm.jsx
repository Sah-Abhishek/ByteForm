import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useFormStore from "../store/formStore"; // Zustand store for selected form
import LeftSideBar from "./LeftSideBar";
import FormPage from "./FormPage"; // Assuming the page rendering component is FormPage
import axios from "axios";

const EditForm = () => {
    const { formId } = useParams(); // Get form ID from URL
    const { user } = useAuthStore(); // Get the current user from auth store
    const { selectForm, getAllForms, selectedForm, currentPageIndex, setCurrentPageIndex, updateFormTitleAndDescription } = useFormStore(); // Zustand store for selected form

    const [formTitle, setFormTitle] = useState(selectedForm?.title); // Form title state
    const baseURL = import.meta.VITE_BACK_URL;
    const state = useFormStore.getState();

    const [isEditing, setIsEditing] = useState(false);
    const titleRef = useRef(null);
    const [publishLoading, setPublishLoading] = useState(false);

    useEffect(() => {
        selectForm(formId);

        console.log("The is the newest state: ", state);
    }, [formId, selectForm]);

    useEffect(() => {
        // Fetch form data if not already selected
        if (!selectedForm) {
            selectForm(formId);
        }
    }, [formId, selectForm, selectedForm]);

    const handleNextPage = () => {
        if (currentPageIndex < selectedForm.pages.length - 1) {
            setCurrentPageIndex(currentPageIndex + 1); // Update page index in the store
        }
    };

    const handlePreviousPage = () => {
        if (currentPageIndex > 0) {
            setCurrentPageIndex(currentPageIndex - 1); // Update page index in the store
        }
    };

    const handleDoubleClick = () => {
        setIsEditing(true);
    };

    const handleBlur = () => {
        setIsEditing(false);
    };

    const handleClickOutsideTitle = (e) => {
        if (titleRef.current && !titleRef.current.contains(e.target)) {
            setIsEditing(false);
            //   updateFormTitleAndDescription(formTitle);
        }
    };
    const publishForm = async () => {
        setPublishLoading(true);
        try {
            const response = await axios.post(`http://localhost:3000/form/publish/${selectedForm._id}`);


        } catch (error) {
            console.log("There was an error while publishing form: ", error);
        } finally {
            setPublishLoading(false);
        }
        getAllForms();

    }

    useEffect(() => {
        document.addEventListener("click", handleClickOutsideTitle);
        return () => {
            document.removeEventListener("click", handleClickOutsideTitle);
        };
    });

    return (
        <div className="h-screen flex flex-col">
            {/* Navigation Bar */}
            <nav className="flex items-center justify-between w-full py-1 px-4 bg-gray-100 shadow-md">
                <div className="flex items-center gap-x-2">
                    <button className="scale-75 bg-black rounded-md text-white p-2 h-10 w-10 font-semibold m-2 mx-3 mr-2">
                        {user.username.charAt(0)}
                    </button>

                    <span className="text-sm">{user.username}</span>
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 26 24" strokeWidth={1.5} stroke="currentColor" className="size-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>
                    <div ref={titleRef}>
                        {isEditing ? (
                            <div>
                                <input onChange={(e) => setFormTitle(e.target.value)} value={formTitle} />
                            </div>
                        ) : (
                            <div onDoubleClick={handleDoubleClick} onBlur={handleBlur}>
                                <span className="text-sm">{formTitle}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <div>

                        <button onClick={publishForm} className="flex items-center bg-black  text-white rounded-md px-3 py-1 mr-4 text-mbase">
                            {publishLoading ? (
                                <div className="h-[24px] w-[60px]">
                                    <div role="status">
                                        {/* <svg aria-hidden="true" class="inline w-6 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
                                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
                                        </svg> */}
                                        Loading...
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 mr-2">
                                        <path d="M3.478 2.404a.75.75 0 0 0-.926.941l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.404Z" />
                                    </svg>
                                    Publish
                                </div>
                            )}

                        </button>

                    </div>
                    <div>
                        <button className="bg-[#ae4e09] text-white rounded-md px-3 py-1 mr-4 text-mbase">View plans</button>
                    </div>
                </div>
            </nav >

            {/* Main Content */}
            < div className="flex flex-grow" >
                {/* Sidebar */}
                < div className="w-1/5" >
                    <LeftSideBar setCurrentPageIndex={setCurrentPageIndex} />
                </div >

                {/* Form Content */}
                < div className="flex justify-center items-center flex-col flex-grow m-4 p-6 rounded-xl border-red-500" >
                    {
                        selectedForm ? (
                            <FormPage
                                selectedForm={selectedForm}
                                currentPageIndex={currentPageIndex}  // Get current page index from the store
                                handleNextPage={handleNextPage}
                                handlePreviousPage={handlePreviousPage}
                            />
                        ) : (
                            <p>Loading form...</p>
                        )}
                </div >
            </div >
        </div >
    );
};

export default EditForm;
