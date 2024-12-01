import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../store/authStore";
import useFormStore from "../store/formStore"; // Zustand store for selected form
import LeftSideBar from "./LeftSideBar";
import FormPage from "./FormPage"; // Assuming the page rendering component is FormPage

const EditForm = () => {
  const { formId } = useParams(); // Get form ID from URL
  const { user } = useAuthStore(); // Get the current user from auth store
  const { selectForm, selectedForm, currentPageIndex, setCurrentPageIndex } = useFormStore(); // Zustand store for selected form

  const [formTitle, setFormTitle] = useState(selectedForm?.title); // Form title state
  const baseURL = import.meta.VITE_BACK_URL;
  const state = useFormStore.getState();
  
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef(null);
  
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
      updateFormTitleAndDescription(formTitle);
    }
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideTitle);
    return () => {
      document.removeEventListener("click", handleClickOutsideTitle);
    };
  });

  return (
    <div className="h-screen flex flex-col">
      {/* Navigation Bar */}
      <nav className="flex items-center justify-between w-full py-2 px-4 bg-gray-100 shadow-md">
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
        <div>
          <button className="bg-[#ae4e09] text-white rounded-md px-3 py-1 mr-4 text-sm">View plans</button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex flex-grow">
        {/* Sidebar */}
        <div className="w-1/5">
          <LeftSideBar setCurrentPageIndex={setCurrentPageIndex} />
        </div>

        {/* Form Content */}
        <div className="flex justify-center items-center flex-col flex-grow m-4 p-6 rounded-xl border-red-500">
          {selectedForm ? (
            <FormPage
              selectedForm={selectedForm}
              currentPageIndex={currentPageIndex}  // Get current page index from the store
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
