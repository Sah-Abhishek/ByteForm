import React, { useState } from "react";
import useFormStore from "../store/formStore";
import AddContentModal from "./AddContentModal";

const LeftSideBar = ({ setCurrentPageIndex }) => {
  const { selectedForm, reorderPages } = useFormStore();
  const [draggedIndex, setDraggedIndex] = useState(null);
  const colors = [
    { name: 'Red', class: 'bg-red-300' },
    { name: 'Green', class: 'bg-green-300' },
    { name: 'Blue', class: 'bg-blue-300' },
    { name: 'Yellow', class: 'bg-yellow-300' },
    { name: 'Pink', class: 'bg-pink-300' }
  ];
  
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  }

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
            className="w-full flex items-center p-3 mb-2 text-sm bg-white border rounded-xl shadow-sm cursor-pointer hover:bg-gray-50"
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