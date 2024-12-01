import React, { useState, useEffect, useRef } from "react";
import useFormStore from "../store/formStore"; // Import the Zustand store

const FormPage = ({ selectedForm, currentPageIndex, handleNextPage, handlePreviousPage }) => {
    const currentPage = selectedForm.pages[currentPageIndex];
    const [newOption, setNewOption] = useState('');
    const inputRef = useRef(null);

    if (!selectedForm) {
        return <p>Loading...</p>;
    }

    // Get the functions from Zustand
    const { updatePageTitleAndDescription, removeOption, addOption } = useFormStore();

    // State for title and description
    const [title, setTitle] = useState(currentPage?.title || "");
    const [desc, setDesc] = useState(currentPage?.description || "");
    const [showAddOption, setShowAddOption] = useState(false);

    // Sync the state with the current page whenever currentPageIndex changes
    useEffect(() => {
        setTitle(currentPage?.title || "");
        setDesc(currentPage?.description || "");
    }, [currentPageIndex, currentPage?.title, currentPage?.description]);

    // Handle click outside to close the Add Option input
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (inputRef.current && !inputRef.current.contains(event.target) && newOption === '') {
                setShowAddOption(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [newOption]);

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
        updatePageTitleAndDescription(currentPage._id, title, desc); // Update the page title and description in the store
    };

    // Handle blur event for description (when user clicks outside the field)
    const handleDescBlur = () => {
        updatePageTitleAndDescription(title, desc); // Update the page title and description in the store
    };

    const handleRemoveOption = (option) => {
        console.log("This is the option clicked: ", option);
        removeOption(currentPage._id, option);
    };

    const handleAddOption = () => {
        if (newOption.trim() !== "") {
            // Call the Zustand store's addOption function to add the new option
            addOption(currentPage._id, newOption);
    
            // Clear the new option field after adding
            setNewOption("");
            setShowAddOption(false); // Optionally hide the input after adding the option
        }
        setShowAddOption(false);
    }


    // Focus the input when it's shown
    useEffect(() => {
        if (showAddOption && inputRef.current) {
            inputRef.current.focus();
        }
    }, [showAddOption]); // This effect will run whenever showAddOption changes

    return (
        <div className="flex flex-col justify-center items-center">
            <div className="border-2 border-gray-300 rounded-xl h-[600px] w-[1000px] flex flex-col justify-center items-center">
                <div className="mt-6">
                    {/* Show the current page */}
                    {currentPage ? (
                        <div className="flex flex-col">
                            {/* Title input field */}
                            <textarea
                                className="text-2xl font-semibold focus:outline-none"
                                value={title || ""}
                                onChange={handleTitleChange} // Update state as user types
                                onBlur={handleTitleBlur} // Call Zustand update function when user clicks away
                                placeholder="Page title"
                            />

                            {/* Description input field */}
                            <input
                                className="text-gray-500 mt-4 focus:outline-none"
                                value={desc || ""}
                                onChange={handleDescChange} // Update state as user types
                                onBlur={handleDescBlur} // Call Zustand update function when user clicks away
                                placeholder="Page description"
                            />

                            {/* Check the page type and render accordingly */}
                            {currentPage.type === "text" ? (
                                <input
                                    placeholder="Enter your text here"
                                    className="mt-8 p-2 border border-gray-300 rounded-md"
                                    disabled={true}
                                />
                            ) : currentPage.type === "radioButton" ? (
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
                            ) : currentPage.type === "Multiple Choice Question" ? (
                                <div className="flex flex-col mt-4 ">
                                    <div className="flex flex-col ">
                                        {currentPage.options.map((option, index) => (
                                            <button
                                                key={index}
                                                className="mt-2 px-4 py-2 bg-white text-back border-2 border-gray-700 rounded-md group relative"
                                            >
                                                {/* SVG Icon */}
                                                <span
                                                    className="absolute right-4 opacity-0 group-hover:opacity-100  transition-opacity"
                                                    onClick={() => handleRemoveOption(option)} // Trigger the function with the option
                                                    style={{ cursor: 'pointer' }} // Optional: Change cursor to pointer
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={1.5}
                                                        stroke="currentColor"
                                                        className="size-6"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                                        />
                                                    </svg>
                                                </span>

                                                {/* Option Text */}
                                                {option}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Add Option input field toggle */}
                                    <div>
                                        {showAddOption ? (
                                            <div className="flex border border-black mt-3 px-1 py-1.5 rounded-lg " ref={inputRef}>
                                                <input onChange={(e) => { setNewOption(e.target.value) }} value={newOption} type="text" className="w-full border-black focus:outline-none" />
                                                <button onClick={handleAddOption}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center justify-center border border-black rounded-lg mt-2">
                                                <button onClick={() => setShowAddOption(prev => !prev)} className="w-full flex justify-center items-center border-2 bg-gray-300 rounded-lg px-3 py-1  hover:bg-gray-200">
                                                    Add Option
                                                    <div className="border-2 border-black rounded-full size-6 ml-2">
                                                        <svg className="" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" >
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                                        </svg>
                                                    </div>
                                                </button>
                                            </div>
                                        )}
                                    </div>
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
        </div >
    );
};

export default FormPage;
