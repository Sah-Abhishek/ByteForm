import React, { useState } from "react";
import useFormStore from "../store/formStore";
import AddContentModal from "./AddContentModal";

const LeftSideBar = ({ setCurrentPageIndex }) => {
  const { selectedForm, reorderPages, deletePage } = useFormStore();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const colors = [
    { name: 'Red', class: 'bg-red-300' },
    { name: 'Green', class: 'bg-green-300' },
    { name: 'Blue', class: 'bg-blue-300' },
    { name: 'Yellow', class: 'bg-yellow-300' },
    { name: 'Pink', class: 'bg-pink-300' }
  ];

  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => setIsModalOpen(true);
  const openModal = () => setIsModalOpen(false);

  if (!selectedForm) {
    return <p>Loading...</p>; // Fallback if no form is selected
  }

  const handleDragStart = (index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Allow drop
  };

  const handleDrop = (index) => {
    if (draggedIndex !== null && draggedIndex !== index) {
      reorderPages(draggedIndex, index); // Update page order in Zustand
    }
    setDraggedIndex(null); // Reset drag state
  };

  const changeCurrentPageIndex = (index) => {
    setCurrentPageIndex(index);
  };

  // State to control dropdown visibility
  const [dropdownOpen, setDropdownOpen] = useState(null); // Track which page's dropdown is open

  // Function to stop the event propagation when SVG is clicked
  const handleSvgClick = (e, index) => {
    e.stopPropagation(); // Stop the click event from reaching the parent div
    setDropdownOpen(dropdownOpen === index ? null : index); // Toggle the dropdown for the clicked page
  };

  // Function to close the dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (dropdownOpen !== null && !e.target.closest(".dropdown")) {
      setDropdownOpen(null); // Close the dropdown if clicked outside
    }
  };

  // Delete page function
  const handleDeletePage = (index) => {
    console.log("This is from the leftSidebar handleDeletePage: ", selectedForm.pages[index]);
    deletePage(selectedForm.pages[index]._id); // Call your delete function from zustand store
    setDropdownOpen(null); // Close the dropdown after deleting
  };

  // Listen for clicks outside the dropdown
  React.useEffect(() => {
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <div className="w-1/8 bg-gray-200 h-full sticky top-0 px-5 pt-4 shadow-md border rounded-xl overflow-y-auto scrollbar-hidden">
      <div className="flex flex-col items-center">
        <div>
          <button onClick={openModal} className="bg-black px-3 py-2 m-4 text-white rounded-xl font-bold">
            +&nbsp;Add Content
          </button>
        </div>
        <h2 className="text-xl font-bold mb-4">Pages</h2>
        {selectedForm.pages.map((page, index) => (
          <div
            key={page._id}
            onClick={() => changeCurrentPageIndex(index)}
            className="w-full flex items-center p-3 mb-2 text-sm bg-white border rounded-xl shadow-sm cursor-pointer hover:bg-gray-50 relative" // Set position relative to support absolute positioning
            draggable
            onDragStart={() => handleDragStart(index)}
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(index)}
          >
            <div className={`mr-2 rounded-lg 
              ${colors[index % colors.length].class}
               px-3 font-bold py-1 text-white`}>
              {index + 1}
            </div>
            <h3 className="font-medium">{page.title}</h3>

            {/* SVG icon, position absolute to the right */}
            <span
              className="rounded-lg hover:bg-gray-300 absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
              onClick={(e) => handleSvgClick(e, index)} // Toggle dropdown for this page
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M4.5 12a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Zm6 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0Z" clipRule="evenodd" />
              </svg>
            </span>

            {/* Dropdown for Delete */}
            {dropdownOpen === index && (
              <div className="dropdown absolute right-3 top-1/2 transform -translate-y-1/2 bg-white shadow-md border rounded-md mt-2 p-2 w-24 text-sm">
                <button onClick={() => handleDeletePage(index)} className="text-red-500 w-full text-xs px-1.5 py-1 hover:bg-gray-100 rounded-md">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {isModalOpen ? null : (
        <AddContentModal isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen} closeModal={closeModal} />
      )}
    </div>
  );
};

export default LeftSideBar;
