const AddContentModal = ({ isModalOpen, setIsModalOpen, closeModal}) => {
    
  const colors = [
    { name: 'Red', class: 'bg-red-300' },
    { name: 'Green', class: 'bg-green-300' },
    { name: 'Blue', class: 'bg-blue-300' },
    { name: 'Yellow', class: 'bg-yellow-300' },
    { name: 'Pink', class: 'bg-pink-300' }
  ];
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Background overlay with opacity */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* The modal itself with full opacity */}
            <div className="bg-white border border-black rounded-xl flex flex-col items-center justify-center w-[500px] h-[500px] p-4 relative z-10">
                <button className="top-2 right-3 absolute text-2xl" onClick={closeModal}> 
                    <p>&times;</p>
                </button>
                <div className="text-2xl font-bold top-2 absolute">
                    Add Content

                </div>
                <div className="flex flex-col space-y-4">
                    <button className="bg-red-400 cursor-pointer rounded-lg px-2 py-1.5 ">
                        Multiple Choice
                    </button >
                    <button className="bg-red-400 cursor-pointer  rounded-lg px-2 py-1.5 ">
                        Picture Choice
                    </button>
                    <button className="bg-red-400 cursor-pointer rounded-lg px-2 py-1.5 ">
                        Short Text
                    </button>
                    <button className="bg-red-400 cursor-pointer rounded-lg px-2 py-1.5 ">
                        Long Text
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AddContentModal;
