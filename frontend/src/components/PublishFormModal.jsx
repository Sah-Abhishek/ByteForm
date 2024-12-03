import { useEffect, useState } from "react";

const PublishFormModal = ({ closeModal, isModalOpen, uuid }) => {
  const baseURL = import.meta.env.VITE_BACK_URL;

  const [publishedLink, setPublishedLink] = useState(`${baseURL}/respond/${uuid}`);
  const [copyStatus, setCopyStatus] = useState("Copy Link");
  // const baseURL = import.meta.env.VITE_BACK_URL;


  useEffect(() => {
    if (uuid) {
      setPublishedLink(`${baseURL}/submitpage/${uuid}`);
    }
  }, [uuid]);

  if (!isModalOpen) return null;

  // Function to handle clicks on the background overlay
  const handleBackgroundClick = (e) => {
    // Close the modal only if the click is on the background, not on the modal content
    if (e.target === e.currentTarget) {
      closeModal(); // Close modal when the background overlay is clicked
    }
  };

  // Function to handle copying the link to the clipboard
  const handleCopyClick = () => {
    navigator.clipboard.writeText(publishedLink)
      .then(() => {
        // Update the button text to "Copied"
        setCopyStatus("Copied!");

        // Reset the button text back to "Copy Link" after 2 seconds
        setTimeout(() => {
          setCopyStatus("Copy Link");
        }, 2000);
      })
      .catch((err) => {
        console.error("Failed to copy: ", err);
      });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={handleBackgroundClick}
      aria-modal="true"
      role="dialog"
    >
      {/* Background overlay with opacity */}
      <div className="fixed inset-0 bg-black opacity-50"></div>

      {/* The modal itself with full opacity */}
      <div
        className="bg-white border border-gray-500 rounded-xl flex flex-col items-center w-[800px] h-[500px] relative z-10"
        aria-labelledby="modal-title"
        onClick={(e) => e.stopPropagation()} // Prevent the modal from closing when clicking inside the modal
      >
        <button
          className="top-1 right-3 absolute text-2xl"
          onClick={closeModal}
          aria-label="Close modal"
        >
          <p className="text-4xl text-gray-600">&times;</p>
        </button>

        {/* Modal title */}
        <div className="p-7 bg-gray-100 rounded-tl-xl rounded-tr-xl w-full flex items-center justify-center">
          <h2 id="modal-title" className="text-3xl">Your form has been published! 🎉</h2>
        </div>

        {/* Link input and copy button */}
        <div className="flex flex-col items-center justify-center mt-4 space-y-2">
          <input
            value={publishedLink}
            className="w-[500px] p-2 border border-gray-300 rounded-md"
            readOnly
          />
          <button
            onClick={handleCopyClick}
            className="mt-2 bg-black text-white py-2 px-4 rounded-md hover:bg-gray-800"
          >
            {copyStatus}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PublishFormModal;
