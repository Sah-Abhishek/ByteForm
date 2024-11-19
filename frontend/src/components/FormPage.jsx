import React, { useState } from "react";
import useFormStore from "../store/formStore"; // Import the Zustand store

const FormPage = ({ selectedForm, currentPageIndex, handleNextPage, handlePreviousPage }) => {
    if (!selectedForm) {
        return <p>Loading...</p>;
    }

    const currentPage = selectedForm.pages[currentPageIndex];
    const [title, setTitle] = useState(currentPage.title || "");
    const [desc, setDesc] = useState(currentPage.description || "");

    const { updatePageTitleAndDescription } = useFormStore(); // Get the update function from Zustand

    // Handle title change (when typing)
    const handleTitleChange = (e) => {
        setTitle(e.target.value);
    };

    // Handle description change (when typing)
    const handleDescChange = (e) => {
        setDesc(e.target.value);
    };

    // Handle blur event for title (when user clicks outside the field)
    const handleTitleBlur = () => {
        updatePageTitleAndDescription(title, desc); // Update the page title and description in the store
    };

    // Handle blur event for description (when user clicks outside the field)
    const handleDescBlur = () => {
        updatePageTitleAndDescription(title, desc); // Update the page title and description in the store
    };

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="border-2 border-gray-300 rounded-xl h-[600px] w-[1000px] flex flex-col justify-center items-center">
                <div className="mt-6">
                    {/* Show the current page */}
                    {currentPage ? (
                        <div className="flex flex-col">
                            {/* Title input field */}
                            <input
                                className="text-2xl font-semibold focus:outline-none"
                                value={title}
                                onChange={handleTitleChange} // Update state as user types
                                onBlur={handleTitleBlur} // Call zustand update function when user clicks away
                                placeholder="Page title"
                            />

                            {/* Description input field */}
                            <input
                                className="text-gray-500 mt-4 focus:outline-none"
                                value={desc}
                                onChange={handleDescChange} // Update state as user types
                                onBlur={handleDescBlur} // Call zustand update function when user clicks away
                                placeholder="Page description"
                            />
                            
                            {/* Check the page type and render accordingly */}
                            {currentPage.type === "text" ? (
                                <input
                                    placeholder="Enter your text here"
                                    className="mt-8 p-2 border border-gray-300 rounded-md"
                                    disabled={true}
                                />
                            ) : currentPage.type === "multiple-choice" ? (
                                <div className="flex flex-col mt-4">
                                    {currentPage.options.map((option, index) => (
                                        <label key={index} className="flex items-center">
                                            <input
                                                type="radio"
                                                name={currentPage.title}
                                                value={option}
                                                className="mr-2"
                                            />
                                            {option}
                                        </label>
                                    ))}
                                </div>
                            ) : (
                                <p>No specific input type for this page.</p>
                            )}
                        </div>
                    ) : (
                        <p>No pages available.</p>
                    )}
                </div>

                {/* Navigation buttons */}
                <div className="mt-36 flex justify-between gap-x-32">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPageIndex === 0}
                        className={`px-4 py-2 rounded-md ${currentPageIndex === 0
                            ? "bg-gray-300"
                            : "bg-blue-500 text-white"
                            }`}
                    >
                        Previous
                    </button>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPageIndex >= selectedForm.pages.length - 1}
                        className={`px-4 py-2 rounded-md ${currentPageIndex >= selectedForm.pages.length - 1
                            ? "bg-gray-300"
                            : "bg-blue-500 text-white"
                            }`}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FormPage;
